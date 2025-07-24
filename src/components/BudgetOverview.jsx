import React, { useEffect, useState } from "react";
import { getBudgetOverview } from "../axios/getBudgetOverview";

import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend
} from "recharts";

const COLORS = ["#1e40af", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"];

const BudgetOverview = ({ projectId }) => {
  const [overview, setOverview] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState("ALL");
  const [selectedPhase, setSelectedPhase] = useState("ALL");

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await getBudgetOverview(projectId);
        console.log(res)
        setOverview(res);
      } catch (err) {
        console.error("Error fetching budget overview", err);
      }
    };
    fetchOverview();
  }, [projectId]);

  if (!overview) return (
    <div className="text-center p-10 text-blue-800 font-semibold text-lg">
      ⏳ Loading Budget Overview...
    </div>
  );

  const isOverBudget = overview.totalActualCost > overview.estimatedBudget;

  const filteredRooms = selectedRoom === "ALL"
    ? overview.rooms
    : overview.rooms.filter(r => r.roomName === selectedRoom);

  const filteredPhases = selectedPhase === "ALL"
    ? overview.phases
    : overview.phases.filter(p => p.phaseName === selectedPhase);

  return (
    <div className="p-8 bg-white rounded-3xl shadow-lg text-blue-900 space-y-10 max-w-6xl mx-auto border border-blue-100">
      <h2 className="text-4xl font-bold text-blue-800 tracking-tight">🏗️ {overview.projectName} – Budget Overview</h2>

      {/* Budget Summary */}
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 shadow-sm">
        <h3 className="text-2xl font-semibold mb-3">💰 Estimated vs Actual Budget</h3>
        <div className="space-y-1 text-blue-900">
          <p className="text-lg">Estimated: ₹{overview.estimatedBudget.toLocaleString()}</p>
          <p className="text-lg">Actual: ₹{overview.totalActualCost.toLocaleString()}</p>
        </div>
        
        <progress
          className="w-full h-4 mt-3 rounded-full bg-blue-100"
          value={overview.totalActualCost}
          max={overview.estimatedBudget}
        />

        <p className="text-sm text-gray-600 mt-1">
  {Math.round((overview.totalActualCost / overview.estimatedBudget) * 100)}% spent of estimated budget
</p>
        {isOverBudget && (
          <div className="mt-3 text-red-600 font-bold text-sm">
            🚨 Budget Exceeded!
          </div>
        )}
      </div>

      {/* Room Filter */}
      <div className="flex items-center space-x-3">
        <label className="font-medium text-lg">🛏️ Filter by Room:</label>
        <select
          className="border border-blue-200 px-3 py-2 rounded-lg bg-blue-50 text-blue-800"
          onChange={e => setSelectedRoom(e.target.value)}
        >
          <option value="ALL">All Rooms</option>
          {overview.rooms.map(room => (
            <option key={room.roomId} value={room.roomName}>{room.roomName}</option>
          ))}
        </select>
      </div>

      {/* Pie Chart */}
      <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100">
        <h3 className="text-xl font-semibold mb-4">📊 Room-wise Total Cost</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={filteredRooms}
              dataKey="totalRoomCost"
              nameKey="roomName"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {filteredRooms.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Phase Filter */}
      <div className="flex items-center space-x-3">
        <label className="font-medium text-lg">🧱 Filter by Phase:</label>
        <select
          className="border border-blue-200 px-3 py-2 rounded-lg bg-blue-50 text-blue-800"
          onChange={e => setSelectedPhase(e.target.value)}
        >
          <option value="ALL">All Phases</option>
          {overview.phases.map(phase => (
            <option key={phase.phaseId} value={phase.phaseName}>{phase.phaseName}</option>
          ))}
        </select>
      </div>

      {/* Bar Chart - Phase-wise Total Cost */}
      <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100">
        <h3 className="text-xl font-semibold mb-4">📈 Phase-wise Total Cost</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredPhases}>
            <XAxis dataKey="phaseName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalPhaseCost" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stacked Bar Chart */}
      <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100">
        <h3 className="text-xl font-semibold mb-4">🔧 Vendor vs Material Cost (Stacked)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredPhases}>
            <XAxis dataKey="phaseName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="vendorCost" stackId="a" fill="#2563eb" />
            <Bar dataKey="materialCost" stackId="a" fill="#93c5fd" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BudgetOverview;
