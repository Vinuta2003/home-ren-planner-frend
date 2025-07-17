// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axiosInstance from "../axios/axiosInstance";
// import { Star, BadgeCheck } from "lucide-react";
// import toast, { Toaster } from "react-hot-toast";

// export default function VendorListDisplay() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [vendors, setVendors] = useState([]);
//   const [selectedVendor, setSelectedVendor] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [assignedVendorIds, setAssignedVendorIds] = useState(new Set());
//   const [phaseType, setPhaseType] = useState("");
//   const [formData, setFormData] = useState(null); // 🔥 Important fix

//   // Extract phaseType from query param + formData from location.state
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const type = params.get("phaseType");
//     if (!type) {
//       toast.error("No phaseType provided");
//       navigate(-1);
//     } else {
//       setPhaseType(type);
//     }

//     // Retrieve formData passed from PhaseForm
//     if (location.state?.formData) {
//       setFormData(location.state.formData);
//     } else {
//       toast.error("Missing form data");
//       navigate(-1);
//     }
//   }, [location]);

//   useEffect(() => {
//     if (phaseType) fetchVendors();
//   }, [phaseType]);

//   const fetchVendors = async () => {
//     setLoading(true);
//     try {
//       const res = await axiosInstance.get("/api/vendor-reviews/by-phaseType", {
//         params: { phaseType },
//       });
//       setVendors(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       console.error("Error fetching vendors:", err);
//       toast.error("Failed to fetch vendors");
//     }
//     setLoading(false);
//   };

//   const assignToPhaseForm = (vendorId, vendorName) => {
//     if (!formData || !formData.room) {
//       toast.error("Missing form context");
//       return;
//     }

//     navigate(`/phase-form/${formData.room}?vendorId=${vendorId}&vendorName=${encodeURIComponent(vendorName)}`, {
//       state: { formData }
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
//       <h2 className="text-center text-xl font-bold mb-6 text-blue-700">
//         Vendor List for Phase Type: <span className="text-black">{phaseType.replaceAll("_", " ")}</span>
//       </h2>

//       {loading ? (
//         <p className="text-center text-gray-500">Loading vendors...</p>
//       ) : selectedVendor ? (
//         <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
//           <div className="flex flex-col lg:flex-row gap-6">
//             <img
//               src={selectedVendor.pic || "https://via.placeholder.com/200"}
//               alt={selectedVendor.name}
//               className="w-40 h-40 object-cover rounded-lg border"
//             />
//             <div className="flex-1">
//               <h3 className="text-xl font-bold text-blue-600 flex items-center gap-2">
//                 {selectedVendor.name}
//                 <BadgeCheck size={18} className="text-blue-400" />
//               </h3>
//               <p className="text-gray-500">{phaseType.replaceAll("_", " ")}</p>
//               <p className="text-sm text-gray-600 mt-2">
//                 <strong>Experience:</strong> {selectedVendor.experience} years
//               </p>
//               <p className="text-sm text-gray-600">
//                 <strong>Company:</strong> {selectedVendor.companyName}
//               </p>
//               <p className="text-sm text-gray-700 mt-3 italic">{selectedVendor.description}</p>

