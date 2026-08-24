export interface Application {
    readonly id: number | string;
    position: string;
    company: string;
    status: "Saved" | "Applied" | "Interview" | "Technical Assessment" | "Final Interview" | "Offer" | "Rejected";
    createdAt: string;
    events: ApplicationEvent[];
}

export interface ApplicationEvent {
    status: Application["status"];
    createdAt: string;
}

import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";

function ApplicationCard({ application, onEdit, deleteApplication }: 
    { application: Application, onEdit: (selectedApplication: Application) => void, deleteApplication: (deletedApplication: Application) => void}) {
    const statusStyles = {
        "Saved": "border-gray-300 bg-gray-100 text-gray-700",
        "Applied": "border-blue-300 bg-blue-100 text-blue-700",
        "Interview": "border-yellow-300 bg-yellow-50 text-yellow-800",
        "Technical Assessment": "border-orange-300 bg-orange-100 text-orange-700",
        "Final Interview": "border-purple-300 bg-purple-100 text-purple-700",
        "Offer": "border-green-400 bg-green-100 text-green-700",
        "Rejected": "border-red-300 bg-red-100 text-red-700"
    };

    const [showConfirmation, setShowConfirmation] = useState(false);

    const statusChangeEvents = application.events.filter(
        event =>
            event.status !== "Saved" &&
            event.status !== "Applied" &&
            (
                application.status === "Interview" ||
                application.status === "Technical Assessment" ||
                application.status === "Final Interview" ||
                application.status === "Offer" ||
                application.status === "Rejected"
            )
    );

    const latestEvent =
        application.status === "Applied"
            ? undefined
            : statusChangeEvents.length > 0
                ? statusChangeEvents.reduce((latest, event) => {
                    const latestDate = new Date(latest.createdAt);
                    const eventDate = new Date(event.createdAt);

                    if (eventDate > latestDate) return event;
                    return latest;
                })
                : undefined;

    const appliedEvent = application.events.find(
        event => event.status === "Applied"
    );

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        const now = new Date();

        const differenceInMilliseconds = now.getTime() - date.getTime();
        const differenceInDays = Math.floor(
            differenceInMilliseconds / (1000 * 60 * 60 * 24)
        );

        if (differenceInDays === 0) {
            return "Today"
        }
        if (differenceInDays === 1) {
            return "Yesterday"
        }
        if (differenceInDays < 7) {
            return `${differenceInDays} days ago`;
        }
        return new Intl.DateTimeFormat("en-AU", {
            month: "short",
            day: "numeric"
        }).format(date);
    }

    return (
        <div className="relative">
            <div className={`flex h-42 max-w-75 flex-col rounded-xl border p-5 shadow-sm transition hover:shadow-md ${statusStyles[application.status]}`}>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="mt-0 text-xl font-bold">
                            {application.position}
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                            {application.company}
                        </p>
                    </div>

                    <span className="whitespace-nowrap rounded-full bg-white px-3 py-1 text-xs font-semibold shadow-sm">
                        {application.status}
                    </span>
                </div>

                {appliedEvent && (
                    <div className="mt-2 text-sm text-gray-400">
                        Applied · {formatDate(appliedEvent.createdAt)}
                    </div>
                )}
                {latestEvent && (
                    <div className="mt-2 text-sm text-gray-400">
                        {latestEvent.status} · {formatDate(latestEvent.createdAt)}
                    </div>
                )}

                <div className="mt-auto flex justify-end gap-2 pt-5">
                    <button
                        type="button"
                        className="rounded-lg border bg-white px-3 py-1 text-sm hover:bg-gray-100"
                        onClick={() => onEdit(application)}
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        className="rounded-lg bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                        onClick={() => setShowConfirmation(true)}
                    >
                        Delete
                    </button>
                </div>
            </div>
            {showConfirmation && (
                <ConfirmationModal
                    message="Are you sure you want to delete this application?"
                    onConfirm={() => {
                        deleteApplication(application);
                        setShowConfirmation(false);
                    }}
                    onCancel={() => setShowConfirmation(false)}
                />
            )}
        </div>
    )
}

export default ApplicationCard