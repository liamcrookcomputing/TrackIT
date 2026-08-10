import ApplicationCard from './ApplicationCard.tsx'
import { useMemo } from 'react';
import type { Application } from './ApplicationCard.tsx'


function ApplicationList({applications, onEdit, deleteApplication }: {applications: Application[], onEdit: (selectedApplication: Application) => void, deleteApplication: ( deletedApplication: Application) => void}) {

    

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {applications.map((application)=>(
                <ApplicationCard 
                    key={application.id}
                    application={application}
                    onEdit={onEdit}
                    deleteApplication={deleteApplication}
                />
            ))}
        </div>
    )
}

export default ApplicationList