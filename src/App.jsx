import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import RegisterForm from './pages/RegisterForm'
import LoginForm from './pages/LoginForm'
import PhaseForm from './pages/PhaseForm'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element = {<RegisterForm/>}/>
        {/* <Route path="/register" element = {RegisterForm}/> */}
        <Route path="/login" element = {<LoginForm/>}/>
        <Route path="/phase-form" element={<PhaseForm />} /> 
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
