import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import RegisterForm from './pages/RegisterForm'
import LoginForm from './pages/LoginForm'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element = {<RegisterForm/>}/>
        {/* <Route path="/register" element = {RegisterForm}/> */}
        <Route path="/login" element = {<LoginForm/>}/>
      </Routes>
    </Router>
  )
}

export default App
