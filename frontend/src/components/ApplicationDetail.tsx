import type { Application } from "../types/applications";

function ApplicationDetail({
    application,
    onClose
}: {
    application: Application;
    onClose: () => void;
}) {
    const sortedEvents = [...application.events].sort(
        (a, b) =>
            new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()
    );

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-5xl rounded-xl bg-white p-6"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                        Application Details
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md px-3 py-2 hover:bg-gray-100"
                    >
                        ✕
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr]">
                    <div>
                        <div className="space-y-5">
                            <div>
                                <p className="text-sm text-gray-500">Position</p>
                                <p className="font-medium">{application.position}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Company</p>
                                <p className="font-medium">{application.company}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <p className="font-medium">{application.status}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Source</p>
                                <p className="text-gray-500">
                                    {application.source || "Not set"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Notes</p>
                                <p className="text-gray-500">
                                    {application.notes || "Not set"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {sortedEvents.map((event) => (
                            <div key={event.id}>
                                <p className="font-medium">{event.status}</p>

                                <p className="text-sm text-gray-500">
                                    {new Date(event.createdAt).toLocaleString()}
                                </p>

                                {event.reason && (
                                    <p className="text-sm text-gray-600">
                                        Reason: {event.reason}
                                    </p>
                                    )}  
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ApplicationDetail;