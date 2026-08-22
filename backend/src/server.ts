import "dotenv/config";
import cors from "cors";
import express, { application, response } from "express";
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
app.set('trust proxy', 1);
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://track-it-umber-phi.vercel.app"
    ],
    credentials: true
}));
app.use(express.json());

const isProduction = process.env.NODE_ENV === "production";
app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        secure: isProduction,
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax"
    }
}));

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

function getUserId(req: Request): string {
    if (!req.session.userId) {
        throw new Error("User is not authenticated");
    }

    return req.session.userId;
}

app.use("/api/applications", requireAuth);
app.use("/api/analytics", requireAuth);

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({
    adapter
});

const PORT = process.env.PORT || 3000;

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
        const userId = getUserId(req);

        const applications = await prisma.application.findMany({
            where: {
                userId
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
        const userId = getUserId(req);
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

        const prismaStatus =
            statusToPrisma[status as keyof typeof statusToPrisma];

        const result = await prisma.$transaction(async (tx) => {
            const application = await tx.application.create({
                data: {
                    position,
                    company,
                    status: prismaStatus,
                    userId
                }
            });

            await tx.applicationEvent.create({
                data: {
                    applicationId: application.id,
                    status: prismaStatus
                }
            });

            return application;
        });

        const formattedApplication = {
            ...result,
            status: statusFromPrisma[result.status]
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
        const userId = getUserId(req);

        const { position, company, status, reason } = req.body;

        //get current application status
        const application = await prisma.application.findFirst({
            where: {
                id,
                userId
            }
        });

        if (!application) {
            return res.status(404).json({
                error: "Failed to find application"
            });
        }

        if (status !== undefined) {
            if (!(status in statusToPrisma)) {
                return res.status(400).json({
                    error: "Invalid application status"
                });
            }

            const newStatus = statusToPrisma[status as keyof typeof statusToPrisma];
            const statusChanged = application.status !== newStatus;

            // if status changed, update and create event
            if (statusChanged) {
                const updatedApplication = await prisma.$transaction(
                    async (tx) => {
                        const updatedApplication =
                            await tx.application.update({
                                where: {
                                    id,
                                    userId
                                },
                                data: {
                                    position,
                                    company,
                                    status: newStatus
                                }
                            });

                        await tx.applicationEvent.create({
                            data: {
                                applicationId: application.id,
                                status: newStatus,
                                reason: newStatus === ApplicationStatus.Rejected
                                    ? reason ?? null
                                    : null
                            }
                        });

                        return updatedApplication;
                    }
                );

                return res.status(200).json({
                    ...updatedApplication,
                    status: statusFromPrisma[updatedApplication.status]
                });
            }
        }

        // else update application only
        const updatedApplication = await prisma.application.update({
            where: {
                id,
                userId
            },
            data: {
                position,
                company
            }
        });

        return res.status(200).json({
            ...updatedApplication,
            status: statusFromPrisma[updatedApplication.status]
        });
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
        const userId = getUserId(req);

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

        req.session.userId = user.id;

        req.session.save((error) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    error: "Failed to create session"
                });
            }

            const publicUser = {
                id: user.id,
                email: user.email
            };

            return res.status(201).json(publicUser);
        });

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

        req.session.save((error) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    error: "Failed to create session"
                });
            }

            const loggedUser = {
                id: user.id,
                email: user.email
            }

            return res.status(200).json(loggedUser);
        });
        
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

app.get("/api/analytics", async (req, res) => {
    try {
        const userId = getUserId(req);

        const applications = await prisma.application.findMany({
            where: {
                userId
            },
            include: {
                events: true
            }
        });

        const applicationStatuses = await prisma.application.groupBy({
            where: {
                userId
            },
            by: ["status"],
            _count: {
                _all: true
            }
        });

        const rejectionReasons = await prisma.applicationEvent.groupBy({
            where: {
                status: ApplicationStatus.Rejected,
                application: {
                    userId
                }
            },
            by: ["reason"],
            _count: {
                _all: true
            }
        });

        const formattedRejectionReasons = rejectionReasons.map((item) => ({
            reason: item.reason ?? "Not specified",
            count: item._count._all
        }));

        const totalApplications = applications.length

        // analytics calculations
        // check if applications has moved beyond applied
        const respondedApplications = applications.filter((application) =>
            application.events.some((event) =>
                event.status === ApplicationStatus.Interview ||
                event.status === ApplicationStatus.TechnicalAssessment ||
                event.status === ApplicationStatus.FinalInterview ||
                event.status === ApplicationStatus.Offer ||
                event.status === ApplicationStatus.Rejected
            )
        );

        // check if applications has reached interview or final interview
        const interviewedApplications = applications.filter((application) =>
            application.events.some((event) =>
                event.status === ApplicationStatus.Interview ||
                event.status === ApplicationStatus.FinalInterview
            )
        );

        // calculate rates
        const responseRate =
            totalApplications === 0
                ? 0
                :respondedApplications.length / totalApplications;
        const interviewRate = 
            totalApplications === 0
            ? 0
            :interviewedApplications.length / totalApplications;

        return res.status(200).json({
            totalApplications,
            responseRate,
            interviewRate,
            applicationStatuses,
            rejectionReasons: formattedRejectionReasons
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Failed to fetch analytics"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});