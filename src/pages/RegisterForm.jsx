import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../axios/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [isVendor, setIsVendor] = useState(false);
  const [skills, setSkills] = useState([]);
  const [available, setAvailable] = useState(false);

  const allSkillOptions = [
    { value: "PLUMBING", label: "Plumbing" },
    { value: "ELECTRICAL", label: "Electrical" },
    { value: "PAINTING", label: "Painting" },
    { value: "CARPENTRY", label: "Carpentry" },
    { value: "TILING", label: "Flooring" },
    { value: "CIVIL", label: "Tiling" },
  ];
  const [skillError, setSkillError] = useState("");

  useEffect(() => {
    console.log("Auth State in Register Form", authState);
  }, [authState]);

  const handleSkillChange = (index, field, value) => {
    const updatedSkills = [...skills];
    updatedSkills[index][field] = value;
    setSkills(updatedSkills);
  };

  const addSkill = () => {
    setSkills([...skills, { skillName: "", basePrice: "" }]);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setSkillError("");
      const data = new FormData(e.target);
      const formData = Object.fromEntries(data.entries());

      const payload = {
        ...formData,
        role: isVendor ? "VENDOR" : "CUSTOMER",
      };

      if (isVendor) {
        if (skills.length === 0) {
          setSkillError("Please add at least one skill.");
          return;
        }
        payload.skills = skills.map((skill) => ({
          skillName: skill.skillName,
          basePrice: Number(skill.basePrice),
        }));
        payload.available = available;
      }

      console.log("Submitted payload:", payload);
      const response = await axiosInstance.post("/auth/register", payload);

      const responseData = response.data;

      console.log("Response from Server : ", responseData);

      if (responseData) {
        dispatch(
          login({
            email: responseData?.email,
            role: responseData?.role,
            accessToken: responseData?.accessToken,
          })
        );
      }

      if (responseData?.message === "SUCCESS") {
        e.target.reset();
        setSkills([]);
        setAvailable(false);
        setIsVendor(false);
        toast.success("Registration Successful", {
          onClose: () => {
            if (responseData?.role === "VENDOR") navigate("/vendor-dashboard");
            else navigate("/");
          },
          autoClose: 3000,
        });
      } else toast.message("Registration Unsuccessful!");
    } catch (e) {
      if (e.response && e.response.data) {
        console.log("Error Response", e.response.data);
        toast.error(e.response.data.message || "Registration Unsuccessful!");
      } else {
        toast.error("Registration Unsuccessful!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex justify-center items-center pb-10 pt-30">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-blue-600 text-center">
          Register
        </h2>

        {/* Common Fields */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          minLength={4}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
          title="Please enter a valid email address"
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          minLength={8}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact"
          required
          maxLength={10}
          minLength={10}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Role Selection */}
        <div className="flex justify-between my-4">
          <button
            type="button"
            onClick={() => setIsVendor(false)}
            className={`w-[48%] py-2 font-semibold rounded hover:cursor-pointer ${
              !isVendor
                ? "bg-blue-600 text-white hover:bg-blue-700 transition"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
            }`}
          >
            Register as Customer
          </button>
          <button
            type="button"
            onClick={() => setIsVendor(true)}
            className={`w-[48%] py-2 font-semibold rounded hover:cursor-pointer ${
              isVendor
                ? "bg-blue-600 text-white hover:bg-blue-700 transition"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
            }`}
          >
            Register as Vendor
          </button>
        </div>

        {/* Vendor Fields */}
        {isVendor && (
          <>
            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="experience"
              placeholder="Experience in Years"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="flex items-center space-x-3 mb-4">
              <input
                type="checkbox"
                name="available"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
                className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500 hover:cursor-pointer"
              />
              <span className="font-medium text-gray-600">Available</span>
            </label>

            <label className="block mt-4 font-semibold text-blue-600">
              Skills & Base Prices:
            </label>
            {skills.map((skill, index) => {
              // Exclude already selected skills except for the current one
              const selectedSkills = skills.map(s => s.skillName).filter((_, i) => i !== index);
              const availableOptions = allSkillOptions.filter(opt => !selectedSkills.includes(opt.value));
              return (
                <div key={index} className="flex gap-2 mt-2">
                  <select
                    value={skill.skillName}
                    required
                    onChange={e => handleSkillChange(index, "skillName", e.target.value)}
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Select Skill --</option>
                    {availableOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Base Price"
                    value={skill.basePrice}
                    disabled={!skill.skillName}
                    required
                    onChange={e => handleSkillChange(index, "basePrice", e.target.value)}
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              );
            })}
            {skillError && <div className="text-red-600 text-sm mt-2">{skillError}</div>}
            <button
              type="button"
              onClick={addSkill}
              className="text-blue-600 mt-2 text-sm font-medium hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-md transition-colors duration-200 border border-blue-200 hover:border-blue-300 hover:cursor-pointer"
            >
              + Add Skill
            </button>
          </>
        )}

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition hover:cursor-pointer"
        >
          Submit
        </button>
        <div className="mt-6 text-center text-blue-900 text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 font-semibold hover:underline">Login here</a>
        </div>
      </form>
    </div>
  );
}
