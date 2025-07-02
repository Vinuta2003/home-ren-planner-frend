import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
//import axiosInstance from "../axios/axiosInstance";
import axios from "axios";

export default function UpdateProfile() {
  const { email, role, accessToken } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:8080/auth/getProfile");
        const data = res.data;
       // console.log(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          contact: data.contact || "",
          url: data.url || "",
          profileImage: null,
          newPassword: "",
          companyName: data.companyName || "",
          experience: data.experience !== undefined && data.experience !== null ? String(data.experience) : "",
          available: data.available ?? true,
          skills: data.skills || [],
        });
        setImagePreview(data.url || null);
      } catch (err) {
        setError("Error fetching profile");
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [email, role, accessToken]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setMessage("");
    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    handleChange("profileImage", file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);
  
    const submitData = new FormData();
    submitData.append("email", email);
    // Append all fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "skills" && Array.isArray(value) && value.length > 0) {
        value.forEach((skill, index) => {
          if (skill.skillName) submitData.append(`skills[${index}].skillName`, skill.skillName);
          if (skill.basePrice !== undefined && skill.basePrice !== null) submitData.append(`skills[${index}].basePrice`, skill.basePrice);
        });
      } else if (key === "profileImage" && value instanceof File) {
        submitData.append("profileImage", value);
      } else if (key !== "profileImage" && value !== undefined && value !== null && value !== "") {
        submitData.append(key, value);
      }
    });
    // Debug: print FormData entries
    for (let pair of submitData.entries()) {
      console.log(pair[0]+ ': ' + pair[1]);
    }
    try {
      await axios.post("http://localhost:8080/auth/updateProfile", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`
        },
      });
      setMessage("Profile updated successfully.");
      // Refetch profile to update image preview
      setLoading(true);
      const res = await axiosInstance.get("/auth/getProfile");
      setImagePreview(res.data.url || null);
      setLoading(false);
    } catch (err) {
      setError("Failed to update. Please try again.");
      console.error("Update failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span className="ml-4 text-blue-700 font-semibold">Loading profile...</span>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-white max-w-2xl mx-auto mt-10 rounded-xl shadow-lg border border-blue-100">
      <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center tracking-tight">Update Profile</h2>
      {message && <div className="mb-4 p-2 bg-green-100 text-green-800 rounded text-center">{message}</div>}
      {error && <div className="mb-4 p-2 bg-red-100 text-red-800 rounded text-center">{error}</div>}
      {/* Profile Image */}
      <div className="mb-8 border-b pb-6">
        <label className="block font-semibold text-blue-900 mb-2 text-lg">Profile Image</label>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-200 bg-gray-50 flex items-center justify-center">
            <img
              src={imagePreview || "https://ui-avatars.com/api/?name=User&background=E0E7FF&color=1E3A8A&size=100"}
              alt="Profile"
              className="object-cover w-full h-full"
            />
          </div>
          <input type="file" accept="image/*" onChange={handleImageChange} className="block text-sm" />
        </div>
      </div>
      {/* Email (readonly) */}
      <div className="mb-6">
        <label className="block font-semibold text-blue-900 mb-1">Email</label>
        <input
          type="email"
          value={formData.email || ""}
          readOnly
          className="w-full px-4 py-2 border bg-gray-100 rounded-lg text-gray-700"
        />
      </div>
      {/* Common Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-b pb-6">
        {["name", "contact", "newPassword"].map((field) => (
          <div key={field}>
            <label className="block font-semibold text-blue-900 mb-1 capitalize">
              {field === "newPassword" ? "New Password" : field}
            </label>
            <input
              type={field === "newPassword" ? "password" : "text"}
              value={formData[field] || ""}
              onChange={(e) => handleChange(field, e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Enter ${field === "newPassword" ? "new password" : field}`}
            />
          </div>
        ))}
      </div>
      {/* Vendor-Only Fields */}
      {role === "VENDOR" && (
        <>
          {/* Company Name & Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-b pb-6">
            {["companyName", "experience"].map((field) => (
              <div key={field}>
                <label className="block font-semibold text-blue-900 mb-1 capitalize">
                  {field === "companyName" ? "Company Name" : "Experience (years)"}
                </label>
                <input
                  type={field === "experience" ? "number" : "text"}
                  min={field === "experience" ? 0 : undefined}
                  value={formData[field] || ""}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter ${field === "companyName" ? "company name" : "experience in years"}`}
                />
              </div>
            ))}
          </div>
          {/* Availability */}
          <div className="mb-8 border-b pb-6">
            <label className="block font-semibold text-blue-900 mb-1">Available</label>
            <select
              value={formData.available === true ? "true" : "false"}
              onChange={(e) => handleChange("available", e.target.value === "true")}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          {/* Skills (readonly skillName, editable basePrice) */}
          {formData.skills && (
            <div className="mb-4">
              <label className="block font-semibold text-blue-900 mb-2">Skills & Pricing</label>
              <div className="space-y-3">
                {formData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <input
                      type="text"
                      value={skill.skillName}
                      readOnly
                      className="w-1/2 px-4 py-2 border bg-gray-100 rounded-lg text-gray-700"
                    />
                    <input
                      type="number"
                      min={0}
                      value={skill.basePrice === 0 ? "" : skill.basePrice}
                      onChange={(e) => {
                        const val = e.target.value;
                        const newPrice = val === "" ? 0 : parseFloat(val);
                        const updatedSkills = [...formData.skills];
                        updatedSkills[index].basePrice = newPrice;
                        handleChange("skills", updatedSkills);
                      }}
                      className="w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Base Price"
                    />
                    <span className="text-sm text-blue-800">₹</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      <div className="mt-8 flex justify-center">
        <button
          type="submit"
          className="bg-blue-700 text-white px-8 py-3 rounded-lg shadow font-semibold text-lg hover:bg-blue-800 transition flex items-center gap-2 disabled:opacity-60"
          disabled={submitting}
        >
          {submitting && <span className="animate-spin h-5 w-5 border-b-2 border-white rounded-full inline-block"></span>}
          SUBMIT
        </button>
      </div>
    </form>
  );
}
