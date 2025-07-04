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
  let location = useLocation();
  return (
    <Router>
      <Routes>
        <Route path="/" element = {<RegisterForm/>}/>
        {/* <Route path="/register" element = {RegisterForm}/> */}
        <Route path="/login" element = {<LoginForm/>}/>
      </Routes>
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
      {location.pathname !== "/admin-dashboard" && <NavBar/>}
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
            {/* Add Create Project Component Here */}
          </ProtectedRoute>
        }/>
        <Route path="/vendorlist" element={<VendorListDisplay />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/vendor-dashboard" />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      {location.pathname !== "/admin-dashboard" && <Footer/>}
    </>
  );
}

export default App;
