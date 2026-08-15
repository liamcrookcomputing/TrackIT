function ApplicationDashboard({
    totalApplications,
    appliedApplications,
    interviewApplications,
    offerApplications
}: {
    totalApplications: number;
    appliedApplications: number;
    interviewApplications: number;
    offerApplications: number;
}) {
    return (
        <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold !text-black">
                Dashboard
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                
                <div className="rounded-xl border border-gray-300 bg-gray-100 p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Total Applications
                    </p>

                    <p className="mt-2 text-3xl font-bold !text-black">
                        {totalApplications}
                    </p>
                </div>

                <div className="rounded-xl border border-blue-300 bg-blue-100 p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Applied
                    </p>

                    <p className="mt-2 text-3xl font-bold !text-black">
                        {appliedApplications}
                    </p>
                </div>

                <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Interviews
                    </p>

                    <p className="mt-2 text-3xl font-bold !text-black">
                        {interviewApplications}
                    </p>
                </div>

                <div className="rounded-xl border border-green-400 bg-green-100 p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Offers
                    </p>

                    <p className="mt-2 text-3xl font-bold !text-black">
                        {offerApplications}
                    </p>
                </div>

            </div>
        </section>
    )
}

export default ApplicationDashboard