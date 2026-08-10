import { useState } from "react";
import type { Application } from "./ApplicationCard";

function ApplicationEdit({ application, editApplication, cancelEdit }: 
    { application: Application, editApplication: (editedApplication: Application) => void, cancelEdit: () => void}) {
    const [position, setPosition] = useState(application.position)
    const [company, setCompany] = useState(application.company)
    const [status, setStatus] = useState<Application["status"]>(application.status)

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newApplication = {
            id: application.id,
            position: position,
            company: company,
            status: status,
        }

        editApplication(newApplication)
    }

    return (
        <main 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={cancelEdit}
        >
            <form
                onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()}
                className="flex w-full max-w-[500px] flex-col gap-4 rounded-xl bg-white p-6 shadow-xl"
            >
                <h2 className="text-2xl font-bold !text-black">
                    Edit Application
                </h2>

                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="position"
                        className="text-sm font-semibold text-gray-700"
                    >
                        POSITION
                    </label>
                    <input
                        id="position"
                        type="text"
                        placeholder="Position"
                        onChange={(e) => setPosition(e.target.value)}
                        value={position}
                        className="rounded-lg border px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="company"
                        className="text-sm font-semibold text-gray-700"
                    >
                        COMPANY
                    </label>

                    <input
                        id="company"
                        type="text"
                        placeholder="Company"
                        onChange={(e) => setCompany(e.target.value)}
                        value={company}
                        className="rounded-lg border px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="status"
                        className="text-sm font-semibold text-gray-700"
                    >
                        STATUS
                    </label>

                    <select
                        id="status"
                        onChange={(e) =>
                            setStatus(e.target.value as Application["status"])
                        }
                        value={status}
                        className="rounded-lg border bg-white px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                        <option value="Saved">Saved</option>
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Technical Assessment">
                            Technical Assessment
                        </option>
                        <option value="Final Interview">Final Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={cancelEdit}
                        className="rounded-lg border px-4 py-2 transition hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </main>
    )
}

export default ApplicationEdit