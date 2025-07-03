// import React, { useEffect, useState } from "react";
// import { getBudgetOverview } from "../app/apis/getBudgetOverview";

// const BudgetOverview = ({ projectId }) => {
//   const [budgetData, setBudgetData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchBudget = async () => {
//       try {
//         const data = await getBudgetOverview(projectId);
//         setBudgetData(data);
//       } catch (err) {
//         console.error("Error fetching budget overview:", err);
//         setError("Failed to load budget overview.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBudget();
//   }, [projectId]);

//   if (loading) return <div className="text-center mt-8">Loading...</div>;

//   if (error)
//     return <div className="text-center mt-8 text-red-500">{error}</div>;

//   if (!budgetData)
//     return (
//       <div className="text-center mt-8 text-gray-600">
//         No budget data found.
//       </div>
//     );

//   const {
//     estimatedBudget,
//     totalVendorCost,
//     totalMaterialCost,
//     totalActualCost,
//     percentageSpent,
//     remainingBudget,
//     isOverBudget,
//     budgetStatusColor,
//   } = budgetData;

//   return (
//     <div className="max-w-3xl mx-auto mt-10 p-6 rounded-2xl shadow-lg bg-white">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">
//         Project Budget Overview
//       </h2>

//       <div className="grid grid-cols-2 gap-4 mb-6">
//         <div className="bg-blue-100 p-4 rounded-xl shadow">
//           <p className="text-sm text-gray-600">Estimated Budget</p>
//           <p className="text-lg font-semibold">₹{estimatedBudget}</p>
//         </div>

//         <div className="bg-yellow-100 p-4 rounded-xl shadow">
//           <p className="text-sm text-gray-600">Actual Vendor Cost</p>
//           <p className="text-lg font-semibold">₹{totalVendorCost}</p>
//         </div>

//         <div className="bg-green-100 p-4 rounded-xl shadow">
//           <p className="text-sm text-gray-600">Actual Material Cost</p>
//           <p className="text-lg font-semibold">₹{totalMaterialCost}</p>
//         </div>

//         <div className="bg-indigo-100 p-4 rounded-xl shadow">
//           <p className="text-sm text-gray-600">Total Actual Cost</p>
//           <p className="text-lg font-semibold">₹{totalActualCost}</p>
//         </div>
//       </div>

//       <div className="mb-4">
//         <p className="text-sm text-gray-600 mb-1">Budget Usage</p>
//         <div className="w-full bg-gray-200 rounded-full h-4">
//           <div
//             className={`h-4 rounded-full ${
//               budgetStatusColor === "RED"
//                 ? "bg-red-500"
//                 : budgetStatusColor === "ORANGE"
//                 ? "bg-orange-400"
//                 : "bg-green-500"
//             }`}
//             style={{ width: `${percentageSpent}%` }}
//           ></div>
//         </div>
//         <p className="mt-1 text-sm text-gray-700">
//           {percentageSpent.toFixed(2)}% spent
//         </p>
//       </div>

//       <div className="flex justify-between items-center mt-6">
//         <div className="text-md">
//           <p className="text-gray-600">Remaining Budget:</p>
//           <p className="font-semibold">₹{remainingBudget}</p>
//         </div>

//         {isOverBudget && (
//           <div className="text-red-600 font-bold animate-pulse">
//             ⚠️ Over Budget!
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BudgetOverview;

// import React, { useEffect, useState } from "react";

// import {
//   PieChart, Pie, Cell, Tooltip,
//   BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend
// } from "recharts";

// const COLORS = ["#1e40af", "#60a5fa", "#93c5fd", "#bfdbfe", "#60a5fa", "#3b82f6"];

// const BudgetOverview = ({ projectId }) => {
//   const [overview, setOverview] = useState(null);
//   const [selectedRoom, setSelectedRoom] = useState("ALL");
//   const [selectedPhase, setSelectedPhase] = useState("ALL");

//   useEffect(() => {
//     const fetchOverview = async () => {
//       try {        
//         const res = await getBudgetOverview(projectId);
//         setOverview(res.data);
//       } catch (err) {
//         console.error("Error fetching budget overview", err);
//       }
//     };
//     fetchOverview();
//   }, [projectId]);

