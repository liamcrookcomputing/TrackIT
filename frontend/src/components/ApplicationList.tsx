import ApplicationCard from "./ApplicationCard.tsx";
import type { Application } from "../types/applications.ts";
import { STATUS_CONFIG } from "../types/statusConfig";

function ApplicationList({
    applications,
    deleteApplication,
    onViewDetails
}: {
    applications: Application[];
    deleteApplication: (application: Application) => void;
    onViewDetails: (application: Application) => void;
}) {

    const statuses = Object.keys(STATUS_CONFIG) as Application["status"][];

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
                            className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                        >
                            <div className="mb-4 flex items-center gap-2">
                                <span
                                    className={`h-2.5 w-2.5 rounded-full ${STATUS_CONFIG[status].dotColor}`}
                                />

                                <h2 className="font-bold text-black!">
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
                                            deleteApplication={deleteApplication}
                                            onViewDetails={onViewDetails}
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