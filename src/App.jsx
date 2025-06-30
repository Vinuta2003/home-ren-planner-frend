import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import RegisterForm from './pages/RegisterForm'
import LoginForm from './pages/LoginForm'
import AdminDashboard from './pages/AdminDashboard'

function App() {

  return (
    <Router>
      
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
      
      <Routes>
        <Route path="/" element = {<AdminDashboard/>}/>
        <Route path="/register" element = {<RegisterForm/>}/>
        <Route path="/login" element = {<LoginForm/>}/>
        <Route path="/vendor-dashboard"/>
        {/* <Route path="/admin-dashboard" element = {<AdminDashboard/>}/> */}

      </Routes>
    </Router>
  )
}

export default App
