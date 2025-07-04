import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";
import { Star, BadgeCheck } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function VendorListDisplay() {
  console.log("Hello there");
  const location = useLocation();
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [assignedVendorIds, setAssignedVendorIds] = useState(new Set());
  const [phaseType, setPhaseType] = useState("");

  // Get phaseType from query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const phase = params.get("phaseType");
    if (!phase) {
      toast.error("No phaseType provided");
      navigate(-1); // Go back to PhaseForm
    } else {
      setPhaseType(phase);
    }
  }, [location.search]);

  // Fetch vendors based on phaseType === skillType
  useEffect(() => {
    if (phaseType) fetchVendors();
  }, [phaseType]);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/vendor-reviews/by-phaseType", {
        params: { phaseType },
      });
      setVendors(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching vendors:", err);
      toast.error("Failed to fetch vendors");
    }
    setLoading(false);
  };

  const toggleAssign = async (vendorId, name) => {
    const isAssigned = assignedVendorIds.has(vendorId);
    const action = isAssigned ? "unassign" : "assign";
    try {
      await axiosInstance.put(`/api/vendor-assignment/${action}/${vendorId}`);
      toast.success(`${action === "assign" ? "Assigned" : "Unassigned"} ${name}`);
      setAssignedVendorIds((prev) => {
        const newSet = new Set(prev);
        isAssigned ? newSet.delete(vendorId) : newSet.add(vendorId);
        return newSet;
      });
    } catch (err) {
      console.error(`Error during ${action}:`, err);
      toast.error(`${action} failed for ${name}`);
    }
  };

  const assignToPhaseForm = (vendorId) => {
    navigate(`/phase-form?vendorId=${vendorId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <h2 className="text-center text-xl font-bold mb-6 text-blue-700">
        Vendor List for Phase Type: <span className="text-black">{phaseType.replaceAll("_", " ")}</span>
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading vendors...</p>
      ) : selectedVendor ? (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
          <div className="flex flex-col lg:flex-row gap-6">
            <img
              src={selectedVendor.pic || "https://via.placeholder.com/200"}
              alt={selectedVendor.name}
              className="w-40 h-40 object-cover rounded-lg border"
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-blue-600 flex items-center gap-2">
                {selectedVendor.name}
                <BadgeCheck size={18} className="text-blue-400" />
              </h3>
              <p className="text-gray-500">{phaseType.replaceAll("_", " ")}</p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Experience:</strong> {selectedVendor.experience} years
              </p>
              <p className="text-sm text-gray-600">
                <strong>Company:</strong> {selectedVendor.companyName}
              </p>
              <p className="text-sm text-gray-700 mt-3 italic">{selectedVendor.description}</p>

              <div className="mt-4 space-x-3">
                <button
                  onClick={() => assignToPhaseForm(selectedVendor.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Select this Vendor
                </button>
                <button
                  onClick={() => setSelectedVendor(null)}
                  className="text-blue-600 underline"
                >
                  ← Back to list
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 italic">No vendors available.</p>
          ) : (
            vendors.map((vendor) => (
              <div
                key={vendor.id}
                className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition text-center"
              >
                <img
                  src={vendor.pic || "https://via.placeholder.com/100"}
                  alt={vendor.name}
                  className="w-20 h-20 mx-auto rounded-full object-cover border mb-2"
                />
                <h4 className="font-bold text-blue-800">{vendor.name}</h4>
                <p className="text-sm text-gray-500">{vendor.companyName}</p>
                <p className="text-sm text-gray-500">{vendor.experience} yrs experience</p>
                <div className="flex justify-center items-center mt-2 text-yellow-500">
                  {[...Array(Math.round(vendor.rating || 0))].map((_, i) => (
                    <Star key={i} size={16} fill="#FFD700" />
                  ))}
                  <span className="ml-1 text-sm text-gray-600">
                    ({vendor.rating?.toFixed(1) || "0.0"})
                  </span>
                </div>
                <div className="mt-3">
                  <button
                    onClick={() => setSelectedVendor(vendor)}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => assignToPhaseForm(vendor.id)}
                    className="w-full mt-2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                  >
                    Select Vendor
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// export default function VendorListDisplay() {
//   console.log("Hello from VendorListDisplay");
//   return <h1>Hello there</h1>;
// }