//   if (!overview) return <div className="text-center p-6 text-blue-900">Loading Budget Overview...</div>;

//   const isOverBudget = overview.totalActualCost > overview.estimatedBudget;

//   const filteredRooms = selectedRoom === "ALL"
//     ? overview.rooms
//     : overview.rooms.filter(r => r.roomName === selectedRoom);

//   const filteredPhases = selectedPhase === "ALL"
//     ? overview.phases
//     : overview.phases.filter(p => p.phaseName === selectedPhase);

//   return (
//     <div className="p-6 bg-white rounded-2xl shadow-md text-blue-900 space-y-8 max-w-screen-lg mx-auto">
//       <h2 className="text-3xl font-bold text-blue-800">🏠 {overview.projectName} – Budget Overview</h2>

//       {/* Budget Comparison */}
//       <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//         <h3 className="text-xl font-semibold mb-2">💰 Estimated vs Actual</h3>
//         <p>Estimated: ₹{overview.estimatedBudget.toLocaleString()}</p>
//         <p>Actual: ₹{overview.totalActualCost.toLocaleString()}</p>
//         <progress className="w-full h-4 mt-2" value={overview.totalActualCost} max={overview.estimatedBudget}></progress>
//         {isOverBudget && (
//           <div className="mt-3 text-red-600 font-bold">
//             🚨 Budget Exceeded!
//           </div>
//         )}
//       </div>

//       {/* Room Filter */}
//       <div>
//         <label className="mr-2 font-medium">Filter by Room:</label>
//         <select
//           className="border px-2 py-1 rounded-md"
//           onChange={e => setSelectedRoom(e.target.value)}
//         >
//           <option value="ALL">All Rooms</option>
//           {overview.rooms.map(room => (
//             <option key={room.roomId} value={room.roomName}>{room.roomName}</option>
//           ))}
//         </select>
//       </div>

//       {/* Pie Chart */}
//       <div>
//         <h3 className="text-xl font-semibold mb-2">📊 Room-wise Cost</h3>
//         <ResponsiveContainer width="100%" height={300}>
//           <PieChart>
//             <Pie
//               data={filteredRooms}
//               dataKey="totalRoomCost"
//               nameKey="roomName"
//               cx="50%"
//               cy="50%"
//               outerRadius={100}
//               label
//               isAnimationActive
//             >
//               {filteredRooms.map((_, i) => (
//                 <Cell key={i} fill={COLORS[i % COLORS.length]} />
//               ))}
//             </Pie>
//             <Tooltip />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Phase Filter */}
//       <div>
//         <label className="mr-2 font-medium">Filter by Phase:</label>
//         <select
//           className="border px-2 py-1 rounded-md"
//           onChange={e => setSelectedPhase(e.target.value)}
//         >
//           <option value="ALL">All Phases</option>
//           {overview.phases.map(phase => (
//             <option key={phase.phaseId} value={phase.phaseName}>{phase.phaseName}</option>
//           ))}
//         </select>
//       </div>

//       {/* Bar Chart - Phase-wise Cost */}
//       <div>
//         <h3 className="text-xl font-semibold mb-2">📈 Phase-wise Total Cost</h3>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={filteredPhases}>
//             <XAxis dataKey="phaseName" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="totalPhaseCost" fill="#3b82f6" isAnimationActive />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Stacked Bar Chart */}
//       <div>
//         <h3 className="text-xl font-semibold mb-2">🧱 Vendor vs Material (Stacked)</h3>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={filteredPhases}>
//             <XAxis dataKey="phaseName" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="vendorCost" stackId="a" fill="#2563eb" isAnimationActive />
//             <Bar dataKey="materialCost" stackId="a" fill="#93c5fd" isAnimationActive />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default BudgetOverview;

import React, { useEffect, useState } from "react";

import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend
} from "recharts";

const COLORS = ["#1e40af", "#60a5fa", "#93c5fd", "#bfdbfe", "#60a5fa", "#3b82f6"];

