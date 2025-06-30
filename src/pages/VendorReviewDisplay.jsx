import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const skillOptions = ['Electrical', 'Plumbing', 'Painting', 'Construction'];
const userId = 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa'; // Replace with actual logged-in user ID

export default function VendorReviewDisplay() {
  const [skill, setSkill] = useState('Electrical');
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reviewInputs, setReviewInputs] = useState({});
  const [selectedVendor, setSelectedVendor] = useState(null);

  useEffect(() => {
    fetchVendors();
  }, [skill]);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8080/api/vendor-reviews/by-skill', {
        params: { skill },
      });
      setVendors(res.data);

      const inputMap = {};
      res.data.forEach(v => {
        const userReview = v.userReview;
        if (userReview) {
          inputMap[v.id] = {
            comment: userReview.comment,
            rating: userReview.rating,
            reviewId: userReview.id
          };
        }
      });
      setReviewInputs(inputMap);
    } catch (err) {
      console.error('Error fetching vendors:', err);
    }
    setLoading(false);
  };

  const handleInputChange = (vendorId, field, value) => {
    setReviewInputs(prev => ({
      ...prev,
      [vendorId]: {
        ...prev[vendorId],
        [field]: value
      }
    }));
  };

  const submitReview = async (vendorId) => {
    const { comment, rating, reviewId } = reviewInputs[vendorId] || {};
    if (!comment || !rating) return toast.error('Please fill comment and rating');

    try {
      if (reviewId) {
        await axios.put(`http://localhost:8080/api/vendor-reviews/reviews/${reviewId}`, {
          vendorId, userId, comment, rating: Number(rating)
        });
        toast.success('Review updated');
      } else {
        await axios.post(`http://localhost:8080/api/vendor-reviews/reviews`, {
          vendorId, userId, comment, rating
        });
        toast.success('Review added');
      }
      fetchVendors();
    } catch (err) {
      console.error('Review submit failed:', err);
      toast.error('Failed to submit review');
    }
  };

  const deleteReview = async (vendorId) => {
    const reviewId = reviewInputs[vendorId]?.reviewId;
    if (!reviewId) return toast.error('No review to delete');

    try {
      await axios.delete(`http://localhost:8080/api/vendor-reviews/reviews/${reviewId}`);
      toast.success('Review deleted');
      fetchVendors();
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Failed to delete review');
    }
  };

  const toggleAssignVendor = async (vendorId, available, name) => {
    try {
      const action = available ? 'assign' : 'unassign';
      await axios.put(`http://localhost:8080/api/vendor-assignment/${action}/${vendorId}`);
      toast.success(`${available ? 'Assigned' : 'Unassigned'} ${name}`);
      fetchVendors();
    } catch (err) {
      console.error('Error toggling assign/unassign:', err);
      toast.error(`${available ? 'Assign' : 'Unassign'} failed for ${name}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 p-8">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-[#004A7C] drop-shadow-md">Vendor Reviews</h1>

        <div className="flex justify-center mb-10">
          <select
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="p-3 border border-gray-300 rounded bg-white text-[#333333] shadow-sm w-64 text-center"
          >
            {skillOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

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
                {selectedVendor.name} <span className="text-blue-500">✔</span>
              </h2>
              <p className="text-gray-600 mt-1">{selectedVendor.skill}</p>
              <p className="text-sm mt-1 font-semibold text-green-600">
                {selectedVendor.available ? 'Available' : 'Not Available'}
              </p>
              <div className="my-2 flex flex-col sm:flex-row gap-2">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  Experience: {selectedVendor.experience || '2'} 
                </span>
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  Company: {selectedVendor.companyName || 'Independent'}
                </span>
              </div>
              <p className="text-gray-700 mt-3">
                <strong>About:</strong> {`${selectedVendor.name} is a skilled ${selectedVendor.skill?.toLowerCase()} professional.`}
              </p>
              <p className="text-black mt-4 text-lg"><strong>Price:</strong> ₹{selectedVendor.basePrice || '500'}</p>

              <button
                onClick={() => toggleAssignVendor(selectedVendor.id, selectedVendor.available, selectedVendor.name)}
                className={`w-full py-2 rounded font-semibold transition mt-4 ${
                  selectedVendor.available ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
                } text-white`}
              >
                {selectedVendor.available ? 'Assign' : 'Unassign'}
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
                            <span className="text-gray-600 ml-1">({r.rating.toFixed(1)})</span>
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1 italic">“{r.comment}”</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}</p>
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
            {vendors.map((vendor) => (
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
                <p className="text-sm text-gray-500 mb-1">{vendor.skill}</p>
                <p className="text-sm text-gray-500 mb-1">{vendor.companyName || 'Independent'}</p>
                <p className="text-sm text-gray-600 mb-1">{vendor.experience || 0} </p>
                <p className={`text-sm font-semibold ${vendor.available ? 'text-green-600' : 'text-red-600'} mb-2`}>
                  {vendor.available ? 'Available' : 'Not Available'}
                </p>
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
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mb-2"
                >
                  View Profile
                </button>
                <button
                  onClick={() => toggleAssignVendor(vendor.id, vendor.available, vendor.name)}
                  className={`w-full py-2 rounded font-semibold ${
                    vendor.available ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
                  } text-white`}
                >
                  {vendor.available ? 'Assign' : 'Unassign'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
