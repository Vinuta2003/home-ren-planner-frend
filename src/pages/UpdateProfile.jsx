import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axiosInstance from "../axios/axiosInstance";

export default function UpdateProfile() {
  const { email, role, accessToken } = useSelector((state) => state.auth);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [experience, setExperience] = useState("");
  const [available, setAvailable] = useState(true);
  const [skills, setSkills] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/auth/getProfile");
        const data = res.data;
        console.log(data)
        setName(data.name || "");
        setContact(data.contact || "");
        setCompanyName(data.companyName || "");
        setExperience(data.experience !== undefined && data.experience !== null ? String(data.experience) : "");
        setAvailable(data.available ?? true);
        setSkills(data.skills || []);
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

  const handleImageClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSkillPriceChange = (index, value) => {
    const updatedSkills = [...skills];
    updatedSkills[index].basePrice = value === "" ? 0 : parseFloat(value);
    setSkills(updatedSkills);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);

    // Password confirmation check
    if (newPassword && newPassword !== confirmNewPassword) {
      toast.error("New password and confirm password do not match.");
      setSubmitting(false);
      return;
    }

    const submitData = new FormData();
    submitData.append("email", email);

    if (name !== undefined && name !== null && name !== "") submitData.append("name", name);
    if (contact !== undefined && contact !== null && contact !== "") submitData.append("contact", contact);
    if (newPassword !== undefined && newPassword !== null && newPassword !== "") submitData.append("newPassword", newPassword);

    if (role === "VENDOR") {
      if (companyName !== undefined && companyName !== null && companyName !== "") submitData.append("companyName", companyName);
      if (experience !== undefined && experience !== null && experience !== "") submitData.append("experience", experience);
      submitData.append("available", String(available));
      skills.forEach((skill, index) => {
        if (skill.skillName !== undefined && skill.skillName !== null && skill.skillName !== "")
          submitData.append(`skills[${index}].skillName`, skill.skillName);
        if (skill.basePrice !== undefined && skill.basePrice !== null && skill.basePrice !== "")
          submitData.append(`skills[${index}].basePrice`, skill.basePrice);
      });
    }
    if (profileImage instanceof File) {
      console.log("Setting profile image")
      submitData.append("profileImage", profileImage);
    }
    try {
      await axiosInstance.post("/auth/updateProfile", submitData);
      toast.success("Profile updated successfully.");
      setLoading(true);
      const res = await axiosInstance.get("/auth/getProfile");
      setImagePreview(res.data.url || null);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to update. Please try again.");
      console.error("Update failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 ">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-blue-700 font-semibold">Loading profile...</span>
      </div>
    );

  return (
    <form
      encType="multipart/form-data"
      onSubmit={handleSubmit}
      className="p-8 bg-white max-w-2xl mx-auto my-10 rounded-2xl shadow-xl border border-blue-200 mt-30"
    >
      <h2 className="text-4xl font-sans font-medium text-blue-900 mb-10 text-center tracking-tight drop-shadow-sm">
        Update Profile
      </h2>
      {/* Profile Image */}
      <div className="mb-10  py-4 flex flex-col items-center bg-blue-50 rounded-xl shadow-sm">
        <label className="block font-semibold text-blue-700 mb-3 text-lg">Profile Image</label>
        <div className="relative group cursor-pointer" onClick={handleImageClick}>
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-200 bg-blue-100 flex items-center justify-center shadow-lg transition group-hover:scale-105 group-hover:border-blue-400">
            <img
              src={imagePreview}
              alt="Profile"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-blue-900 bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
              <span className="text-blue-100 font-semibold text-sm tracking-wide">Change</span>
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
      </div>
      {/* Email (readonly) */}
      <div className="mb-8 bg-blue-50 rounded-lg p-4 border border-blue-100">
        <label className="block font-semibold text-blue-700 mb-1">Email</label>
        <input
          type="email"
          value={email || ""}
          readOnly
          className="w-full px-4 py-2 border border-blue-200 bg-blue-100 rounded-lg text-blue-900 focus:outline-none"
        />
      </div>
      {/* Common Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 border-b pb-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
        <div>
          <label className="block font-semibold text-blue-700 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-blue-900"
            placeholder="Enter name"
          />
        </div>
        <div>
          <label className="block font-semibold text-blue-700 mb-1">Contact</label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-blue-900"
            placeholder="Enter contact"
          />
        </div>
        <div>
          <label className="block font-semibold text-blue-700 mb-1">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-blue-900"
            placeholder="Enter new password"
          />
        </div>
        <div>
          <label className="block font-semibold text-blue-700 mb-1">Confirm New Password</label>
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-blue-900"
            placeholder="Confirm new password"
            disabled={!newPassword}
          />
        </div>

      </div>
      {/* Vendor-Only Fields */}
      {role === "VENDOR" && (
        <>
          {/* Company Name & Experience & Availability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4 bg-blue-50 rounded-xl p-6 border border-blue-100">
            <div>
              <label className="block font-semibold text-blue-700 mb-1">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-blue-900"
                placeholder="Enter company name"
              />
            </div>
            <div>
              <label className="block font-semibold text-blue-700 mb-1">Experience (years)</label>
              <input
                type="number"
                min={0}
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-blue-900"
                placeholder="Enter experience in years"
              />
            </div>
          </div>
          <div className="mb-10 bg-blue-50 rounded-xl p-6 border border-blue-100">
            <label className="block font-semibold text-blue-700 mb-1">Available for work</label>
            <select
              value={available === true ? "true" : "false"}
              onChange={(e) => setAvailable(e.target.value === "true")}
              className="px-4 w-full py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-blue-900"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          {/* Skills (readonly skillName, editable basePrice) */}
          {skills && skills.length > 0 && (
            <div className="mb-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
              <label className="block font-semibold text-blue-700 mb-2">Skills & Pricing</label>
              <div className="space-y-4 mt-6">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center flex justify-center gap-4">
                    <input
                      type="text"
                      value={skill.skillName}
                      readOnly
                      className="w-1/2 px-4 py-2 border border-blue-200 bg-blue-100 rounded-lg text-blue-900"
                    />
                    <div className="relative w-1/3">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 text-lg pointer-events-none">₹</span>
                      <input
                        type="number"
                        min={0}
                        value={skill.basePrice === 0 ? "" : skill.basePrice}
                        onChange={(e) => handleSkillPriceChange(index, e.target.value)}
                        className="pl-8 pr-2 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full bg-white text-blue-900"
                        placeholder="Base Price"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      <div className="mt-10 flex justify-center">
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-700 focus:ring-4 focus:ring-blue-200 focus:outline-none cursor-pointer text-white px-10 py-4 rounded-xl shadow-xl font-bold text-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed border border-blue-400"
          disabled={submitting}
        >
          {submitting && (
            <span className="animate-spin h-5 w-5 border-b-2 border-white rounded-full inline-block"></span>
          )}
          SUBMIT
        </button>
      </div>
    </form>
  );
}
