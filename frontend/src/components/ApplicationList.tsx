import ApplicationCard from "./ApplicationCard.tsx";
import type { Application } from "./ApplicationCard.tsx";

function ApplicationList({
        applications,
        onEdit,
        deleteApplication
    }: {
        applications: Application[];
        onEdit: (selectedApplication: Application) => void;
        deleteApplication: (deletedApplication: Application) => void;
    }) {
    const statuses: Application["status"][] = [
        "Saved",
        "Applied",
        "Interview",
        "Technical Assessment",
        "Final Interview",
        "Offer",
        "Rejected"
    ];

    const statusStyles = {
        "Saved": "border-gray-200 bg-gray-50",
        "Applied": "border-gray-200 bg-gray-50",
        "Interview": "border-gray-200 bg-gray-50",
        "Technical Assessment": "border-gray-200 bg-gray-50",
        "Final Interview": "border-gray-200 bg-gray-50",
        "Offer": "border-gray-200 bg-gray-50",
        "Rejected": "border-gray-200 bg-gray-50"
    };

    return (
        <div className="flex flex-col gap-6">
            {statuses
                .filter((status) =>
                    applications.some(
                        (application) => application.status === status
                    )
                )
                .map((status) => {
                    const statusApplications = applications.filter(
                        (application) => application.status === status
                    );

                    return (
                        <div
                            key={status}
                            className={`rounded-xl border p-4 ${statusStyles[status]}`}
                        >
                            <div className="mb-4 flex items-center gap-2">
                                <h2 className="font-bold !text-black">
                                    {status}
                                </h2>

                                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-gray-600 shadow-sm">
                                    {statusApplications.length}
                                </span>
                            </div>

                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {statusApplications.map((application) => (
                                    <div
                                        key={application.id}
                                        className="w-75 shrink-0"
                                    >
                                        <ApplicationCard
                                            application={application}
                                            onEdit={onEdit}
                                            deleteApplication={deleteApplication}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
        </div>
    );
}

export default ApplicationList;