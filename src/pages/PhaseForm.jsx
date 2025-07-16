// // import { useEffect, useState } from "react";
// // import { useNavigate, useLocation, useParams } from "react-router-dom";
// // import { createPhaseApi } from "../app/apis/phaseListAPIs";
// // import axios from "axios";

// // function PhaseForm() {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const { roomId } = useParams();

// //   const [renovationType, setRenovationType] = useState('');
// //   const [phaseTypes, setPhaseTypes] = useState([]);
// //   const [phaseStatuses, setPhaseStatuses] = useState([]);
// //   const [formData, setFormData] = useState({
// //     phaseName: "",
// //     description: "",
// //     phaseType: "",
// //     phaseStatus: "",
// //     startDate: "",
// //     endDate: "",
// //     vendor: "",
// //     vendorName: "",
// //     room: ""
// //   });

// //   // Fetch room details
// //   useEffect(() => {
// //     if (roomId) {
// //       axios.get(`http://localhost:8080/rooms/${roomId}`)
// //         .then(res => {
// //           setRenovationType(res.data.renovationType);
// //           setFormData(prev => ({ ...prev, room: roomId }));
// //         })
// //         .catch(err => console.error("Error fetching room:", err));
// //     }
// //   }, [roomId]);

// //   // Handle vendor info from VendorListDisplay
// //   useEffect(() => {
// //     const params = new URLSearchParams(location.search);
// //     const vendorId = params.get("vendorId");
// //     const vendorName = params.get("vendorName");
// //     if (vendorId && vendorName) {
// //       setFormData(prev => ({
// //         ...prev,
// //         vendor: vendorId,
// //         vendorName: decodeURIComponent(vendorName)
// //       }));
// //     }
// //   }, [location.search]);

// //   // Fetch enums
// //   useEffect(() => {
// //     axios.get("http://localhost:8080/api/enums/phase-statuses")
// //       .then(res => setPhaseStatuses(res.data))
// //       .catch(err => console.error(err));
// //   }, []);

// //   // Fetch phase types by renovation type
// //   useEffect(() => {
// //     if (renovationType) {
// //       axios
// //         .get(`http://localhost:8080/phase/phases/by-renovation-type/${renovationType}`)
// //         .then(res => setPhaseTypes(res.data))
// //         .catch(err => console.error(err));
// //     } else {
// //       setPhaseTypes([]);
// //     }
// //   }, [renovationType]);

// //   const handleChange = (e) => {
// //     setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
// //   };

// //   const handleSelectVendorClick = () => {
// //     if (!formData.phaseType) {
// //       alert("Please select a phase type first");
// //       return;
// //     }
// //     navigate(`/vendor-list?phaseType=${formData.phaseType}`, {
// //       state: { formData }
// //     });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     const payload = {
// //       vendor: { id: formData.vendor },
// //       room: { id: roomId },
// //       phaseName: formData.phaseName,
// //       description: formData.description,
// //       startDate: formData.startDate,
// //       endDate: formData.endDate,
// //       phaseType: formData.phaseType,
// //       phaseStatus: formData.phaseStatus,
// //     };

// //     axios.get(`http://localhost:8080/phase/phase/exists?roomId=${formData.room}&phaseType=${formData.phaseType}`)
// //       .then(res => {
// //         if (res.data) {
// //           alert("Phase of this type already exists for the room.");
// //         } else {
// //           createPhaseApi(payload)
// //             .then(() => navigate(`/phase/room/${formData.room}`))
// //             .catch(err => {
// //               console.error("Error creating phase:", err);
// //               alert("An error occurred while creating the phase.");
// //             });
// //         }
// //       })
// //       .catch(err => {
// //         console.error("Error checking existing phase:", err);
// //         alert("Could not verify existing phase.");
// //       });
// //   };

// //   return (
// //     <div className="min-h-screen bg-blue-50 flex justify-center items-center pt-23">
// //       <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl">
// //         <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">Create Phase</h2>

// //         <input name="phaseName" placeholder="Phase Name" value={formData.phaseName} onChange={handleChange}
// //           className="w-full px-4 py-2 border border-gray-300 rounded mb-3" />

// //         <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange}
// //           className="w-full px-4 py-2 border border-gray-300 rounded mb-3" />

// //         <input type="date" name="startDate" value={formData.startDate} onChange={handleChange}
// //           min={new Date().toISOString().split("T")[0]}
// //           className="w-full px-4 py-2 border border-gray-300 rounded mb-3 text-gray-500" />

