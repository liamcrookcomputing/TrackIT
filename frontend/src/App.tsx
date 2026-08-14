import type { Application } from './components/ApplicationCard.tsx';
import { useMemo, useEffect, useState } from 'react';

import ApplicationDashboard from './components/ApplicationDashboard.tsx';
import ApplicationList from './components/ApplicationList.tsx';
import ApplicationForm from './components/ApplicationForm.tsx';
import ApplicationEdit from './components/ApplicationEdit.tsx';
import LoginForm from './components/LoginForm.tsx'
import RegisterForm from './components/RegisterForm.tsx';

function App() {

    const API_URL = import.meta.env.VITE_API_URL;

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null)
    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        const fetchApplications = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/api/applications`,
                    {
                        credentials: "include"
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch applications");
                }

                const data: Application[] = await response.json();

                setApplications(data);
            } catch (error) {
                console.error(error);
                setError("Failed to load applications");
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [isAuthenticated]);

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

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/api/me`,
                    {
                        credentials: "include"
                    }
                );

                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }

            } catch (error) {
                console.error(error);
                setIsAuthenticated(false);
            } finally {
                setCheckingAuth(false);
            }
        };

        checkAuth();
    }, []);

    const [authView, setAuthView] = useState<"login" | "register">("login");

    function renderAddApplication() {
        setAddApplicationRender(!addApplicationRender);
    }

    async function addApplication(newApplication: Application) {
        try {
            const response = await fetch(
                `${API_URL}/api/applications`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        position: newApplication.position,
                        company: newApplication.company,
                        status: newApplication.status
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to create application");
            }

            const createdApplication: Application = await response.json();

            setApplications((currentApplications) => [
                ...currentApplications,
                createdApplication
            ]);

            setAddApplicationRender(false);
        } catch (error) {
            console.error(error);
        }
    }


    function onEdit(selectedApplication: Application) {
        setSelectedApplication(selectedApplication);
    }

    async function editApplication(editedApplication: Application) {
        try {
            const response = await fetch (
                `http://localhost:3000/api/applications/${editedApplication.id}`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        position: editedApplication.position,
                        company: editedApplication.company,
                        status: editedApplication.status
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to edit application")
            }

            const serverApplication: Application = await response.json();

            const updatedApplication = applications.map((application) =>
            serverApplication.id === application.id
                ? serverApplication
                : application
        );

        setApplications(updatedApplication);
        setSelectedApplication(null);

        } catch (error) {
            console.error(error)
        }
    }

    async function deleteApplication(deletedApplication: Application) {
        try {
            const response = await fetch (
                `http://localhost:3000/api/applications/${deletedApplication.id}`,
                {
                    method: "DELETE",
                    credentials: "include"
                }
            )

            if (!response.ok) {
                throw new Error("Failed to delete application");
            }

            setApplications((currentApplications) =>
                currentApplications.filter(
                    (application) => application.id !== deletedApplication.id
                )
            );

        } catch (error) {
            console.error(error)
        }
    }

    function cancelEdit() {
        setSelectedApplication(null);
    }

    async function handleLogout() {
        try {
            const response = await fetch(
                `${API_URL}/api/logout`,
                {
                    method: "POST",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                throw new Error("Failed to log out");
            }

            setIsAuthenticated(false);
            setApplications([]);
        } catch (error) {
            console.error(error);
        }
    }

    if (checkingAuth) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-100">
                <p className="text-gray-500">
                    Checking authentication...
                </p>
            </main>
        );
    }

    if (!isAuthenticated) {
        if (authView === "login") {
            return (
                <LoginForm
                    onLogin={() => setIsAuthenticated(true)}
                    onRegister={() => setAuthView("register")}
                />
            );
        }

        return (
            <RegisterForm
                onRegister={() => setIsAuthenticated(true)}
                onLogin={() => setAuthView("login")}
            />
        );
    }

    return (
        <main className="min-h-screen bg-gray-100 px-4 py-8">
            <div className="mx-auto flex max-w-6xl flex-col gap-8">

                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            TrackIT
                        </h1>

                        <p className="mt-1 text-gray-500">
                            Track and manage your job applications.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    >
                        Logout
                    </button>
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

                    {loading && (
                        <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
                            <p className="text-gray-500">
                                Loading applications...
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
                            <p className="text-red-600">
                                {error}
                            </p>
                        </div>
                    )}

                    {!loading && !error && (
                        <>
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
                        </>
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