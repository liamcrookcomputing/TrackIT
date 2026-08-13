import "dotenv/config";
import cors from "cors";
import express from "express";
import { Prisma, PrismaClient, ApplicationStatus } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const app = express();
app.use(cors());
app.use(express.json());

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({
    adapter
});

const PORT = 3000;

const DEV_USER_ID = "dba880ef-ff09-485e-98dc-40e55cf376fc";


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

app.get("/api/applications", async (_req, res) => {
    try {
        const applications = await prisma.application.findMany();

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
                userId: DEV_USER_ID
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
        const { position, company, status } = req.body;

        if (!(status in statusToPrisma)) {
            return res.status(400).json({
                error: "Invalid application status"
            });
        }

        const application = await prisma.application.update({
            where: { id },
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

        const deletedApplication = await prisma.application.delete({
            where: { id }
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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});