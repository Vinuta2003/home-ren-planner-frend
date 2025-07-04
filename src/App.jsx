import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import RegisterForm from './pages/RegisterForm'
import LoginForm from './pages/LoginForm'
import PhaseForm from './pages/PhaseForm'
import ProjectPage from './pages/ProjectDashboard'
import PhasePage from './pages/PhasePage'
import PhaseList from './pages/PhaseList'

function App() {

  return (
    <Router>
      <Routes>
        {/* <Route path="/" element = {<RegisterForm/>}/> */}
        {/* <Route path="/register" element = {RegisterForm}/> */}
        <Route path="/login" element = {<LoginForm/>}/>
        <Route path="/phase-form" element={<PhaseForm />} /> 
        <Route path="/" element={<ProjectPage />} />
        <Route path="/phase/project/:projectId" element={<PhaseList />} />
        <Route path="/phase/:phaseId" element={<PhasePage/>}/>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  )
}

export default App
