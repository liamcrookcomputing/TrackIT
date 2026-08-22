import type { Analytics } from "../types/analytics";

function ApplicationDashboard({
    analytics
}: {
    analytics: Analytics | null;
}) {

    if (!analytics) {
        return null;
    }

    const applicationStatuses = analytics.applicationStatuses;

    function getStatusCount(status: string) {
        return applicationStatuses.find(
            application => application.status === status
        )?._count._all ?? 0;
    }
    
    const dashboardCards = [
        {
            label: "Total Applications",
            count: analytics.totalApplications,
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
                How is your search going?
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {dashboardCards.map((card) => (
                    <div
                        key={card.label}
                        className={`rounded-xl border ${card.border} ${card.background} p-5 shadow-sm`}
                    >
                        <p className="text-sm text-gray-500">
                            {card.label}
                        </p>

                        <p className="mt-2 text-3xl font-bold text-black!">
                            {card.count}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-300 bg-gray-50 p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Response Rate
                    </p>

                    <p className="mt-2 text-3xl font-bold text-black!">
                        {Math.round(analytics.responseRate * 100)}%
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        Applications that received a response
                    </p>
                </div>

                <div className="rounded-xl border border-gray-300 bg-gray-50 p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Interview Rate
                    </p>

                    <p className="mt-2 text-3xl font-bold text-black!">
                        {Math.round(analytics.interviewRate * 100)}%
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        Applications that reached an interview
                    </p>
                </div>
            </div>

        </section>
    );
}

export default ApplicationDashboard