//               <div className="mt-4 space-x-3">
//                 <button
//                   onClick={() => assignToPhaseForm(selectedVendor.id, selectedVendor.name)}
//                   className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//                 >
//                   Select this Vendor
//                 </button>
//                 <button
//                   onClick={() => setSelectedVendor(null)}
//                   className="text-blue-600 underline"
//                 >
//                   ← Back to list
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {vendors.length === 0 ? (
//             <p className="col-span-full text-center text-gray-500 italic">No vendors available.</p>
//           ) : (
//             vendors.map((vendor) => (
//               <div
//                 key={vendor.id}
//                 className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition text-center"
//               >
//                 <img
//                   src={vendor.pic || "https://via.placeholder.com/100"}
//                   alt={vendor.name}
//                   className="w-20 h-20 mx-auto rounded-full object-cover border mb-2"
//                 />
//                 <h4 className="font-bold text-blue-800">{vendor.name}</h4>
//                 <p className="text-sm text-gray-500">{vendor.companyName}</p>
//                 <p className="text-sm text-gray-500">{vendor.experience} yrs experience</p>
//                 <div className="flex justify-center items-center mt-2 text-yellow-500">
//                   {[...Array(Math.round(vendor.rating || 0))].map((_, i) => (
//                     <Star key={i} size={16} fill="#FFD700" />
//                   ))}
//                   <span className="ml-1 text-sm text-gray-600">
//                     ({vendor.rating?.toFixed(1) || "0.0"})
//                   </span>
//                 </div>
//                 <div className="mt-3">
//                   <button
//                     onClick={() => setSelectedVendor(vendor)}
//                     className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
//                   >
//                     View Profile
//                   </button>
//                   <button
//                     onClick={() => assignToPhaseForm(vendor.id, vendor.name)}
//                     className="w-full mt-2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
//                   >
//                     Select Vendor
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// }





import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";
import { Star, BadgeCheck } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function VendorListDisplay() {
  const location = useLocation();
  const navigate = useNavigate();

  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [phaseType, setPhaseType] = useState("");
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get("phaseType");
    if (!type) {
      toast.error("No phaseType provided");
      navigate(-1);
    } else {
      setPhaseType(type);
    }

    if (location.state?.formData) {
      setFormData(location.state.formData);
    } else {
      toast.error("Missing form data");
      navigate(-1);
    }
  }, [location]);

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

  const assignToPhaseForm = (vendorId, vendorName) => {
    navigate(`/phase-form/${formData.room}?vendorId=${vendorId}&vendorName=${encodeURIComponent(vendorName)}`, {
      state: { formData }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <h2 className="text-center text-xl font-bold mb-6 text-blue-700">
        Vendor List for Phase Type:{" "}
        <span className="text-black">{phaseType.replaceAll("_", " ")}</span>
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
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                Experience: {selectedVendor.experience || "2"} years
              </span>
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm ml-2">
                Company: {selectedVendor.companyName || "Independent"}
              </span>
              <p className="text-sm text-gray-700 mt-3 italic">
                <strong>About:</strong>{" "}
                {`${selectedVendor.name} is a skilled ${phaseType.toLowerCase()} professional.`}
              </p>
              <p className="text-black mt-4 text-lg">
                <strong>Price:</strong> ₹{selectedVendor.basePrice || "500"}
              </p>

              <div className="mt-4 space-x-3">
                <button
                  onClick={() =>
                    assignToPhaseForm(selectedVendor.id, selectedVendor.name)
                  }
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Select this Vendor
                </button>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2 text-[#004A7C]">Reviews:</h3>
                  <div className="space-y-3">
                    {selectedVendor.reviews?.length ? (
                      selectedVendor.reviews.map((r, i) => (
                        <div key={i} className="border-b pb-2">
                          <div className="flex justify-between items-center text-sm font-semibold text-gray-700">
                            <span>{r.reviewerName}</span>
                            <span className="text-yellow-500 flex items-center gap-1">
                              {[...Array(Math.round(r.rating))].map((_, j) => (
                                <Star key={j} size={14} fill="#FFD700" />
                              ))}
                              <span className="text-gray-600 ml-1">
                                ({r.rating.toFixed(1)})
                              </span>
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mt-1 italic">“{r.comment}”</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(r.createdAt).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="italic text-gray-500">No reviews yet.</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedVendor(null)}
                  className="text-blue-600 underline mt-4"
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
            <p className="col-span-full text-center text-gray-500 italic">
              No vendors available.
            </p>
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
                <p className="text-sm text-gray-500">
                  {vendor.experience} yrs experience
                </p>
                <p className="text-sm text-gray-500">Price: ₹{vendor.basePrice}</p>
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
                    onClick={() => assignToPhaseForm(vendor.id, vendor.name)}
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