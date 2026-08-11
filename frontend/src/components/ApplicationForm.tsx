import { useState } from "react";
import type { Application } from "./ApplicationCard";
import ConfirmationModal from "./ConfirmationModal";

function ApplicationForm({ addApplication, setAddApplicationRender }: { addApplication: (newApplication: Application) => void; setAddApplicationRender: (value: boolean) => void }) {
    const [position, setPosition] = useState("")
    const [company, setCompany] = useState("")
    const [status, setStatus] = useState<Application["status"]>("Saved")

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newApplication = {
            id: 0,
            position: position,
            company: company,
            status: status
        }

        addApplication(newApplication)
    }

    const [showConfirmation, setShowConfirmation] = useState(false);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowConfirmation(true)}
        >
            <form 
                onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()}
                className="flex w-full max-w-[500px] flex-col gap-4 rounded-xl bg-white p-6 shadow-xl"
            >
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
                        onChange={(e) => setStatus(e.target.value as Application["status"])}
                        className="rounded-lg border bg-white px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                        <option value="Saved">Saved</option>
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Technical Assessment">Technical Assessment</option>
                        <option value="Final Interview">Final Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>

                <button 
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
                >
                    Add Application
                </button>
                <button
                    type="button"
                    className="rounded-lg bg-gray-300 px-4 py-2 font-semibold text-gray-700 transition hover:bg-gray-400"
                    onClick={() => setShowConfirmation(true)}
                >
                    Cancel
                </button>
            </form>

            {showConfirmation && <ConfirmationModal
                message="Are you sure you want to cancel?"
                onConfirm={() => setAddApplicationRender(false)}
                onCancel={() => setShowConfirmation(false)}
            />
            }
        </div>
    )
}
export default ApplicationForm