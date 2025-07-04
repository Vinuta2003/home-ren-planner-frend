import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { logout } from "../redux/auth/authSlice";
import PhaseCard from "../components/vendor/PhaseCard";
import axiosInstance from "../axios/axiosInstance";
import UpdateProfile from "./UpdateProfile";
import SideBar from "../components/vendor/SideBar";

const VendorDashboard = () => {
  const dispatch = useDispatch();
  const [phases, setPhases] = useState([]);
  const [quotes, setQuotes] = useState({});

  const [activeTab, setActiveTab] = useState("assignedPhases");

  useEffect(() => {
    fetchPhases();
  }, []);

  const fetchPhases = async () => {
    try {
      const res = await axiosInstance.get("/vendor/phases");
      setPhases(res.data);
      //console.log(res.data);
    } catch (err) {
      console.error("Error fetching phases:", err);
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

  return (
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

          {phases.length === 0 ? (
            <p className="text-gray-600">No phases assigned.</p>
          ) : (
            phases.map((phase) => (
              <PhaseCard
                key={phase.id}
                phase={phase}
                quote={quotes[phase.id] || ""}
                setQuotes={setQuotes}
                submitQuote={submitQuote}
              />
            ))
          )}
        </main>
      )}
    </div>
  );
};

export default VendorDashboard;
