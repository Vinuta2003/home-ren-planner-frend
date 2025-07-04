import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createPhaseApi } from "../app/apis/phaseListAPIs";
import axios from "axios";

function PhaseForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedRenovationType, setSelectedRenovationType] = useState('');
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
    project: ""
  });

  useEffect(() => {
    axios.get("http://localhost:8080/api/enums/phase-statuses")
      .then(res => setPhaseStatuses(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedRenovationType) {
      axios
        .get(`http://localhost:8080/phase/phases/by-renovation-type/${selectedRenovationType}`)
        .then(res => setPhaseTypes(res.data))
        .catch(err => console.error(err));
    } else {
      setPhaseTypes([]);
    }
  }, [selectedRenovationType]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      vendor: { id: formData.vendor },
      project: { id: formData.project },
      phaseName: formData.phaseName,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      phaseType: formData.phaseType,
      phaseStatus: formData.phaseStatus,
    };
console.log("Payload:", payload);

    createPhaseApi(payload)
      .then(() => navigate(`/phase/project/${formData.project}`))
      .catch((err) => console.error("Error creating phase:", err));
  };

  return (
    <div className="min-h-screen bg-blue-50 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">Create Phase</h2>

        <input
          type="text"
          name="phaseName"
          placeholder="Phase Name"
          value={formData.phaseName}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3"
        />

        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          min={new Date().toISOString().split("T")[0]}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3 text-gray-500"
        />

        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          min={new Date().toISOString().split("T")[0]}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3 text-gray-500"
        />

<input
          type="text"
          name="project"
          placeholder="Project ID"
          value={formData.project}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3"
        />
        <input
          type="text"
          name="vendor"
          placeholder="Vendor ID"
          value={formData.vendor}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3"
        />

        <select
          value={selectedRenovationType}
          onChange={(e) => setSelectedRenovationType(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3 bg-white"
        >
          <option value="">-- Select Renovation Type --</option>
          <option value="KITCHEN_RENOVATION">Kitchen Renovation</option>
          <option value="BATHROOM_RENOVATION">Bathroom Renovation</option>
          <option value="BEDROOM_RENOVATION">Bedroom Renovation</option>
        </select>

        <select
          name="phaseType"
          value={formData.phaseType}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3 bg-white"
        >
          <option value="">-- Select Phase Type --</option>
          {phaseTypes.map((type) => (
            <option key={type} value={type}>{type.replaceAll("_", " ")}</option>
          ))}
        </select>

        <select
          name="phaseStatus"
          value={formData.phaseStatus}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-5 bg-white"
        >
          <option value="">-- Select Phase Status --</option>
          {phaseStatuses.map((status) => (
            <option key={status} value={status}>{status.replaceAll("_", " ")}</option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
        >
          Create Phase
        </button>
      </form>
    </div>
  );
}

export default PhaseForm;
