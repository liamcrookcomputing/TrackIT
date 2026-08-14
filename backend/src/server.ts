import "dotenv/config";
import cors from "cors";
import express from "express";
import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { Prisma, PrismaClient, ApplicationStatus } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

const PgSession = connectPgSimple(session);

const sessionStore = new PgSession({
    conString: process.env.DATABASE_URL
})

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: sessionStore
}))

// MIDDLEWARE
function requireAuth(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.session.userId) {
        return res.status(401).json({
            error: "No user session"
        });
    }

    next();
}

app.use("/api/applications", requireAuth);

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({
    adapter
});

const PORT = 3000;

const statusToPrisma = {
    "Saved": ApplicationStatus.Saved,
    "Applied": ApplicationStatus.Applied,
    "Interview": ApplicationStatus.Interview,
    "Technical Assessment": ApplicationStatus.TechnicalAssessment,
    "Final Interview": ApplicationStatus.FinalInterview,
    "Offer": ApplicationStatus.Offer,
    "Rejected": ApplicationStatus.Rejected
} as const;

const statusFromPrisma = {
    "Saved": "Saved",
    "Applied": "Applied",
    "Interview": "Interview",
    "TechnicalAssessment": "Technical Assessment",
    "FinalInterview": "Final Interview",
    "Offer": "Offer",
    "Rejected": "Rejected"
} as const;


// APPLICATIONS
app.get("/health", async (_req, res) => {
    try {
        const userCount = await prisma.user.count();

        res.json({
            status: "ok",
            database: "connected",
            users: userCount
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: "error",
            database: "disconnected"
        });
    }
});

app.get("/api/applications", async (req, res) => {
    try {
        const applications = await prisma.application.findMany({
            where: {
                userId: req.session.userId
            }
        });

        const formattedApplications = applications.map((application) => ({
            ...application,
            status: statusFromPrisma[application.status]
        }));

        res.json(formattedApplications);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch applications"
        });
    }
});

app.post("/api/applications", async (req, res) => {
    try {
        const { position, company, status } = req.body;

        if (!position || !company || !status) {
            return res.status(400).json({
                error: "Position, company, and status are required"
            });
        }

        if (!(status in statusToPrisma)) {
            return res.status(400).json({
                error: "Invalid application status"
            });
        }

        const application = await prisma.application.create({
            data: {
                position,
                company,
                status: statusToPrisma[status as keyof typeof statusToPrisma],
                userId: req.session.userId
            }
        });

        const formattedApplication = {
            ...application,
            status: statusFromPrisma[application.status]
        };

        return res.status(201).json(formattedApplication);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Failed to create application"
        });
    }
});

app.patch("/api/applications/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.session.userId;
        const { position, company, status } = req.body;

        if (!(status in statusToPrisma)) {
            return res.status(400).json({
                error: "Invalid application status"
            });
        }

        const application = await prisma.application.update({
            where: { 
                id, 
                userId 
            },
            data: {
                position,
                company,
                status: statusToPrisma[status as keyof typeof statusToPrisma]
            }
        });

        const updatedApplication = {
            ...application,
            status: statusFromPrisma[application.status]
        };

        return res.status(200).json(updatedApplication);

    } catch (error) {
        console.error(error);

        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            return res.status(404).json({
                error: "Failed to find application"
            });
        }

        return res.status(500).json({
            error: "Failed to update application"
        });
    }
});

app.delete("/api/applications/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.session.userId;

        const deletedApplication = await prisma.application.delete({
            where: { 
                id,
                userId
            }
        });

        return res.status(200).json(deletedApplication);

    } catch (error) {
        console.error(error);

        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            return res.status(404).json({
                error: "Failed to find application"
            });
        }

        return res.status(500).json({
            error: "Failed to delete application"
        });
    }
});

// AUTH API
app.post("/api/register", async (req, res) => {
    try {
        const { email, password} = req.body
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email and Password required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                error: "Password must be 8 characters or longer"
            });
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: "Email is not valid"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash
            }
        });

        const publicUser = {
            id: user.id,
            email: user.email
        };

        return res.status(201).json(publicUser);

    } catch (error) {
        console.error(error);

        if (
            error instanceof PrismaClientKnownRequestError &&
            error.code === "P2002"
            ) {
                return res.status(409).json({
                    error: "Email is already in use"
                });
            }

        return res.status(500).json({
            error: "Unable to create user"
        })
    }
});

app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json({
                error: "Invalid credentials"
            });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (user === null) {
            return res.status(401).json({
                error: "Invalid credentials"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.passwordHash
        )

        if (!passwordMatch) {
            return res.status(401).json({
                error: "Invalid credentials"
            });
        }

        req.session.userId = user.id;

        const loggedUser = {
            id: user.id,
            email: user.email
        }

        return res.status(200).json(loggedUser)
        
    } catch (error) {
        return res.status(500).json({
            error: "Failed to login"
        })
    }
});

app.post("/api/logout", async (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({
                error: "Failed to log out"
            });
        }

        res.clearCookie("connect.sid")
        return res.status(200).json({
            message: "Logged out successfully"
        })
    });
});

app.get("/api/me", async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({
            error: "Not authenticated"
        });
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.session.userId
            }
        });

        if (!user) {
            return res.status(401).json({
                error: "Not authenticated"
            });
        }

        return res.status(200).json({
            id: user.id,
            email: user.email
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Failed to check authenitcation"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});