import type { Application } from './components/ApplicationCard.tsx';
import { useMemo, useState } from 'react';

import ApplicationDashboard from './components/ApplicationDashboard.tsx';
import ApplicationList from './components/ApplicationList.tsx';
import ApplicationForm from './components/ApplicationForm.tsx';
import ApplicationEdit from './components/ApplicationEdit.tsx';

function App() {
    const [applications, setApplications] = useState<Application[]>([
        {
            id: 1,
            position: "UI/UX Dev",
            company: "Google",
            status: "Applied"
        },
        {
            id: 2,
            position: "Software Engineer",
            company: "Meta",
            status: "Technical Assessment"
        },
        {
            id: 3,
            position: "Cybersecurity Junior",
            company: "Cisco",
            status: "Offer"
        }
    ]);

    const [selectedApplication, setSelectedApplication] =
        useState<Application | null>(null);

    const [search, setSearch] = useState("");

    const filteredApplications = useMemo(() => {
        return applications.filter((application) =>
            application.company.toLowerCase().includes(search.toLowerCase()) ||
            application.position.toLowerCase().includes(search.toLowerCase())
        );
    }, [applications, search]);

    const totalApplications = applications.length;

    const appliedApplications = applications.filter(
        application => application.status === "Applied"
    ).length;

    const interviewApplications =
        applications.filter(
            application => application.status === "Interview"
        ).length +
        applications.filter(
            application => application.status === "Final Interview"
        ).length;

    const offerApplications = applications.filter(
        application => application.status === "Offer"
    ).length;

    const [addApplicationRender, setAddApplicationRender] = useState(false);

    function renderAddApplication() {
        setAddApplicationRender(!addApplicationRender);
    }

    function addApplication(newApplication: Application) {
        const applicationWithId = {
            ...newApplication,
            id: crypto.randomUUID()
        };

        setApplications([
            ...applications,
            applicationWithId
        ]);

        setAddApplicationRender(false);
    }


    function onEdit(selectedApplication: Application) {
        setSelectedApplication(selectedApplication);
    }

    function editApplication(editedApplication: Application) {
        const updatedApplication = applications.map((application) =>
            editedApplication.id === application.id
                ? editedApplication
                : application
        );

        setApplications(updatedApplication);
        setSelectedApplication(null);
    }

    function deleteApplication(deletedApplication: Application) {
        const updatedApplication = applications.filter(
            (application) =>
                application.id !== deletedApplication.id
        );

        setApplications(updatedApplication);
    }

    function cancelEdit() {
        setSelectedApplication(null);
    }

    return (
        <main className="min-h-screen bg-gray-100 px-4 py-8">
            <div className="mx-auto flex max-w-6xl flex-col gap-8">

                <header>
                    <h1 className="text-3xl font-bold text-gray-900">
                        TrackIT
                    </h1>
                    <p className="mt-1 text-gray-500">
                        Track and manage your job applications.
                    </p>
                </header>

                <ApplicationDashboard
                    totalApplications={totalApplications}
                    appliedApplications={appliedApplications}
                    interviewApplications={interviewApplications}
                    offerApplications={offerApplications}
                />

                <section>
                    <button type="button" onClick={renderAddApplication} className="mb-4 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                        Add Application
                    </button>

                    {addApplicationRender && (
                        <ApplicationForm
                            addApplication={addApplication}
                            setAddApplicationRender={setAddApplicationRender}
                        />
                    )}
                </section>

                <section>
                    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <h2 className="text-xl font-bold text-gray-900">
                            Applications
                        </h2>

                        <input
                            type="text"
                            placeholder="Search applications..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border bg-white px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
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

export default App;