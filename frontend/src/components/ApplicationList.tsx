import ApplicationCard from './ApplicationCard.tsx'
import { useMemo } from 'react';
import type { Application } from './ApplicationCard.tsx'


function ApplicationList({applications, onEdit, deleteApplication }: {applications: Application[], onEdit: (selectedApplication: Application) => void, deleteApplication: ( deletedApplication: Application) => void}) {

    

    return (
        <>
            {applications.map((application)=>(
                <ApplicationCard 
                    key={application.id}
                    application={application}
                    onEdit={onEdit}
                    deleteApplication={deleteApplication}
                />
            ))}
        </>
    )
}

export default ApplicationList