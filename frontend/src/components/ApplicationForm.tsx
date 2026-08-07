import { useState } from "react";

function ApplicationForm({ addApplication }){
    const [position, setPosition] = useState("")
    const [company, setCompany] = useState("")
    const [status, setStatus] = useState("")

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

    return (
        <main>
            <form onSubmit={handleSubmit}>
                <label htmlFor="position">Position: </label>
                <input id="position" name="position" type="text" placeholder="Position" onChange={(e)=>setPosition(e.target.value)} />
                <label htmlFor="company">Company: </label>
                <input id="company" name="company" type="text" placeholder="Company" onChange={(e)=>setCompany(e.target.value)} />
                <label htmlFor="status">Status: </label>
                <select id="status" name="status" onChange={(e)=>setStatus(e.target.value)} >
                    <option value="Saved">Saved</option>
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Technical Assessment">Technical Assessment</option>
                    <option value="Final Interview">Final Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                </select>
                <button type="submit">Submit</button>
            </form>
        </main>
    )
}

export default ApplicationForm