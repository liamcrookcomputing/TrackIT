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
        <main>
            <form onSubmit={handleSubmit}>
                <label htmlFor="position">Position: </label>
                <input id="position" type="text" placeholder="Position" onChange={(e)=>setPosition(e.target.value)} value={position} />
                <label htmlFor="company">Company: </label>
                <input id="company" type="text" placeholder="Company" onChange={(e)=>setCompany(e.target.value)} value={company} />
                <label htmlFor="status">Status: </label>
                <select id="status" onChange={(e)=>setStatus(e.target.value as Application["status"])} value={status} >
                    <option value="Saved">Saved</option>
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Technical Assessment">Technical Assessment</option>
                    <option value="Final Interview">Final Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                </select>
                <button type="submit">Submit</button>
                <button type="button" onClick={cancelEdit}>Cancel</button>
            </form>
        </main>
    )
}

export default ApplicationEdit