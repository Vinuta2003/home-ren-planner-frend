import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import RegisterForm from './pages/RegisterForm'
import LoginForm from './pages/LoginForm'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './routes/ProtectedRoute'
import PageNotFound from './pages/PageNotFound'

import VendorListDisplay from './pages/VendorListDisplay'; // ✅ Import added

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/vendorlist" element={<VendorListDisplay />} /> {/* ✅ Route added */}
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
      
      <Routes>
        
        
        <Route path="/vendor-dashboard"/>

        <Route path="/admin-dashboard" element = {
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard/>
          </ProtectedRoute>
        }/>

        <Route path="*" element={<PageNotFound/>}/>

      </Routes>
    </Router>
  );
}

export default App;
