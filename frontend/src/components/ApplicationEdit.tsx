import { useState } from "react";
import type { Application, ApplicationUpdate } from "../types/applications";
import ConfirmationModal from "./ConfirmationModal";
import { STATUS_CONFIG } from "../types/statusConfig";

function ApplicationEdit({ application, editApplication, cancelEdit }: 
    { application: Application, editApplication: (editedApplication: ApplicationUpdate) => void, cancelEdit: () => void}) {
    const [position, setPosition] = useState(application.position)
    const [company, setCompany] = useState(application.company)
    const [status, setStatus] = useState<Application["status"]>(application.status)
    const [rejectionReason, setRejectionReason] = useState<string | null>(null)
    const rejectionReasons = [
        "No response",
        "Resume screening",
        "Experience mismatch",
        "Technical assessment",
        "Interview",
        "Position filled",
        "Salary",
        "Other"
    ];

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newApplication = {
            id: application.id,
            position: position,
            company: company,
            status: status,
            rejectionReason: status === "Rejected" ? rejectionReason : undefined,
        }

        editApplication(newApplication)
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
                className="flex w-full max-w-125 flex-col gap-4 rounded-xl bg-white p-6 shadow-xl"
            >
                <h2 className="text-2xl font-bold text-black!">
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

                    <div className="relative">
                        <span
                            className={`pointer-events-none absolute left-3 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full ${
                                STATUS_CONFIG[status].dotColor
                            }`}
                        />

                        <select
                            id="status"
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value as Application["status"])
                            }
                            className="w-full rounded-lg border bg-white py-2 pl-8 pr-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
                </div>

                {status === "Rejected" && (
                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="rejectionReason"
                            className="text-sm font-semibold text-gray-700"
                        >
                            REJECTION REASON <span className="font-normal text-gray-500">(OPTIONAL)</span>
                        </label>

                        <select
                            id="rejectionReason"
                            value={rejectionReason ?? ""}
                            onChange={(e) =>
                                setRejectionReason(
                                    e.target.value === "" ? null : e.target.value
                                )
                            }
                            className="rounded-lg border bg-white px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        >
                            <option value="">Skip</option>

                            {rejectionReasons.map((reason) => (
                                <option key={reason} value={reason}>
                                    {reason}
                                </option>
                            ))}
                        </select>
                    </div>
                    )
                    
                }

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => setShowConfirmation(true)}
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
            
            {showConfirmation && (
                <ConfirmationModal
                    message="Are you sure you want to cancel?"
                    onConfirm={() => {
                        cancelEdit();
                        setShowConfirmation(false);
                    }}
                    onCancel={() => setShowConfirmation(false)}
                />
            )}
        </div>
    )
}

export default ApplicationEdit