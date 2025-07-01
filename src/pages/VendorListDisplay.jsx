import React, { useState, useEffect } from 'react';
import axiosInstance from "../axios/axiosInstance";
import { Star, BadgeCheck } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const skillOptions = ['ELECTRICITY', 'PLUMBING', 'PAINTING', 'STRUCTURAL_WORK', 'TILING', 'CARPENTRY'];

export default function VendorListDisplay() {
  const [skill, setSkill] = useState(skillOptions[0]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [assignedVendorIds, setAssignedVendorIds] = useState(new Set()); // to track toggled vendors

  useEffect(() => {
    fetchVendors();
  }, [skill]);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/api/vendor-reviews/by-phaseType', {
        params: { phaseType: skill },
      });
      if (Array.isArray(res.data)) {
        setVendors(res.data);
      } else {
        setVendors([]);
      }
    } catch (err) {
      console.error('Error fetching vendors:', err);
      toast.error("Failed to fetch vendors");
      setVendors([]);
    }
    setLoading(false);
  };

  const toggleAssign = async (vendorId, name) => {
    const isAssigned = assignedVendorIds.has(vendorId);
    const action = isAssigned ? 'unassign' : 'assign';

    try {
      await axiosInstance.put(`/api/vendor-assignment/${action}/${vendorId}`);
      toast.success(`${action === 'assign' ? 'Assigned' : 'Unassigned'} ${name}`);

      // Update local state
      setAssignedVendorIds((prev) => {
        const newSet = new Set(prev);
        if (isAssigned) {
          newSet.delete(vendorId);
        } else {
          newSet.add(vendorId);
        }
        return newSet;
      });

    } catch (err) {
      console.error(`Error during ${action}:`, err);
      toast.error(`${action} failed for ${name}`);
    }
  };

  const renderAssignButton = (vendorId, name) => {
    const isAssigned = assignedVendorIds.has(vendorId);
    return (
      <button
        onClick={() => toggleAssign(vendorId, name)}
        className={`w-full py-2 rounded font-semibold text-white ${
          isAssigned ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isAssigned ? 'Unassign' : 'Assign'}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 p-8">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <div className="max-w-screen-xl mx-auto">

        {/* Skill Selector */}
        <div className="flex justify-center mb-10">
          <select
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="p-3 border border-gray-300 rounded bg-white text-[#333333] shadow-sm w-64 text-center"
          >
            <option value="" disabled>Select Skill</option>
            {skillOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Loading or Detail View */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : selectedVendor ? (
          <div className="bg-white rounded-2xl border shadow-lg p-8 flex flex-col lg:flex-row gap-10 max-w-5xl mx-auto">
            <img
              src={selectedVendor.pic || 'https://via.placeholder.com/200'}
              alt={selectedVendor.name}
              className="w-48 h-48 object-cover rounded-xl border mx-auto"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#004A7C] flex items-center gap-2">
                {selectedVendor.name}<BadgeCheck size={20} className="text-blue-500 ml-1" />
              </h2>
              <p className="text-gray-600 mt-1">{skill}</p>
              <div className="my-2 flex flex-col sm:flex-row gap-2">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  Experience: {selectedVendor.experience || '2'} years
                </span>
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  Company: {selectedVendor.companyName || 'Independent'}
                </span>
              </div>
              <p className="text-gray-700 mt-3">
                <strong>About:</strong> {`${selectedVendor.name} is a skilled ${skill.toLowerCase()} professional.`}
              </p>
              <p className="text-black mt-4 text-lg">
                <strong>Price:</strong> ₹{selectedVendor.basePrice || '500'}
              </p>

              {/* Toggle Assign/Unassign */}
              <div className="mt-4">
                {renderAssignButton(selectedVendor.id, selectedVendor.name)}
              </div>

              {/* Reviews */}
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
                            <span className="text-gray-600 ml-1">({r.rating.toFixed(1)})</span>
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1 italic">“{r.comment}”</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(r.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
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
                className="mt-4 text-blue-600 hover:underline"
              >
                ← Back to vendor list
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vendors.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 italic text-lg">
                No vendors available.
              </div>
            ) : (
              vendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className="bg-white rounded-2xl border shadow-md p-5 hover:shadow-lg transition-all flex flex-col items-center"
                >
                  <img
                    src={vendor.pic || 'https://via.placeholder.com/100'}
                    alt={vendor.name}
                    className="w-20 h-20 rounded-full border object-cover mb-3"
                  />
                  <h2 className="text-lg font-bold text-[#004A7C] mb-1 text-center">{vendor.name}</h2>
                  <p className="text-sm text-gray-500 mb-1">{skill}</p>
                  <p className="text-sm text-gray-500 mb-1">{vendor.companyName || 'Independent'}</p>
                  <p className="text-sm text-gray-600 mb-1">{vendor.experience || 0} years</p>
                  <div className="flex items-center text-yellow-500 mb-3">
                    {[...Array(Math.round(vendor.rating))].map((_, i) => (
                      <Star key={i} fill="#FFD700" size={16} />
                    ))}
                    <span className="text-sm ml-2 text-[#666666]">
                      ({vendor.rating?.toFixed(1) || '0.0'})
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedVendor(vendor)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mb-2"
                  >
                    View Profile
                  </button>
                  {renderAssignButton(vendor.id, vendor.name)}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
