import { useEffect, useRef, useState } from "react";
import ConfirmationModal from "./ConfirmationModal";
import type { Application } from "../types/applications";
import { STATUS_CONFIG } from "../types/statusConfig";

function ApplicationCard({ 
    application, 
    deleteApplication,
    onViewDetails
}: { 
    application: Application;
    deleteApplication: (deletedApplication: Application) => void;
    onViewDetails: (application: Application) => void;
}) {

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setShowMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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

    const latestActivityDate =
        application.events.length > 0
            ? application.events.reduce((latest, event) => {
                return new Date(event.createdAt) > new Date(latest.createdAt)
                    ? event
                    : latest;
            }).createdAt
            : application.createdAt;

    const elapsedMilliseconds =
        new Date().getTime() - new Date(latestActivityDate).getTime();

    const elapsedDays =
        elapsedMilliseconds / (1000 * 60 * 60 * 24);

    const statusConfig = STATUS_CONFIG[application.status];
    const staleThreshold = statusConfig.staleThreshold;

    const isStale = elapsedDays >= staleThreshold;

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

    const activityLabel = latestEvent
        ? `Updated ${formatDate(latestEvent.createdAt)}`
        : appliedEvent
            ? `Applied ${formatDate(appliedEvent.createdAt)}`
            : `Saved ${formatDate(application.createdAt)}`;

    return (
        <div className="relative">
            <div
                onClick={() => onViewDetails(application)}
                className={`flex h-42 w-full cursor-pointer flex-col rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
                    statusConfig.cardBorder
                } ${isStale ? "border-amber-400" : ""}`}
            >
                <div className="flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                        <p className="text-xl font-bold leading-tight wrap-break-words text-gray-900">
                            {application.position}
                        </p>

                        <p className="mt-1 truncate text-sm text-gray-600">
                            {application.company}
                        </p>
                    </div>

                    <div ref={menuRef} className="relative shrink-0">
                        <button
                            type="button"
                            aria-label="Application options"
                            onClick={(event) => {
                                event.stopPropagation();
                                setShowMenu(!showMenu);
                            }}
                            className="rounded-full bg-white px-3 py-1 text-xs font-semibold shadow-sm hover:bg-gray-100"
                        >
                            ⋮
                        </button>

                        {showMenu && (
                            <div 
                                onClick={(event) => event.stopPropagation()}
                                className="absolute right-0 top-full z-10 mt-2 w-32 rounded-lg border bg-white py-1 shadow-lg"
                            >

                                <button
                                    type="button"
                                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setShowMenu(false);
                                        setShowConfirmation(true);
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-2 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                    <span className={`h-2 w-2 rounded-full ${statusConfig.dotColor}`} />
                    {application.status}
                </div>

                <div
                    className={`mt-auto text-sm ${
                        isStale ? "font-medium text-amber-600" : "text-gray-400"
                    }`}
                >
                    {activityLabel}
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
    );
}

export default ApplicationCard