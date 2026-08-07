import './ApplicationCard.css'

export interface Application {
    readonly id: number;
    position: string;
    company: string;
    status: "Saved" | "Applied" | "Interview" | "Technical Assessment" | "Final Interview" | "Offer" | "Rejected"
}

function ApplicationCard({position, company, status}: Omit<Application, 'id'>) {
    return (
        <>
            <a href="/" className="applicationCard">
                <div className="applicationCard__selection">
                    <p className="applicationCard__title">{position}</p>
                    <p className="applicationCard__body">{company}</p>
                    <p className="applicationCard__body">{status}</p>
                </div>
            </a>
        </>
    )
}

export default ApplicationCard