// //         <input type="date" name="endDate" value={formData.endDate} onChange={handleChange}
// //           min={new Date().toISOString().split("T")[0]}
// //           className="w-full px-4 py-2 border border-gray-300 rounded mb-3 text-gray-500" />

// //         <select name="phaseType" value={formData.phaseType} onChange={handleChange}
// //           className="w-full px-4 py-2 border border-gray-300 rounded mb-3 bg-white">
// //           <option value="">-- Select Phase Type --</option>
// //           {phaseTypes.map((type) => (
// //             <option key={type} value={type}>{type.replaceAll("_", " ")}</option>
// //           ))}
// //         </select>

// //         <input type="text" name="vendorName" value={formData.vendorName || ""} disabled
// //           placeholder="Selected Vendor"
// //           className="w-full px-4 py-2 border border-gray-300 rounded mb-3 bg-gray-100 text-gray-700" />

// //         <button type="button" onClick={handleSelectVendorClick}
// //           className="w-full bg-green-600 text-white py-2 rounded mb-3 hover:bg-green-700">
// //           Choose Vendor From List
// //         </button>

// //         <select name="phaseStatus" value={formData.phaseStatus} onChange={handleChange}
// //           className="w-full px-4 py-2 border border-gray-300 rounded mb-5 bg-white">
// //           <option value="">-- Select Phase Status --</option>
// //           {phaseStatuses.map((status) => (
// //             <option key={status} value={status}>{status.replaceAll("_", " ")}</option>
// //           ))}
// //         </select>

// //         <button type="submit"
// //           className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">
// //           Create Phase
// //         </button>
// //       </form>
// //     </div>
// //   );
// // }

// // export default PhaseForm;


// import { useEffect, useState } from "react";
// import { useNavigate, useLocation, useParams } from "react-router-dom";
// import { createPhaseApi } from "../app/apis/phaseListAPIs";
// import axios from "axios";

// function PhaseForm() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { roomId } = useParams();

//   const [renovationType, setRenovationType] = useState('');
//   const [phaseTypes, setPhaseTypes] = useState([]);
//   const [phaseStatuses, setPhaseStatuses] = useState([]);
//   const [formData, setFormData] = useState({
//     phaseName: "",
//     description: "",
//     phaseType: "",
//     phaseStatus: "",
//     startDate: "",
//     endDate: "",
//     vendor: "",
//     vendorName: "",
//     room: ""
//   });

//   // ✅ Rehydrate formData if coming back from VendorListDisplay
//   useEffect(() => {
//     if (location.state?.formData) {
//       setFormData(location.state.formData);
//     }
//   }, [location.state]);

//   // ✅ Populate room and renovationType
//   useEffect(() => {
//     if (roomId) {
//       axios.get(`http://localhost:8080/rooms/${roomId}`)
//         .then(res => {
//           setRenovationType(res.data.renovationType);
//           setFormData(prev => ({ ...prev, room: roomId }));
//         })
//         .catch(err => console.error("Error fetching room:", err));
//     }
//   }, [roomId]);

//   // ✅ Extract selected vendor from URL
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const vendorId = params.get("vendorId");
//     const vendorName = params.get("vendorName");
//     if (vendorId && vendorName) {
//       setFormData(prev => ({
//         ...prev,
//         vendor: vendorId,
//         vendorName: decodeURIComponent(vendorName),
//       }));
//     }
//   }, [location.search]);

//   // ✅ Fetch enums
//   useEffect(() => {
//     axios.get("http://localhost:8080/api/enums/phase-statuses")
//       .then(res => setPhaseStatuses(res.data))
//       .catch(err => console.error(err));
//   }, []);

//   // ✅ Fetch phase types by renovationType
//   useEffect(() => {
//     if (renovationType) {
//       axios
//         .get(`http://localhost:8080/phase/phases/by-renovation-type/${renovationType}`)
//         .then(res => setPhaseTypes(res.data))
//         .catch(err => console.error(err));
//     } else {
//       setPhaseTypes([]);
//     }
//   }, [renovationType]);

