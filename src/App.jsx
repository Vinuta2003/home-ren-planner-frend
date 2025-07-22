import { Routes, Route, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import RegisterForm from './pages/RegisterForm'
import LoginForm from './pages/LoginForm'
import PhaseForm from './pages/PhaseForm'
import PhasePage from './pages/PhasePage'
import PhaseList from './pages/PhaseList'
import VendorListDisplay from './pages/VendorListDisplay'
import ProtectedRoute from './routes/ProtectedRoute'
import UpdateProfile from './pages/UpdateProfile'
import AdminDashboard from './pages/AdminDashboard'
import PageNotFound from './pages/PageNotFound'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Home from './pages/Home'
import EditPhaseForm from './pages/EditPhase'
import CreateProject from './pages/CreateProject'
import UserDashboard from './pages/UserDashboard'
import VendorDashboard from './pages/VendorDashboard'
import BudgetOverviewPage from './pages/BudgetOverviewPage'


function App() {
  const location = useLocation();

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {!location.pathname.includes("dashboard") && <NavBar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />

        <Route
          path="/update-profile"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER", "VENDOR"]}>
              <UpdateProfile />
            </ProtectedRoute>
          }
        />

        <Route path="/create-project" element={
          <ProtectedRoute allowedRoles={["CUSTOMER"]}>
            <CreateProject />
          </ProtectedRoute>
        }/>

        <Route path="/:projectId/budget-overview" element={
          <ProtectedRoute allowedRoles={["CUSTOMER"]}>
            <BudgetOverviewPage />
          </ProtectedRoute>
        }/>

        <Route path="/userdashboard" element={
          <ProtectedRoute allowedRoles={["CUSTOMER"]}>
            <UserDashboard />
          </ProtectedRoute>
        }/>

        <Route path="/vendorlist" element={<VendorListDisplay />} />
        <Route path="/vendor-list" element={<VendorListDisplay />} />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor-dashboard"
          element={
            <ProtectedRoute allowedRoles={["VENDOR"]}>
              <VendorDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/phase-form/:exposedId" element={<PhaseForm />} />
        <Route path="/phase/room/:exposedId" element={<PhaseList />} />
        <Route path="/phase/:phaseId" element={<PhasePage />} />
        <Route path="/editphase/:id" element={<EditPhaseForm />} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>

      {!location.pathname.includes("dashboard") && <Footer />}

    </>
  );
}

export default App;