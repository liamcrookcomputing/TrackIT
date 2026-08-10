export interface Application {
    readonly id: number | string;
    position: string;
    company: string;
    status: "Saved" | "Applied" | "Interview" | "Technical Assessment" | "Final Interview" | "Offer" | "Rejected"
}

function ApplicationCard({ application, onEdit, deleteApplication }: 
    { application: Application, onEdit: (selectedApplication: Application) => void, deleteApplication: (deletedApplication: Application) => void}) {
    const statusStyles = {
        "Saved": "border-gray-300 bg-gray-50 text-gray-700",
        "Applied": "border-blue-300 bg-blue-50 text-blue-700",
        "Interview": "border-yellow-300 bg-yellow-50 text-yellow-700",
        "Technical Assessment": "border-orange-300 bg-orange-50 text-orange-700",
        "Final Interview": "border-purple-300 bg-purple-50 text-purple-700",
        "Offer": "border-green-300 bg-green-50 text-green-700",
        "Rejected": "border-red-300 bg-red-50 text-red-700"
    }

    return (
        <>
            <div className={`m-4 max-w-[400px] rounded-xl border p-5 shadow-sm transition hover:shadow-md ${statusStyles[application.status]}`}>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="mt-0 text-xl font-bold">
                            {application.position}
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                            {application.company}
                        </p>
                    </div>

                    <span className="whitespace-nowrap rounded-full bg-white px-3 py-1 text-xs font-semibold shadow-sm">
                        {application.status}
                    </span>
                </div>

                <div className="mt-5 flex justify-end gap-2">
                    <button
                        type="button"
                        className="rounded-lg border bg-white px-3 py-1 text-sm hover:bg-gray-100"
                        onClick={() => onEdit(application)}
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        className="rounded-lg bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                        onClick={() => {
                            const answer = confirm("Are you sure?");
                            if (answer) {
                                deleteApplication(application);
                            }
                        }}>
                        Delete
                    </button>
                </div>
            </div>
        </>
    )
}

export default ApplicationCard