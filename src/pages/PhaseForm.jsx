import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";

function PhaseForm() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [selectedRenovationType, setSelectedRenovationType] = useState('');
  const [phaseTypes, setPhaseTypes] = useState([]);
  const [phaseStatuses, setPhaseStatuses] = useState([]);

  const [formData, setFormData] = useState({
    phaseName: "",
    description: "",
    phaseType: "",
    phaseStatus: "",
    start_date: "",
    end_date: "",
    vendor: "",
    project: projectId || ""
  });

  useEffect(() => {
    axiosInstance.get("/api/enums/phase-statuses")
      .then(res => setPhaseStatuses(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedRenovationType) {
      axiosInstance
        .get(`/phase/phases/by-renovation-type/${selectedRenovationType}`)
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
      project: { id: projectId },
      phaseName: formData.phaseName,
      description: formData.description,
      startDate: formData.start_date,
      endDate: formData.end_date,
      phaseType: formData.phaseType,
      phaseStatus: formData.phaseStatus,
    };

    axiosInstance.post("/phase", payload)
      .then(() => navigate(`/project/${projectId}`))
      .catch(err => console.error("Error:", err));
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
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="date"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

      <label>Project ID:</label>
      <input type="text" name="project" value={formData.project} onChange={handleChange} /><br />
      
        <input
          type="text"
          name="vendor"
          placeholder="Vendor ID"
          value={formData.vendor}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={selectedRenovationType}
          onChange={(e) => setSelectedRenovationType(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full px-4 py-2 border border-gray-300 rounded mb-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Select Phase Status --</option>
          {phaseStatuses.map((status) => (
            <option key={status} value={status}>{status.replaceAll("_", " ")}</option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition hover:cursor-pointer"
        >
          Create Phase
        </button>
      </form>
    </div>
  );
}

export default PhaseForm;
