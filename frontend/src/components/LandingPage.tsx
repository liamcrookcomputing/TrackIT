import { useMemo, useState } from "react";
import type { Application, ApplicationInput, ApplicationUpdate } from "../types/applications";
import type { Analytics } from "../types/analytics";
import { mockApplications } from "../data/mockApplications";
import ApplicationDashboard from "./ApplicationDashboard";
import ApplicationList from "./ApplicationList";
import ApplicationForm from "./ApplicationForm";
import ApplicationEdit from "./ApplicationEdit";


function LandingPage({
    onLogin,
    onRegister
}: {
    onLogin: () => void;
    onRegister: () => void;
}) {
    const [applications, setApplications] =
        useState<Application[]>(mockApplications);

    const [selectedApplication, setSelectedApplication] =
        useState<Application | null>(null);
    
    const [addApplicationRender, setAddApplicationRender] =
        useState(false);
    
    const [search, setSearch] =
        useState("");
    
    const [sortOrder, setSortOrder] = useState<
        "newest" | "oldest" | "stale"
    >("newest");

    function getLatestActivity(application: Application) {
        if (!application.events || application.events.length === 0) {
            return new Date(application.createdAt).getTime();
        }

        return Math.max(
            ...application.events.map(
                event => new Date(event.createdAt).getTime()
            )
        );
    }
    
    const filteredApplications = useMemo(() => {
        const filtered = applications.filter((application) =>
            application.company.toLowerCase().includes(search.toLowerCase()) ||
            application.position.toLowerCase().includes(search.toLowerCase())
        );

        return filtered.sort((a, b) => {
            const timeA = new Date(a.createdAt).getTime();
            const timeB = new Date(b.createdAt).getTime();

            if (sortOrder === "newest") {
                return timeB - timeA;
            }

            if (sortOrder === "oldest") {
                return timeA - timeB;
            }

            if (sortOrder === "stale") {
                const activityA = getLatestActivity(a);
                const activityB = getLatestActivity(b);

                return activityA - activityB;
            }

            return 0;
        });
    }, [applications, search, sortOrder]);



    const applicationStatuses: Analytics["applicationStatuses"] = [
        "Saved",
        "Applied",
        "Interview",
        "Technical Assessment",
        "Final Interview",
        "Offer",
        "Rejected"
    ].map((status) => ({
        status,
        _count: {
            _all: applications.filter(
                application => application.status === status
            ).length
        }
    }));

    const totalApplications = applications.length;

    const respondedApplications = applications.filter(
        application =>
            application.status === "Interview" ||
            application.status === "Technical Assessment" ||
            application.status === "Final Interview" ||
            application.status === "Offer" ||
            application.status === "Rejected"
    );

    const interviewedApplications = applications.filter(
        application =>
            application.status === "Interview" ||
            application.status === "Final Interview"
    );

    const offeredApplications = applications.filter(
        application => application.status === "Offer"
    );

    const rejectedApplications = applications.filter(
        application => application.status === "Rejected"
    );

    const analytics: Analytics = {
        totalApplications,
        responseRate:
            totalApplications === 0
                ? 0
                : respondedApplications.length / totalApplications,
        interviewRate:
            totalApplications === 0
                ? 0
                : interviewedApplications.length / totalApplications,
        offerRate:
            totalApplications === 0
                ? 0
                : offeredApplications.length / totalApplications,
        rejectRate:
            totalApplications === 0
                ? 0
                : rejectedApplications.length / totalApplications,
        applicationStatuses,
        rejectionReasons: []
    };

    const createdAt = new Date().toISOString();

    function addApplication(newApplication: ApplicationInput) {
        setApplications((currentApplications) => [
            ...currentApplications,
            {
                ...newApplication,
                id: Date.now(),
                createdAt,
                events: [
                    {
                        status: newApplication.status,
                        createdAt
                    }
                ]
            }
        ]);

        setAddApplicationRender(false);
    }

    function editApplication(editedApplication: ApplicationUpdate) {
        setApplications((currentApplications) =>
            currentApplications.map((application) =>
                application.id === editedApplication.id
                    ? {
                        ...application,
                        position: editedApplication.position,
                        company: editedApplication.company,
                        status: editedApplication.status
                    }
                    : application
            )
        );
        
        setSelectedApplication(null);
    }

    function deleteApplication(deletedApplication: Application) {
        setApplications((currentApplications) =>
            currentApplications.filter(
                application => application.id !== deletedApplication.id
            )
        );
    }

    function onEdit(application: Application) {
        setSelectedApplication(application);
    }

    function cancelEdit() {
        setSelectedApplication(null);
    }

    return (
        <main className="min-h-screen bg-gray-100 px-4 py-8">
            <div className="mx-auto max-w-6xl">

                <header className="mb-8 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">
                        TrackIT
                    </h1>
                    
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onLogin}
                            className="rounded-lg border bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                            Login
                        </button>

                        <button
                            type="button"
                            onClick={onRegister}
                            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                        >
                            Register
                        </button>
                    </div>
                </header>

                <section>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Try TrackIT
                        </h2>

                        <p className="mt-1 text-gray-500">
                            Explore the job application tracker below. This is an interactive demo using temporary local data.
                        </p>
                    </div>

                    <div className="rounded-2xl border bg-white p-6 shadow-sm">

                        <ApplicationDashboard
                            analytics={analytics}
                        />

                        <section className="mt-8">
                            <button
                                type="button"
                                onClick={() =>
                                    setAddApplicationRender(!addApplicationRender)
                                }
                                className="mb-4 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                            >
                                Add Application
                            </button>

                            {addApplicationRender && (
                                <ApplicationForm
                                    addApplication={addApplication}
                                    setAddApplicationRender={
                                        setAddApplicationRender
                                    }
                                />
                            )}
                        </section>

                        <section className="mt-8">
                            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Applications
                                </h2>

                                <div className="flex flex-1 gap-2">
                                    <input
                                        type="text"
                                        placeholder="Search applications..."
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                        className="flex-1 rounded-lg border border-gray-700 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm outline-none transition hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    />

                                    <select
                                        id="sort"
                                        value={sortOrder}
                                        onChange={(event) =>
                                            setSortOrder(
                                                event.target.value as
                                                    | "newest"
                                                    | "oldest"
                                                    | "stale"
                                            )
                                        }
                                        className="w-40 cursor-pointer rounded-lg border border-gray-700 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm outline-none transition hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    >
                                        <option value="newest">Newest</option>
                                        <option value="oldest">Oldest</option>
                                        <option value="stale">Stale</option>
                                    </select>
                                </div>
                            </div>

                            <ApplicationList
                                applications={filteredApplications}
                                onEdit={onEdit}
                                deleteApplication={deleteApplication}
                            />

                            {filteredApplications.length === 0 && (
                                <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
                                    <p className="text-gray-500">
                                        No applications found.
                                    </p>
                                </div>
                            )}
                        </section>
                    </div>
                </section>
            </div>

            {selectedApplication && (
                <ApplicationEdit
                    key={selectedApplication.id}
                    application={selectedApplication}
                    editApplication={editApplication}
                    cancelEdit={cancelEdit}
                />
            )}
        </main>
    );
}

export default LandingPage;