
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";

function EditPhaseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [phaseData, setPhaseData] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    axiosInstance.get(`http://localhost:8080/phase/${id}`)
      .then((res) => {
        setPhaseData(res.data);
        console.log("res", res.data);
      })
      .catch((err) => console.error("Phase fetch error:", err));

    axiosInstance.get("http://localhost:8080/api/enums/phase-statuses")
      .then((res) => setStatuses(res.data));
  }, [id]);
  const validate = (formData) => {
    const newErrors = {};
    if (formData.phaseName == "") {
      newErrors.phaseName = "Please enter phase name";
    }
    if (formData.startDate == "") {
      newErrors.startDate = "Please enter start date";
    }
    if (formData.endDate == "") {
      newErrors.endDate = "Please enter end date";
    }
    if(new Date(formData.endDate)<new Date(formData.startDate)){
      newErrors.endDate="End date cannot be before start date";
    }
  
    return newErrors;
  };
  const handleChange = (e) => {
    setPhaseData({ ...phaseData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(phaseData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    axiosInstance.put(`http://localhost:8080/phase/${id}`, phaseData)
      .then(() => navigate(`/phase/${id}`))
      .catch((err) => {
        console.error("Phase update error:", err);
        alert("Failed to update phase.");
      });
  };

  if (!phaseData) return <p className="text-center mt-20 text-gray-600">Loading...</p>;

  return (
    <div className="bg-blue-50 p-80 pt-26 pb-8">
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
              />{errors.phaseName && (
                <p className="text-red-500 text-sm mb-3">{errors.phaseName}</p>
              )}
            </div>

            <div>
              <label className="font-semibold">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={phaseData.startDate || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              />{errors.startDate && (
                <p className="text-red-500 text-sm mb-3">{errors.startDate}</p>
              )}
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
              />{errors.endDate && (
                <p className="text-red-500 text-sm mb-3">{errors.endDate}</p>
              )}
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
      </div>
    </div>
  );
}

export default EditPhaseForm;