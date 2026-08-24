import type { ApplicationStatus } from "./applications";

export const STATUS_CONFIG: Record<
    ApplicationStatus,
    {
        cardBorder: string;
        dotColor: string;
        staleThreshold: number;
    }
> = {
    Saved: {
        cardBorder: "border-gray-200",
        dotColor: "bg-gray-400",
        staleThreshold: 30,
    },
    Applied: {
        cardBorder: "border-gray-200",
        dotColor: "bg-blue-500",
        staleThreshold: 14,
    },
    Interview: {
        cardBorder: "border-gray-200",
        dotColor: "bg-sky-500",
        staleThreshold: 7,
    },
    "Technical Assessment": {
        cardBorder: "border-gray-200",
        dotColor: "bg-indigo-500",
        staleThreshold: 7,
    },
    "Final Interview": {
        cardBorder: "border-gray-200",
        dotColor: "bg-violet-500",
        staleThreshold: 7,
    },
    Offer: {
        cardBorder: "border-gray-200",
        dotColor: "bg-emerald-500",
        staleThreshold: 7,
    },
    Rejected: {
        cardBorder: "border-gray-200",
        dotColor: "bg-red-500",
        staleThreshold: 7,
    },
};