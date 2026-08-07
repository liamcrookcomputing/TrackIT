import type { Application } from './components/ApplicationCard.tsx';
import { useState } from 'react';
import ApplicationList from './components/ApplicationList.tsx';
import ApplicationForm from './components/ApplicationForm.tsx';



function App() {

  const [applications, setApplications] = useState<Application[]>([{id: 1, position: "UI/UX Dev", company: "Google", status: "Applied"},
  {id: 2, position: "Software Engineer", company: "Meta", status: "Technical Assessment"},
  {id: 3, position: "Cybersecurity Junior", company: "Cisco", status: "Offer"}])

  function addApplication(newApplication: Application) {

    const applicationWithId = {
      id: applications.length + 1,
      position: newApplication.position,
      company: newApplication.company,
      status: newApplication.status
    }

    setApplications(
      [...applications, applicationWithId]
    );
  }

  return (
    <>
      <section id="center">
        <div>
          <ApplicationForm addApplication={addApplication} />
          <h1>Get started</h1>
          <ApplicationList applications={applications} />
        </div>
      </section>
    </>
  )
}



export default App
