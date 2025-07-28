import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { createPhaseApi } from "../axios/phaseListAPIs";
import axiosInstance from "../axios/axiosInstance";

function PhaseForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { exposedId } = useParams();
  const [renovationType, setRenovationType] = useState('');
  const [phaseTypes, setPhaseTypes] = useState([]);
  const [errors, setErrors] = useState({});

  const [phaseStatuses, setPhaseStatuses] = useState([]);
  const [formData, setFormData] = useState({
    phaseName: "",
    description: "",
    phaseType: "",
    phaseStatus: "",
    startDate: "",
    endDate: "",
    vendorId: "",
    vendorName: "",
    room: ""
  });

  useEffect(() => {
    if (location.state?.formData) {
      setFormData(location.state.formData);
    }
  }, [location.state]);

  useEffect(() => {
    if (!exposedId) { console.log("no exposed"); return; }
    axiosInstance.get(`http://localhost:8080/rooms/${exposedId}`)
      .then(res => {
        console.log("full room response", res.data);
        const type = res.data.renovationType;
        if (type) {
          setRenovationType(type);
          setFormData(prev => ({ ...prev, room: exposedId }));
        } else {
          console.warn("No renovationType found in room data.");
        }
      })
      .catch(err => console.error("Error fetching room:", err));
  }, [exposedId]);

  const validate = () => {
    const newErrors = {};
    if (formData.phaseName == "") {
      newErrors.phaseName = "Please enter phase name";
    }
    if (formData.phaseStatus == "") {
      newErrors.phaseStatus = "Please select phase status";
    }
    if (formData.phaseType == "") {
      newErrors.phaseType = "Please select phase type";
    }
    if (formData.startDate == "") {
      newErrors.startDate = "Please enter start date";
    }
    if (formData.endDate == "") {
      newErrors.endDate = "Please enter end date";
    }
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = "End date cannot be before start date";
    }

    return newErrors;
  };
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const vendorId = params.get("vendorId");
    const vendorName = params.get("vendorName");
    if (vendorId && vendorName) {
      setFormData(prev => ({
        ...prev,
        vendorId: vendorId,
        vendorName: decodeURIComponent(vendorName),
      }));
    }
  }, [location.search]);

  useEffect(() => {
    axiosInstance.get("http://localhost:8080/api/enums/phase-statuses")
      .then(res => setPhaseStatuses(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {


    if (renovationType) {
      axiosInstance
        .get(`http://localhost:8080/phase/phases/by-renovation-type/${renovationType}`)
        .then(res => {

          setPhaseTypes(res.data);
        })


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

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const payload = {
      vendorId: formData.vendorId,
      roomId: exposedId,
      phaseName: formData.phaseName,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      phaseType: formData.phaseType,
      phaseStatus: formData.phaseStatus,
    };

    try {
      const res = await axiosInstance.get(
        `http://localhost:8080/phase/phase/exists?roomId=${exposedId}&phaseType=${formData.phaseType}`
      );

      if (res.data) {
        alert("Phase of this type already exists for the room.");
      } else {
        await createPhaseApi(payload);

        navigate(`/phase/room/${exposedId}`);
      }
    } catch (err) {
      console.error("Error creating phase", err);
      alert("An error occurred.");
    }
  };



  return (
    <div className="min-h-screen bg-blue-50 flex justify-center items-center pt-23">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">Create Phase</h2>

        <input name="phaseName" placeholder="Phase Name" value={formData.phaseName} onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3" />
        {errors.phaseName && (
          <p className="text-red-500 text-sm mb-3">{errors.phaseName}</p>
        )}


        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3" />

        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange}
          min={new Date().toISOString().split("T")[0]}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3 text-gray-500" />
        {errors.startDate && (
          <p className="text-red-500 text-sm mb-3">{errors.startDate}</p>
        )}
        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange}
          min={new Date().toISOString().split("T")[0]}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3 text-gray-500" />
        {errors.endDate && (
          <p className="text-red-500 text-sm mb-3">{errors.endDate}</p>
        )}
        <select name="phaseType" value={formData.phaseType} onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3 bg-white">
          <option value="">-- Select Phase Type --</option>
          {phaseTypes.map((type) => (
            <option key={type} value={type}>{type.replaceAll("_", " ")}</option>
          ))}
        </select>
        {errors.phaseType && (
          <p className="text-red-500 text-sm mb-3">{errors.phaseType}</p>
        )}

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
          {phaseStatuses
            .filter((status) => status !== "COMPLETED")
            .map((status) => (
              <option key={status} value={status}>
                {status.replaceAll("_", " ")}
              </option>

            ))}
        </select>
        {errors.phaseStatus && (
          <p className="text-red-500 text-sm mb-3">{errors.phaseStatus}</p>
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