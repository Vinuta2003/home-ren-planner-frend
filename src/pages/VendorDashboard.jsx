import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logout } from "../redux/auth/authSlice";
import PhaseCard from "../components/vendor/PhaseCard";
import axiosInstance from "../axios/axiosInstance";
import UpdateProfile from "./UpdateProfile";
import SideBar from "../components/vendor/SideBar";
import NavBar from "../components/NavBar";

const VendorDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [phases, setPhases] = useState([]);
  const [quotes, setQuotes] = useState({});
  const [approval, setApproval] = useState(null);
  const [activeTab, setActiveTab] = useState("assignedPhases");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [phasesPerPage, setPhasesPerPage] = useState(3);
  const [allPhases, setAllPhases] = useState([]);

  useEffect(() => {
    fetchVendorDetails();
    fetchPhases();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when page size changes
  }, [phasesPerPage]);

  useEffect(() => {
    const indexOfLastPhase = currentPage * phasesPerPage;
    const indexOfFirstPhase = indexOfLastPhase - phasesPerPage;
    const currentPhases = allPhases.slice(indexOfFirstPhase, indexOfLastPhase);
    setPhases(currentPhases);
  }, [currentPage, phasesPerPage, allPhases]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(allPhases.length / phasesPerPage);

  const fetchVendorDetails = async () => {
    try {
      const res = await axiosInstance.get("/vendor/getVendorDetails");
      setApproval(res.data.approval);
    } catch (err) {
      console.log("Error Fetching Vendor Approval Status:", err);
    }
  };

  const fetchPhases = async () => {
    try {
      const res = await axiosInstance.get("/vendor/phases");
      setAllPhases(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching phases:", err);
      setAllPhases([]);
    }
  };

  const submitQuote = async (phaseId) => {
    const vendorCost = quotes[phaseId];
    if (!vendorCost || isNaN(vendorCost)) return alert("Enter valid cost");

    try {
      await axiosInstance.post(`/vendor/phase/${phaseId}/quote`, {
        vendorCost,
      });
      alert("Quote submitted successfully!");
      fetchPhases();
    } catch (err) {
      console.error("Error submitting quote:", err);
      alert("Failed to submit quote.");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return approval === true ? (
    <div className="flex min-h-screen font-sans bg-blue-50">
      <SideBar setActiveTab={setActiveTab} handleLogout={handleLogout} />
      {activeTab === "updateProfile" ? (
        <main className="flex-1 overflow-y-auto p-0 pt-0 -mt-20">
          <UpdateProfile />
        </main>
      ) : (
        <main className="flex-1 overflow-y-auto p-8">
          <h1 className="text-3xl font-bold text-blue-700 mb-6">
            Assigned Phases
          </h1>

          {/* Phases per page selector */}
          <div className="flex items-center gap-2 mb-4">
            <label htmlFor="phasesPerPage" className="text-blue-900 font-semibold">Phases per page:</label>
            <select
              id="phasesPerPage"
              value={phasesPerPage}
              onChange={e => setPhasesPerPage(Number(e.target.value))}
              className="border cursor-pointer border-blue-300 rounded-lg px-4 py-2 bg-white text-blue-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm hover:border-blue-400"
            >
              {[3, 5, 10, 20].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          {phases.length === 0 ? (
            <p className="text-gray-600">No phases assigned.</p>
          ) : (
            <>
              {phases.map((phase) => (
                <PhaseCard
                  key={phase.id}
                  phase={phase}
                  quote={quotes[phase.id] || ""}
                  setQuotes={setQuotes}
                  submitQuote={submitQuote}
                />
              ))}
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <button
                    className="px-4 py-2 cursor-pointer rounded-lg bg-blue-100 text-blue-900 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-200 transition-colors"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    &lt;&lt; Previous
                  </button>
                  
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                      <button
                        key={pageNumber}
                        className={`px-3 py-2 rounded-lg font-semibold transition-colors ${
                          currentPage === pageNumber
                            ? "bg-blue-600 text-white"
                            : "bg-blue-100 text-blue-900 hover:bg-blue-200"
                        }`}
                        onClick={() => paginate(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    className="px-4 py-2 cursor-pointer rounded-lg bg-blue-100 text-blue-900 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-200 transition-colors"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next &gt;&gt;
                  </button>
                </div>
              )}
              
            </>
          )}
        </main>
      )}
    </div>
  ) : approval === false ? (
    <p className="text-red-600 text-center mt-10 text-lg font-semibold">
      Your Vendor Request Has Been Rejected
    </p>
  ) : (
    <>
      <NavBar />
      <p className="text-gray-700 text-center mt-32 text-4xl font-bold">
        Your Vendor Request Is Not Approved Yet
      </p>
    </>
  );
};

export default VendorDashboard;
