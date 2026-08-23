import type { Analytics } from "../types/analytics";

function getRateMessage(
    rate: number,
    messages: {
        low: string;
        medium: string;
        high: string;
    },
    higherIsBetter = true
) {
    if (higherIsBetter) {
        if (rate < 10) return { level: "low", message: messages.low };
        if (rate < 30) return { level: "medium", message: messages.medium };
        return { level: "high", message: messages.high };
    }

    if (rate > 30) return { level: "low", message: messages.low };
    if (rate > 10) return { level: "medium", message: messages.medium };
    return { level: "high", message: messages.high };
}

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

    // --- MESSAGES ---
    // response rate messages
    const responseRate = Math.round(analytics.responseRate * 100)
    const responseRateResult = getRateMessage(responseRate, {
        low: "Consider reviewing your resume",
        medium: "Your applications are getting some attention",
        high: "Your applications are getting strong responses"
    });

    const interviewRate = Math.round(analytics.interviewRate * 100)
    const interviewRateResult = getRateMessage(interviewRate, {
        low: "Consider tailoring your applications",
        medium: "Your applications are leading to interviews",
        high: "You're getting strong interview results"
    });
    
    const offerRate = Math.round(analytics.offerRate * 100)
    const offerRateResult = getRateMessage(offerRate, {
        low: "Few applications are resulting in offers",
        medium: "Your applications are converting into offers",
        high: "Excellent offer rate"
    });

    const rejectRate = Math.round(analytics.rejectRate * 100)
    const rejectRateResult = getRateMessage(
        rejectRate,
        {
            low: "High reject rate",
            medium: "Your reject rate is looking good",
            high: "Excellent reject rate"
        },
        false
    );

    const insightMessage =
    responseRateResult.level === "low"
        ? responseRateResult.message
        : interviewRateResult.level === "low"
            ? interviewRateResult.message
            : offerRateResult.level === "low"
                ? offerRateResult.message
                : rejectRateResult.level === "low"
                    ? rejectRateResult.message
                    : "Your applications are performing well.";

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
                        {Math.round(responseRate)}%
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        {responseRateResult.message}
                    </p>
                </div>

                <div className="rounded-xl border border-gray-300 bg-gray-50 p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Interview Rate
                    </p>

                    <p className="mt-2 text-3xl font-bold text-black!">
                        {Math.round(interviewRate)}%
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        {interviewRateResult.message}
                    </p>
                </div>
            </div>
            <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-5">
                    <p className="text-sm font-semibold text-blue-900">
                        Application Insight
                    </p>

                    <p className="mt-1 text-sm text-blue-800">
                        {insightMessage}
                    </p>
                </div>

        </section>
    );
}

export default ApplicationDashboard