const BudgetOverview = ({ projectId }) => {
  const [overview, setOverview] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState("ALL");
  const [selectedPhase, setSelectedPhase] = useState("ALL");

  useEffect(() => {
  // Simulated hardcoded data
  const mockData = {
    projectId: projectId,
    projectName: "Demo Project - Lowe's India",
    estimatedBudget: 1000000,
    totalActualCost: 1200000,
    rooms: [
      { roomId: "1", roomName: "Living Room", totalRoomCost: 300000 },
      { roomId: "2", roomName: "Kitchen", totalRoomCost: 250000 },
      { roomId: "3", roomName: "Bedroom", totalRoomCost: 350000 },
      { roomId: "4", roomName: "Bathroom", totalRoomCost: 300000 },
    ],
    phases: [
      {
        phaseId: "p1",
        phaseName: "Plumbing",
        phaseType: "Utility",
        vendorCost: 100000,
        materialCost: 50000,
        totalPhaseCost: 150000,
      },
      {
        phaseId: "p2",
        phaseName: "Electrical",
        phaseType: "Utility",
        vendorCost: 120000,
        materialCost: 60000,
        totalPhaseCost: 180000,
      },
      {
        phaseId: "p3",
        phaseName: "Painting",
        phaseType: "Finishing",
        vendorCost: 90000,
        materialCost: 70000,
        totalPhaseCost: 160000,
      },
    ],
  };

  setOverview(mockData);
}, []);

  if (!overview) return <div className="text-center p-6 text-blue-900">Loading Budget Overview...</div>;

  const isOverBudget = overview.totalActualCost > overview.estimatedBudget;

  const filteredRooms = selectedRoom === "ALL"
    ? overview.rooms
    : overview.rooms.filter(r => r.roomName === selectedRoom);

  const filteredPhases = selectedPhase === "ALL"
    ? overview.phases
    : overview.phases.filter(p => p.phaseName === selectedPhase);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md text-blue-900 space-y-8 max-w-screen-lg mx-auto">
      <h2 className="text-3xl font-bold text-blue-800">🏠 {overview.projectName} – Budget Overview</h2>

      {/* Budget Comparison */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-xl font-semibold mb-2">💰 Estimated vs Actual</h3>
        <p>Estimated: ₹{overview.estimatedBudget.toLocaleString()}</p>
        <p>Actual: ₹{overview.totalActualCost.toLocaleString()}</p>
        <progress className="w-full h-4 mt-2" value={overview.totalActualCost} max={overview.estimatedBudget}></progress>
        {isOverBudget && (
          <div className="mt-3 text-red-600 font-bold">
            🚨 Budget Exceeded!
          </div>
        )}
      </div>

      {/* Room Filter */}
      <div>
        <label className="mr-2 font-medium">Filter by Room:</label>
        <select
          className="border px-2 py-1 rounded-md"
          onChange={e => setSelectedRoom(e.target.value)}
        >
          <option value="ALL">All Rooms</option>
          {overview.rooms.map(room => (
            <option key={room.roomId} value={room.roomName}>{room.roomName}</option>
          ))}
        </select>
      </div>

      {/* Pie Chart */}
      <div>
        <h3 className="text-xl font-semibold mb-2">📊 Room-wise Cost</h3>
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
              isAnimationActive
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
      <div>
        <label className="mr-2 font-medium">Filter by Phase:</label>
        <select
          className="border px-2 py-1 rounded-md"
          onChange={e => setSelectedPhase(e.target.value)}
        >
          <option value="ALL">All Phases</option>
          {overview.phases.map(phase => (
            <option key={phase.phaseId} value={phase.phaseName}>{phase.phaseName}</option>
          ))}
        </select>
      </div>

      {/* Bar Chart - Phase-wise Cost */}
      <div>
        <h3 className="text-xl font-semibold mb-2">📈 Phase-wise Total Cost</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredPhases}>
            <XAxis dataKey="phaseName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalPhaseCost" fill="#3b82f6" isAnimationActive />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stacked Bar Chart */}
      <div>
        <h3 className="text-xl font-semibold mb-2">🧱 Vendor vs Material (Stacked)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredPhases}>
            <XAxis dataKey="phaseName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="vendorCost" stackId="a" fill="#2563eb" isAnimationActive />
            <Bar dataKey="materialCost" stackId="a" fill="#93c5fd" isAnimationActive />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BudgetOverview;
