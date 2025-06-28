import { useState } from "react";
import { toast } from "react-toastify";

export default function RegisterForm() {
  const [isVendor, setIsVendor] = useState(false);
  const [skills, setSkills] = useState([{ skillName: "", basePrice: "" }]);
  const [available, setAvailable] = useState(false);

  const handleSkillChange = (index, field, value) => {
    const updatedSkills = [...skills];
    updatedSkills[index][field] = value;
    setSkills(updatedSkills);
  };

  const addSkill = () => {
    setSkills([...skills, { skillName: "", basePrice: "" }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const formData = Object.fromEntries(data.entries());

    const payload = {
      ...formData,
      role: isVendor ? "VENDOR" : "CUSTOMER",
      skills: isVendor ? skills : [],
    };

    console.log("Submitted payload:", payload);
    
    // Show success toast notification
    toast.success(`Registration successful! Welcome ${formData.name}!`);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex justify-center items-center py-5">
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
              !isVendor ? "bg-blue-600 text-white hover:bg-blue-700 transition" : "bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
            }`}
            
          >
            Register as Customer
          </button>
          <button
            type="button"
            onClick={() => setIsVendor(true)}
            className={`w-[48%] py-2 font-semibold rounded hover:cursor-pointer ${
              isVendor ? "bg-blue-600 text-white hover:bg-blue-700 transition" : "bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
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
              placeholder="Experience"
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
            {skills.map((skill, index) => (
              <div key={index} className="flex gap-2 mt-2">
                <select
                  value={skill.skillName}
                  required
                  onChange={(e) =>
                    handleSkillChange(index, "skillName", e.target.value)
                  }
                  className="w-1/2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select Skill --</option>
                  <option value="PLUMBING">Plumbing</option>
                  <option value="ELECTRICAL">Electrical</option>
                  <option value="PAINTING">Painting</option>
                  <option value="CARPENTRY">Carpentry</option>
                  <option value="FLOORING">Flooring</option>
                  <option value="TILING">Tiling</option>
                  <option value="ROOFING">Roofing</option>
                  <option value="HVAC">HVAC</option>
                  <option value="INTERIOR_DESIGN">Interior Design</option>
                  <option value="MASONRY">Masonry</option>
                  <option value="WATERPROOFING">Waterproofing</option>
                  <option value="LANDSCAPING">Landscaping</option>
                  <option value="GLASS_WORK">Glass Work</option>
                  <option value="FALSE_CEILING">False Ceiling</option>
                  <option value="MODULAR_KITCHEN">Modular Kitchen</option>
                  <option value="SECURITY_SYSTEMS">Security Systems</option>
                  <option value="SMART_HOME_SETUP">Smart Home Setup</option>
                  <option value="CLEANING_SERVICES">Cleaning Services</option>
                  <option value="DEMOLITION">Demolition</option>
                  <option value="PEST_CONTROL">Pest Control</option>
                </select>
                <input
                  type="number"
                  placeholder="Base Price"
                  value={skill.basePrice}
                  disabled={!skill.skillName}
                  required
                  onChange={(e) =>
                    handleSkillChange(index, "basePrice", e.target.value)
                  }
                  className="w-1/2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
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
      </form>
    </div>
  );
}
