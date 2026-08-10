import type { Application } from './components/ApplicationCard.tsx';
import { useState } from 'react';
import { useMemo } from 'react';
import ApplicationDashboard from './components/ApplicationDashboard.tsx';
import ApplicationList from './components/ApplicationList.tsx';
import ApplicationForm from './components/ApplicationForm.tsx';
import ApplicationEdit from './components/ApplicationEdit.tsx';



function App() {

  const [applications, setApplications] = useState<Application[]>([{id: 1, position: "UI/UX Dev", company: "Google", status: "Applied"},
  {id: 2, position: "Software Engineer", company: "Meta", status: "Technical Assessment"},
  {id: 3, position: "Cybersecurity Junior", company: "Cisco", status: "Offer"}])
  
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)

  const [search, setSearch] = useState("")
  const filteredApplications = useMemo(() => {
        return applications.filter((application) => 
            application.company.toLowerCase().includes(search.toLowerCase()) || 
            application.position.toLowerCase().includes(search.toLowerCase())
        )
    }, [applications, search])

  const totalApplications = applications.length
  const appliedApplications = applications.filter(
    application => application.status === "Applied"
  ).length
  const interviewApplications = applications.filter(
    application => application.status === "Interview"
  ).length + applications.filter(
    application => application.status === "Final Interview"
  ).length
  const offerApplications = applications.filter(
    application => application.status === "Offer"
  ).length

  function addApplication(newApplication: Application) {
    const applicationWithId = 
      {...newApplication,
        id: crypto.randomUUID()
      }

    setApplications(
      [...applications, applicationWithId]
    );
  }

  function onEdit(selectedApplication: Application) {
    setSelectedApplication(
      selectedApplication
    );
  }

  function editApplication(editedApplication: Application){
    const updatedApplication = applications.map((application)=>(
        editedApplication.id == application.id ? editedApplication : application
      )
    )

    setApplications(
      updatedApplication
    );

    setSelectedApplication(null)
  }

  function deleteApplication(deletedApplication: Application){
    const updatedApplication = applications.filter((application)=>
      application.id !== deletedApplication.id
    )
    
    setApplications(
      updatedApplication
    )
  }

  function cancelEdit(){
    setSelectedApplication(null)
  }

  return (
    <>
      <section id="center">
        <div>
          <ApplicationDashboard 
            totalApplications={totalApplications} 
            appliedApplications={appliedApplications} 
            interviewApplications={interviewApplications} 
            offerApplications={offerApplications}
          />
          <ApplicationForm addApplication={addApplication} />
          <input
            type="text"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}></input>
            <div className="mt-6">
              <ApplicationList applications={filteredApplications} onEdit={onEdit} deleteApplication={deleteApplication} />
            </div>
          {selectedApplication && (
            <ApplicationEdit
              key={selectedApplication.id}
              application={selectedApplication}
              editApplication={editApplication}
              cancelEdit={cancelEdit}
            />
          )}
        </div>
      </section>
    </>
  )
}



export default App
