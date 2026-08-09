import './ApplicationCard.css'

export interface Application {
    readonly id: number | string;
    position: string;
    company: string;
    status: "Saved" | "Applied" | "Interview" | "Technical Assessment" | "Final Interview" | "Offer" | "Rejected"
}

function ApplicationCard({ application, onEdit, deleteApplication }: 
    { application: Application, onEdit: (selectedApplication: Application) => void, deleteApplication: (deletedApplication: Application) => void}) {
    return (
        <>
            <div className="applicationCard">
                <div className="applicationCard__selection">
                    <p className="applicationCard__title">{application.position}</p>
                    <p className="applicationCard__body">{application.company}</p>
                    <p className="applicationCard__body">{application.status}</p>
                    <button type="button" onClick={() => onEdit(application)}>Edit</button>
                    <button type="button" onClick={() => { 
                        const answer = confirm("Are you sure?") 
                        if (answer) {
                            deleteApplication(application)
                        }
                    }}>Delete</button>
                </div>
            </div>
        </>
    )
}

export default ApplicationCard