// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";

// function EditPhaseForm() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [phaseData, setPhaseData] = useState(null);
//   const [statuses, setStatuses] = useState([]);

//   useEffect(() => {
//     axios.get(`http://localhost:8080/phase/${id}`)
//       .then((res) => setPhaseData(res.data))
//       .catch((err) => console.error("Phase fetch error:", err));

//     axios.get("http://localhost:8080/api/enums/phase-statuses")
//       .then((res) => setStatuses(res.data));
//   }, [id]);

//   const handleChange = (e) => {
//     setPhaseData({ ...phaseData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     axios.put(`http://localhost:8080/phase/${id}`, phaseData)
//       .then(() => navigate(`/phase/${id}`));
//   };

//   if (!phaseData) return <p className="text-center mt-20 text-gray-600">Loading...</p>;

//   return (
//     <div className="min-h-screen bg-blue-50 p-70 pt-24">
//       <div className="ml-10 max-w-5xl bg-white pt-12 pb-35 px-12 rounded-2xl shadow-lg text-center">
//         <h1 className="text-2xl font-bold text-blue-800 text-center mb-6">Edit Phase</h1>
//         <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left text-blue-900 mb-10">

//           <div className="space-y-3">
//             <div>
//               <label className="font-semibold">Phase Name</label>
//               <input
//                 type="text"
//                 name="phaseName"
//                 value={phaseData.phaseName || ''}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
//               />
//             </div>

//             <div>
//               <label className="font-semibold">Start Date</label>
//               <input
//                 type="date"
//                 name="startDate"
//                 value={phaseData.startDate || ''}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
//               />
//             </div>

//             <div>
//               <label className="font-semibold">Status</label>
//               <select
//                 name="phaseStatus"
//                 value={phaseData.phaseStatus || ''}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
//               >
//                 {statuses.map((status) => (
//                   <option key={status} value={status}>{status}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="space-y-3">
//             <div>
//               <label className="font-semibold">Description</label>
//               <textarea
//                 name="description"
//                 value={phaseData.description || ''}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
//                 rows={4}
//               />
//             </div>

//             <div>
//               <label className="font-semibold">End Date</label>
//               <input
//                 type="date"
//                 name="endDate"
//                 value={phaseData.endDate || ''}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
//               />
//             </div>
//           </div>

//           <div className="sm:col-span-2 flex justify-center gap-4 mt-4">
//             <button
//               type="submit"
//               className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//             >
//               Save Changes
//             </button>
//             <button
//               type="button"
//               onClick={() => navigate(`/phase/${id}`)}
//               className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default EditPhaseForm;


//********************above your code below new code***************************** */














import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditPhaseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [phaseData, setPhaseData] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [reviewData, setReviewData] = useState({ comment: "", rating: 0 });

  const userId = "248cf7fd-7f0b-4cde-8b2f-bc73f26da083"; // Replace with Redux later

  useEffect(() => {
    axios.get(`http://localhost:8080/phase/${id}`)
      .then((res) => {
        setPhaseData(res.data);
      })
      .catch((err) => console.error("Phase fetch error:", err));

    axios.get("http://localhost:8080/api/enums/phase-statuses")
      .then((res) => setStatuses(res.data));
  }, [id]);

  const handleChange = (e) => {
    setPhaseData({ ...phaseData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:8080/phase/${id}`, phaseData)
      .then(() => navigate(`/phase/${id}`))
      .catch((err) => {
        console.error("Phase update error:", err);
        alert("Failed to update phase.");
      });
  };

  const handleReviewSubmit = async () => {
    if (!reviewData.comment || reviewData.rating === 0) {
      alert("Please provide both comment and rating.");
      return;
    }

    const reviewPayload = {
      vendorId: phaseData.vendor.id,
      userId,
      comment: reviewData.comment,
      rating: Number(reviewData.rating),
    };

    try {
      await axios.post("http://localhost:8080/api/vendor-reviews/reviews", reviewPayload);
      alert("Review submitted successfully!");
      setReviewData({ comment: "", rating: 0 });
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review.");
    }
  };

  if (!phaseData) return <p className="text-center mt-20 text-gray-600">Loading...</p>;

  return (
    <div className="min-h-screen bg-blue-50 p-70 pt-24">
      <div className="ml-10 max-w-5xl bg-white pt-12 pb-35 px-12 rounded-2xl shadow-lg text-center">
        <h1 className="text-2xl font-bold text-blue-800 text-center mb-6">Edit Phase</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left text-blue-900 mb-10">
          <div className="space-y-3">
            <div>
              <label className="font-semibold">Phase Name</label>
              <input
                type="text"
                name="phaseName"
                value={phaseData.phaseName || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              />
            </div>

            <div>
              <label className="font-semibold">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={phaseData.startDate || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              />
            </div>

            <div>
              <label className="font-semibold">Status</label>
              <select
                name="phaseStatus"
                value={phaseData.phaseStatus || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="font-semibold">Description</label>
              <textarea
                name="description"
                value={phaseData.description || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                rows={4}
              />
            </div>

            <div>
              <label className="font-semibold">End Date</label>
              <input
                type="date"
                name="endDate"
                value={phaseData.endDate || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              />
            </div>
          </div>

          <div className="sm:col-span-2 flex justify-center gap-4 mt-4">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate(`/phase/${id}`)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* ⭐ Review section only if phase is COMPLETED and vendor is assigned */}
        {phaseData?.phaseStatus?.toUpperCase() === "COMPLETED" && phaseData.vendor?.id &&(
          <div className="mt-8 border-t pt-6 text-left">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">
              Leave a Review for {phaseData.vendor.name || "Vendor"}
            </h2>

            <textarea
              className="w-full p-2 border border-gray-300 rounded mb-3"
              placeholder="Write your review"
              value={reviewData.comment}
              onChange={(e) => setReviewData((prev) => ({ ...prev, comment: e.target.value }))}
            />

            <div className="flex items-center gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewData((prev) => ({ ...prev, rating: star }))}
                  className={`text-2xl ${star <= reviewData.rating ? "text-yellow-400" : "text-gray-300"}`}
                >
                  ★
                </button>
              ))}
              <span>{reviewData.rating > 0 ? `${reviewData.rating} Star${reviewData.rating > 1 ? "s" : ""}` : "No rating"}</span>
            </div>

            <button
              onClick={handleReviewSubmit}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Submit Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditPhaseForm;
