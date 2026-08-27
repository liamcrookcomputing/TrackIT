import { useEffect, useState } from "react";
import type { Application, ApplicationUpdate, RejectionReason } from "../types/applications";
import { STATUS_CONFIG } from "../types/statusConfig";
import { COMMON_SOURCES } from "../types/sourceConfig";

function ApplicationDetail({
    application,
    onClose,
    editApplication
}: {
    application: Application;
    onClose: () => void;
    editApplication: (editedApplication: ApplicationUpdate) => void;
}) {
    const rejectedEvent = [...application.events]
        .filter(event => event.status === "Rejected")
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        )[0];

    const existingReason = rejectedEvent?.reason ?? null;

    const statuses = Object.keys(STATUS_CONFIG) as Application["status"][];
    const rejectionReasons: RejectionReason[] = [
        "No response",
        "Resume screening",
        "Experience mismatch",
        "Technical assessment",
        "Interview",
        "Position filled",
        "Salary",
        "Other"
    ];

    const [position, setPosition] = useState(application.position);
    const [company, setCompany] = useState(application.company);
    const [status, setStatus] = useState(application.status);
    const [notes, setNotes] = useState(application.notes ?? "");
    const [source, setSource] = useState(application.source ?? "");
    const [reason, setReason] = useState(existingReason);
    const [previousSources, setPreviousSources] = useState<string[]>([]);

    const sourceSuggestions = [
        ...new Set([
            ...COMMON_SOURCES,
            ...previousSources
        ])
    ];

    useEffect(() => {
        setPosition(application.position);
        setCompany(application.company);
        setStatus(application.status);
        setNotes(application.notes ?? "");
        setSource(application.source ?? "");
        setReason(existingReason);
    }, [application, existingReason]);

    useEffect(() => {
        const fetchSources = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/applications/sources`,
                    {
                        credentials: "include"
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch sources");
                }

                const data: string[] = await response.json();

                setPreviousSources(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchSources();
    }, []);

    const sortedEvents = [...application.events].sort(
        (a, b) =>
            new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()
    );

    console.log("Application:", application);
    console.log("Rejected event:", rejectedEvent);
    console.log("Existing reason:", existingReason);
    console.log("Current reason:", reason);

    function updateApplication(
        overrides: Partial<ApplicationUpdate> = {}
    ) {
        const updatedApplication: ApplicationUpdate = {
            id: application.id,
            position,
            company,
            status,
            notes,
            source,
            rejectionReason: reason,
            ...overrides
        };

        editApplication(updatedApplication);
    }

    function handleStatusChange(newStatus: Application["status"]) {
        setStatus(newStatus);
        updateApplication({ status: newStatus });
    }

    function handleReasonChange(newReason: RejectionReason) {
        setReason(newReason);
        updateApplication({ rejectionReason: newReason });
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
                    <div className="min-w-0">
                        <h2 className="truncate text-2xl font-bold text-gray-900">
                            {application.position}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            {application.company}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="ml-4 rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <div className="overflow-y-auto px-6 py-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr]">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="position"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Position
                                    </label>
                                    <input
                                        id="position"
                                        value={position}
                                        placeholder="Position"
                                        onChange={(event) =>
                                            setPosition(event.target.value)
                                        }
                                        onBlur={() => updateApplication()}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="company"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Company
                                    </label>
                                    <input
                                        id="company"
                                        value={company}
                                        placeholder="Company"
                                        onChange={(event) =>
                                            setCompany(event.target.value)
                                        }
                                        onBlur={() => updateApplication()}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="status"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Status
                                </label>
                                <div className="relative">
                                    <span
                                        className={`pointer-events-none absolute left-3 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full ${
                                            STATUS_CONFIG[status].dotColor
                                        }`}
                                    />

                                    <select
                                        id="status"
                                        value={status}
                                        onChange={(event) =>
                                            handleStatusChange(
                                                event.target.value as Application["status"]
                                            )
                                        }
                                        className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2.5 pl-8 pr-3 text-sm text-gray-900 shadow-sm outline-none transition hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    >
                                        {statuses.map((statusOption) => (
                                            <option
                                                key={statusOption}
                                                value={statusOption}
                                            >
                                                {statusOption}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {status === "Rejected" && (
                                <div>
                                    <label
                                        htmlFor="reason"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Rejection Reason
                                    </label>

                                    <select
                                        id="reason"
                                        value={reason ?? ""}
                                        onChange={(event) =>
                                            handleReasonChange(
                                                event.target.value as RejectionReason
                                            )
                                        }
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    >
                                        <option value="">
                                            Select a reason
                                        </option>

                                        {rejectionReasons.map(
                                            (reasonOption) => (
                                                <option
                                                    key={reasonOption}
                                                    value={reasonOption}
                                                >
                                                    {reasonOption}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label
                                    htmlFor="source"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Application Site
                                </label>

                                <input
                                    id="source"
                                    list="source-suggestions"
                                    value={source}
                                    placeholder="e.g. LinkedIn"
                                    onChange={(event) =>
                                        setSource(event.target.value)
                                    }
                                    onBlur={() => updateApplication()}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                />

                                <datalist id="source-suggestions">
                                    {sourceSuggestions.map((sourceOption) => (
                                        <option
                                            key={sourceOption}
                                            value={sourceOption}
                                        />
                                    ))}
                                </datalist>
                            </div>

                            <div>
                                <label
                                    htmlFor="notes"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Notes
                                </label>

                                <textarea
                                    id="notes"
                                    value={notes}
                                    placeholder="Add notes about this application..."
                                    onChange={(event) =>
                                        setNotes(event.target.value)
                                    }
                                    onBlur={() => updateApplication()}
                                    rows={5}
                                    className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                />
                            </div>
                        </div>
                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-gray-900">
                                Application History
                            </h3>

                            <div className="relative space-y-5">
                                {sortedEvents.map((event, index) => (
                                    <div
                                        key={event.id}
                                        className="relative flex gap-3"
                                    >
                                        {index < sortedEvents.length - 1 && (
                                            <div className="absolute left-1.25 top-3 h-full w-px bg-gray-200" />
                                        )}

                                        <div
                                            className={`relative mt-1 h-3 w-3 shrink-0 rounded-full ${
                                                STATUS_CONFIG[event.status]?.dotColor ?? "bg-gray-400"
                                            }`}
                                        />

                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-900">
                                                {event.status}
                                            </p>

                                            <p className="mt-0.5 text-xs text-gray-500">
                                                {new Date(
                                                    event.createdAt
                                                ).toLocaleString()}
                                            </p>

                                            {event.reason && (
                                                <p className="mt-1 text-sm text-gray-600">
                                                    Reason: {event.reason}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ApplicationDetail;