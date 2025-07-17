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
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { createPhaseApi } from "../app/apis/phaseListAPIs";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from 'react-redux';




function PhaseForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomId } = useParams();
  const userId = "f04e8c60-eb5e-47bb-9766-966e3905219d";
  const [vendorName, setVendorName] = useState("");
  const [renovationType, setRenovationType] = useState("");
  const [phaseTypes, setPhaseTypes] = useState([]);
  const [phaseStatuses, setPhaseStatuses] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({ comment: "", rating: 0 });
console.log("user id is",userId);

  const [formData, setFormData] = useState({
    phaseName: "",
    description: "",
    phaseType: "",
    phaseStatus: "",
    startDate: "",
    endDate: "",
    vendor: "",
    project: "",
    room: ""
  });

  // Set formData and renovationType
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const vendorId = params.get("vendorId");
    const savedForm = location.state?.formData;
    const passedVendorName = location.state?.vendorName;

    if (savedForm) {
      setFormData(prev => ({ ...prev, ...savedForm, vendor: vendorId || savedForm.vendor || "" }));
      setRenovationType(savedForm.selectedRenovationType || "");
      if (passedVendorName) setVendorName(passedVendorName);
    } else {
      if (vendorId) setFormData(prev => ({ ...prev, vendor: vendorId }));
      if (roomId) {
        setFormData(prev => ({ ...prev, room: roomId }));
        axios.get(`http://localhost:8080/rooms/${roomId}`)
          .then(res => setRenovationType(res.data.renovationType))
          .catch(err => console.error("Error fetching room:", err));
      }
    }
  }, [location, roomId]);

  // Phase statuses
  useEffect(() => {
    axios.get("http://localhost:8080/api/enums/phase-statuses")
      .then(res => setPhaseStatuses(res.data))
      .catch(err => console.error(err));
  }, []);

  // Phase types based on renovationType
  useEffect(() => {
    if (renovationType) {
      axios.get(`http://localhost:8080/phase/phases/by-renovation-type/${renovationType}`)
        .then(res => setPhaseTypes(res.data))
        .catch(err => console.error(err));
    } else {
      setPhaseTypes([]);
    }
  }, [renovationType]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === "phaseStatus" && value === "COMPLETED") {
        setShowReviewModal(true);
      }
      return updated;
    });
  };

  const handleSelectVendorClick = () => {
    if (!formData.phaseType) {
      toast.error("Please select a phase type first");
      return;
    }
    navigate(`/vendor-list?phaseType=${formData.phaseType}`, {
      state: { formData }
    });
    navigate(`/vendor-list?phaseType=${formData.phaseType}`, {
      state: { formData }
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    e.preventDefault();

    const payload = {
      vendor: { id: formData.vendor },
      phaseName: formData.phaseName,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      phaseType: formData.phaseType,
      phaseStatus: formData.phaseStatus,
    };

    if (formData.project) payload.project = { id: formData.project };
    if (formData.room) payload.room = { id: formData.room };

    const checkPhaseExistsUrl = formData.room
      ? `http://localhost:8080/phase/phase/exists?roomId=${formData.room}&phaseType=${formData.phaseType}`
      : null;

    if (checkPhaseExistsUrl) {
      axios.get(checkPhaseExistsUrl)
        .then(res => {
          if (res.data) {
            toast.error("Phase of this type already exists for the room.");
          } else {
            createPhaseApi(payload)
              .then(() => {
                toast.success("Phase created successfully!");
                navigate(`/phase/room/${formData.room}`);
              })
              .catch(err => {
                console.error("Error creating phase:", err);
                toast.error("Failed to create phase");
              });
          }
        })
        .catch(err => {
          console.error("Error checking existing phase:", err);
          toast.error("Could not verify existing phase.");
        });
    } else {
      createPhaseApi(payload)
        .then(() => {
          toast.success("Phase created successfully!");
          navigate(`/phase/project/${formData.project}`);
        })
        .catch(err => {
          console.error("Error creating phase:", err);
          toast.error("Failed to create phase");
        });
    }
  };

  const handleSubmitReview = () => {
    const reviewPayload = {
      vendorId: formData.vendor,
      userId,
      comment: reviewData.comment,
      rating: Number(reviewData.rating),
    };

    toast.promise(
      axios.post("http://localhost:8080/api/vendor-reviews/reviews", reviewPayload),
      {
        loading: "Submitting review...",
        success: "Review submitted!",
        error: "Failed to submit review",
      }
    ).then(() => setShowReviewModal(false));
  };

  return (
    <div className="min-h-screen bg-blue-50 flex justify-center items-center pt-20">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">Create Phase</h2>

        <input type="text" name="phaseName" placeholder="Phase Name"
          value={formData.phaseName} onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3" />

        <textarea name="description" placeholder="Description"
          value={formData.description} onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3" />

        <input type="date" name="startDate" value={formData.startDate}
          onChange={handleChange} min={new Date().toISOString().split("T")[0]}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3 text-gray-500" />

        <input type="date" name="endDate" value={formData.endDate}
          onChange={handleChange} min={new Date().toISOString().split("T")[0]}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3 text-gray-500" />

        {formData.project && (
          <input type="text" name="project" placeholder="Project ID"
            value={formData.project} onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded mb-3" />
        )}

        <select name="phaseType" value={formData.phaseType} onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3 bg-white">
          <option value="">-- Select Phase Type --</option>
          {phaseTypes.map((type) => (
            <option key={type} value={type}>{type.replaceAll("_", " ")}</option>
          ))}
        </select>

        {/* Vendor display */}
        <div className="mb-3">
          <label className="block text-gray-600 text-sm mb-1">Selected Vendor</label>
          <input
            type="text"
            value={vendorName || formData.vendor || "No vendor selected"}
            disabled
            className="w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded"
          />
        </div>

        <button type="button" onClick={handleSelectVendorClick}
          className="w-full bg-green-600 text-white py-2 rounded mb-3 hover:bg-green-700">
          Choose Vendor From List
        </button>

        <select name="phaseStatus" value={formData.phaseStatus} onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-5 bg-white">
        <select name="phaseStatus" value={formData.phaseStatus} onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-5 bg-white">
          <option value="">-- Select Phase Status --</option>
          {phaseStatuses.map((status) => (
            <option key={status} value={status}>{status.replaceAll("_", " ")}</option>
          ))}
        </select>

        <button type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">
          Create Phase
        </button>
      </form>

      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-700">Leave a Review</h2>

            <textarea
              name="comment"
              placeholder="Your comment"
              value={reviewData.comment}
              onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
              className="w-full p-2 border rounded mb-3"
            />

            <select
              name="rating"
              value={reviewData.rating}
              onChange={(e) => setReviewData({ ...reviewData, rating: e.target.value })}
              className="w-full p-2 border rounded mb-4"
            >
              <option value={0}>-- Select Rating --</option>
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>{r} Star{r > 1 ? "s" : ""}</option>
              ))}
            </select>

            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowReviewModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
              <button onClick={handleSubmitReview} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Submit Review</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PhaseForm;
