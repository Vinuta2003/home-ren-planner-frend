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
    }
    setLoading(false);
  };

  const assignToPhaseForm = (vendorId, vendorName) => {
    navigate(`/phase-form/${formData.room}?vendorId=${vendorId}&vendorName=${encodeURIComponent(vendorName)}`, {
      state: { formData },
    });
  };

  return (
    <div className="min-h-screen bg-[#F3F9FF] p-8 mt-10">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <h2 className="text-center text-xl font-bold mb-6 text-blue-700">
        {/* Vendor List for Phase Type:{" "} */}
        {/* <span className="text-black mb-3">{phaseType.replaceAll("_", " ")}</span> */}
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading vendors...</p>
      ) : selectedVendor ? (
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <img
              src={selectedVendor.pic || "https://via.placeholder.com/180"}
              alt={selectedVendor.name}
              className="w-44 h-44 rounded-full border-4 border-white shadow-md object-cover"
            />

            <div className="flex-1">
              <h3 className="text-2xl font-bold text-blue-700 flex items-center gap-2 mb-1">
                {selectedVendor.name}
                <BadgeCheck className="text-blue-500" size={20} />
              </h3>

              <p className="uppercase text-gray-500 font-semibold tracking-wide">
                {phaseType.replaceAll("_", " ")}
              </p>

              <div className="flex flex-wrap gap-3 mt-4">
                <span className="bg-gray-100 text-sm px-3 py-1 rounded-full">
                  Experience: {selectedVendor.experience || "2"} years
                </span>
                <span className="bg-gray-100 text-sm px-3 py-1 rounded-full">
                  Company: {selectedVendor.companyName || "Independent"}
                </span>
              </div>


              <p className="mt-4 text-lg font-semibold text-black">
                Price: ₹{selectedVendor.basePrice || "500"}
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() =>
                    assignToPhaseForm(selectedVendor.id, selectedVendor.name)
                  }
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition"
                >
                  Select this Vendor
                </button>
                <button
                  onClick={() => setSelectedVendor(null)}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-6 py-2 rounded-lg font-medium transition"
                >
                  ← Back to list
                </button>
              </div>

              <div className="mt-10">
                <h4 className="text-lg font-semibold text-[#004A7C] mb-3">Reviews:</h4>
                <div className="space-y-4">
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
            </div>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {vendors.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 italic">
              No vendors available.
            </p>
          ) : (
            vendors.map((vendor) => (
              <div
                key={vendor.id}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 text-center border border-gray-100"
              >
                <img
                  src={vendor.pic || "https://via.placeholder.com/100"}
                  alt={vendor.name}
                  className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-white shadow-md -mt-12 mb-4"
                />
                <h4 className="text-lg font-semibold text-blue-700">{vendor.name}</h4>
                <p className="text-sm text-gray-500">{vendor.companyName}</p>
                <p className="text-sm text-gray-700 font-medium mt-1">{vendor.experience} years experience</p>
                <p className="text-sm text-gray-700 font-medium mt-1">Price: ₹{vendor.basePrice}</p>

                <div className="flex justify-center items-center mt-3 text-yellow-500">
                  {[...Array(Math.round(vendor.rating || 0))].map((_, i) => (
                    <Star key={i} size={16} fill="#FFD700" />
                  ))}
                  <span className="ml-1 text-sm text-gray-600">
                    ({vendor.rating?.toFixed(1) || "0.0"})
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => setSelectedVendor(vendor)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => assignToPhaseForm(vendor.id, vendor.name)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition"
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