//   const handleChange = (e) => {
//     setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSelectVendorClick = () => {
//     if (!formData.phaseType) {
//       alert("Please select a phase type first");
//       return;
//     }
//     navigate(`/vendor-list?phaseType=${formData.phaseType}`, {
//       state: { formData }
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const payload = {
//       vendor: { id: formData.vendor },
//       room: { id: roomId },
//       phaseName: formData.phaseName,
//       description: formData.description,
//       startDate: formData.startDate,
//       endDate: formData.endDate,
//       phaseType: formData.phaseType,
//       phaseStatus: formData.phaseStatus,
//     };

//     axios.get(`http://localhost:8080/phase/phase/exists?roomId=${formData.room}&phaseType=${formData.phaseType}`)
//       .then(res => {
//         if (res.data) {
//           alert("Phase of this type already exists for the room.");
//         } else {
//           createPhaseApi(payload)
//             .then(() => navigate(`/phase/room/${formData.room}`))
//             .catch(err => {
//               console.error("Error creating phase:", err);
//               alert("An error occurred while creating the phase.");
//             });
//         }
//       })
//       .catch(err => {
//         console.error("Error checking existing phase:", err);
//         alert("Could not verify existing phase.");
//       });
//   };

//   return (
//     <div className="min-h-screen bg-blue-50 flex justify-center items-center pt-23">
//       <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl">
//         <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">Create Phase</h2>

//         <input name="phaseName" placeholder="Phase Name" value={formData.phaseName} onChange={handleChange}
//           className="w-full px-4 py-2 border border-gray-300 rounded mb-3" />

//         <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange}
//           className="w-full px-4 py-2 border border-gray-300 rounded mb-3" />

//         <input type="date" name="startDate" value={formData.startDate} onChange={handleChange}
//           min={new Date().toISOString().split("T")[0]}
//           className="w-full px-4 py-2 border border-gray-300 rounded mb-3 text-gray-500" />

//         <input type="date" name="endDate" value={formData.endDate} onChange={handleChange}
//           min={new Date().toISOString().split("T")[0]}
//           className="w-full px-4 py-2 border border-gray-300 rounded mb-3 text-gray-500" />

//         <select name="phaseType" value={formData.phaseType} onChange={handleChange}
//           className="w-full px-4 py-2 border border-gray-300 rounded mb-3 bg-white">
//           <option value="">-- Select Phase Type --</option>
//           {phaseTypes.map((type) => (
//             <option key={type} value={type}>{type.replaceAll("_", " ")}</option>
//           ))}
//         </select>

//         <input type="text" name="vendorName" value={formData.vendorName || ""} disabled
//           placeholder="Selected Vendor"
//           className="w-full px-4 py-2 border border-gray-300 rounded mb-3 bg-gray-100 text-gray-700" />

//         <button type="button" onClick={handleSelectVendorClick}
//           className="w-full bg-green-600 text-white py-2 rounded mb-3 hover:bg-green-700">
//           Choose Vendor From List
//         </button>

//         <select name="phaseStatus" value={formData.phaseStatus} onChange={handleChange}
//           className="w-full px-4 py-2 border border-gray-300 rounded mb-5 bg-white">
//           <option value="">-- Select Phase Status --</option>
//           {phaseStatuses.map((status) => (
//             <option key={status} value={status}>{status.replaceAll("_", " ")}</option>
//           ))}
//         </select>

//         <button type="submit"
//           className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">
//           Create Phase
//         </button>
//       </form>
//     </div>
//   );
// }

// export default PhaseForm;



import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { createPhaseApi } from "../app/apis/phaseListAPIs";
import axios from "axios";

function PhaseForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomId } = useParams();

  const [renovationType, setRenovationType] = useState('');
  const [phaseTypes, setPhaseTypes] = useState([]);
  const [phaseStatuses, setPhaseStatuses] = useState([]);
  const [formData, setFormData] = useState({
    phaseName: "",
    description: "",
    phaseType: "",
    phaseStatus: "",
    startDate: "",
    endDate: "",
    vendor: "",
    vendorName: "",
    room: ""
  });

  const [reviewData, setReviewData] = useState({ comment: "", rating: 0 });
  const userId = "248cf7fd-7f0b-4cde-8b2f-bc73f26da083"; // Replace with Redux user later

  useEffect(() => {
    if (location.state?.formData) {
      setFormData(location.state.formData);
    }
  }, [location.state]);

  useEffect(() => {
    if (roomId) {
      axios.get(`http://localhost:8080/rooms/${roomId}`)
        .then(res => {
          setRenovationType(res.data.renovationType);
          setFormData(prev => ({ ...prev, room: roomId }));
        })
        .catch(err => console.error("Error fetching room:", err));
    }
  }, [roomId]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const vendorId = params.get("vendorId");
    const vendorName = params.get("vendorName");
    if (vendorId && vendorName) {
      setFormData(prev => ({
        ...prev,
        vendor: vendorId,
        vendorName: decodeURIComponent(vendorName),
      }));
    }
  }, [location.search]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/enums/phase-statuses")
      .then(res => setPhaseStatuses(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (renovationType) {
      axios
        .get(`http://localhost:8080/phase/phases/by-renovation-type/${renovationType}`)
        .then(res => setPhaseTypes(res.data))
        .catch(err => console.error(err));
    } else {
      setPhaseTypes([]);
    }
  }, [renovationType]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectVendorClick = () => {
    if (!formData.phaseType) {
      alert("Please select a phase type first");
      return;
    }
    navigate(`/vendor-list?phaseType=${formData.phaseType}`, {
      state: { formData }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      vendor: { id: formData.vendor },
      room: { id: roomId },
      phaseName: formData.phaseName,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      phaseType: formData.phaseType,
      phaseStatus: formData.phaseStatus,
    };

    try {
      const res = await axios.get(
        `http://localhost:8080/phase/phase/exists?roomId=${formData.room}&phaseType=${formData.phaseType}`
      );

      if (res.data) {
        alert("Phase of this type already exists for the room.");
      } else {
        await createPhaseApi(payload);

        if (
          formData.phaseStatus === "COMPLETED" &&
          formData.vendor &&
          reviewData.comment &&
          reviewData.rating > 0
        ) {
          const reviewPayload = {
            vendorId: formData.vendor,
            userId,
            comment: reviewData.comment,
            rating: Number(reviewData.rating),
          };

          await axios.post("http://localhost:8080/api/vendor-reviews/reviews", reviewPayload);
          alert("Review submitted!");
        }

        navigate(`/phase/room/${formData.room}`);
      }
    } catch (err) {
      console.error("Error creating phase or submitting review:", err);
      alert("An error occurred.");
    }
  };

  const handleIndependentReviewSubmit = async () => {
    if (!formData.vendor) {
      alert("Please select a vendor.");
      return;
    }

    if (!reviewData.comment || reviewData.rating === 0) {
      alert("Please provide a comment and rating.");
      return;
    }

    const reviewPayload = {
      vendorId: formData.vendor,
      userId,
      comment: reviewData.comment,
      rating: Number(reviewData.rating),
    };

    try {
      await axios.post("http://localhost:8080/api/vendor-reviews/reviews", reviewPayload);
      alert("Review submitted independently!");
      setReviewData({ comment: "", rating: 0 });
    } catch (err) {
      console.error("Error submitting independent review:", err);
      alert("Failed to submit review.");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex justify-center items-center pt-23">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">Create Phase</h2>

        <input name="phaseName" placeholder="Phase Name" value={formData.phaseName} onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3" />

        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3" />

        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange}
          min={new Date().toISOString().split("T")[0]}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3 text-gray-500" />

        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange}
          min={new Date().toISOString().split("T")[0]}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3 text-gray-500" />

        <select name="phaseType" value={formData.phaseType} onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3 bg-white">
          <option value="">-- Select Phase Type --</option>
          {phaseTypes.map((type) => (
            <option key={type} value={type}>{type.replaceAll("_", " ")}</option>
          ))}
        </select>

        <input type="text" name="vendorName" value={formData.vendorName || ""} disabled
          placeholder="Selected Vendor"
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3 bg-gray-100 text-gray-700" />

        <button type="button" onClick={handleSelectVendorClick}
          className="w-full bg-green-600 text-white py-2 rounded mb-3 hover:bg-green-700">
          Choose Vendor From List
        </button>

        <select name="phaseStatus" value={formData.phaseStatus} onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-5 bg-white">
          <option value="">-- Select Phase Status --</option>
          {phaseStatuses.map((status) => (
            <option key={status} value={status}>{status.replaceAll("_", " ")}</option>
          ))}
        </select>

        {/* ⭐ Review Section - Always visible if vendor selected */}
        {formData.phaseStatus === "COMPLETED" && formData.vendor &&(
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold text-blue-700 mb-3">Leave a Review</h3>

            <textarea
              className="w-full p-2 border border-gray-300 rounded mb-3"
              placeholder="Write your comment"
              value={reviewData.comment}
              onChange={(e) =>
                setReviewData((prev) => ({ ...prev, comment: e.target.value }))
              }
            />

            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    setReviewData((prev) => ({ ...prev, rating: star }))
                  }
                  className={`text-2xl ${
                    star <= reviewData.rating ? "text-yellow-400" : "text-gray-300"
                  } focus:outline-none`}
                >
                  ★
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {reviewData.rating > 0 ? `${reviewData.rating} Star${reviewData.rating > 1 ? "s" : ""}` : "No rating"}
              </span>
            </div>

            <button
              type="button"
              onClick={handleIndependentReviewSubmit}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Submit Review
            </button>
          </div>
        )}

        <button type="submit"
          className="w-full mt-6 bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">
          Create Phase
        </button>
      </form>
    </div>
  );
}

export default PhaseForm;
