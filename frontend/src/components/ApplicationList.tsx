import ApplicationCard from './ApplicationCard.tsx'
import type { Application } from './ApplicationCard.tsx'


function ApplicationList({applications}: {applications: Application[]}) {
    
    return (
        <>
            {applications.map((application)=>(
                <ApplicationCard 
                    key={application.id} 
                    position={application.position} 
                    company={application.company} 
                    status={application.status}/>
            ))}
        </>
    )
}

export default ApplicationList