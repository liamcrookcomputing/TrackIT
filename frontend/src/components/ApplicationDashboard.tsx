import type { ApplicationStatusCount } from "../types/analytics";

function ApplicationDashboard({
    applicationStatuses
}: {
    applicationStatuses: ApplicationStatusCount[];
}) {

    function getStatusCount(status: string) {
        return applicationStatuses.find(
            application => application.status === status
        )?._count._all ?? 0;
    }

    const totalApplications = applicationStatuses.reduce(
        (total, application) => total + application._count._all,
        0
    );
    
    const dashboardCards = [
        {
            label: "Total Applications",
            count: totalApplications,
            border: "border-gray-300",
            background: "bg-gray-100"
        },
        {
            label: "Applied",
            count: getStatusCount("Applied"),
            border: "border-blue-300",
            background: "bg-blue-100"
        },
        {
            label: "Interviews",
            count: 
                getStatusCount("Interview") +
                getStatusCount("Final Interview"),
            border: "border-yellow-300",
            background: "bg-yellow-50"
        },
        {
            label: "Offers",
            count: getStatusCount("Offer"),
            border: "border-green-400",
            background: "bg-green-100"
        }
    ];

    return (
        <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-black!">
                Dashboard
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-col-4">

                {dashboardCards.map((card) => (
                    <div
                        key={card.label}
                        className={`rounded-xl border ${card.border} ${card.background} p-5 shadow-sm`}
                    >
                        <p className="text-sm text-gray-500">
                            {card.label}
                        </p>

                        <p className="mt-2 text-3xl font-bond text-black!">
                            {card.count}
                        </p>
                    </div>
                ))}

            </div>
        </section>
    );
}

export default ApplicationDashboard