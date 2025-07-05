import { Routes, Route, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import RegisterForm from './pages/RegisterForm'
import LoginForm from './pages/LoginForm'
import PhaseForm from './pages/PhaseForm'
import RoomPage from './pages/RoomPage'
import PhasePage from './pages/PhasePage'
import PhaseList from './pages/PhaseList'
import ProtectedRoute from './routes/ProtectedRoute'
import UpdateProfile from './pages/UpdateProfile'
import VendorListDisplay from './pages/VendorListDisplay'
import AdminDashboard from './pages/AdminDashboard'
import PageNotFound from './pages/PageNotFound'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Home from './pages/Home'
import EditPhaseForm from './pages/EditPhase'


function App() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/admin-dashboard" && <NavBar />}
      <Routes>
        <Route path="/" element={<RoomPage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/phase-form" element={<PhaseForm />} />
        <Route path="/phase/room/:roomId" element={<PhaseList />} />
        <Route path="/phase/:phaseId" element={<PhasePage />} />
        <Route path="/editphase/:id" element={<EditPhaseForm/>}/>
        <Route
          path="/update-profile"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER", "VENDOR"]}>
              <UpdateProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-project"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              {/* Create Project Component */}
            </ProtectedRoute>
          }
        />
        <Route path="/vendorlist" element={<VendorListDisplay />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      {location.pathname !== "/admin-dashboard" && <Footer />}
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
    </>
  )
}

export default App;
