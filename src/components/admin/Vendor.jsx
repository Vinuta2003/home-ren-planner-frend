import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle2, XCircle, Trash2 } from "lucide-react";
import axiosInstance from "../../axios/axiosInstance";

export default function Vendor() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get("/admin/vendors");
      setVendors(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch vendors.");
    }
    setLoading(false);
  };

  const updateApproval = async (id, approved) => {
    try {
      await axiosInstance.put(`/admin/vendor/${id}/approve`, null,{
          params: { approved },
        }
      );

      // Remove vendor from list if rejected
      if (!approved) {
        setVendors((prev) => prev.filter((v) => v.id !== id));
      } else {
        setVendors((prev) =>
          prev.map((v) => (v.id === id ? { ...v, approved: true } : v))
        );
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update vendor approval.");
    }
  };

  const deleteVendor = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this vendor?"
    );
    if (!confirm) return;

    try {
      const response = await axiosInstance.delete(`/admin/vendor/${id}`);
      setVendors((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete vendor.");
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Vendor List</h2>

      {loading && <p className="text-blue-700">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && vendors.length === 0 && <p>No vendors found.</p>}

      {!loading && vendors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-md"
            >
              <div className="flex items-center gap-4 mb-3">
                <img
                  src={vendor?.pic || "https://via.placeholder.com/50"}
                  alt="Profile"
                  className="w-14 h-14 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">
                    {vendor.companyName}
                  </h3>
                  <p className="text-sm text-blue-700">{vendor.name}</p>
                  <p className="text-sm text-blue-700">{vendor.email}</p>
                  <p className="text-sm text-blue-700">📞 {vendor.contact}</p>
                </div>
              </div>

              <p className="text-blue-800 text-sm mb-1">
                Experience: {vendor.experience}
              </p>
              <p className="text-blue-800 text-sm mb-2">
                Status:{" "}
                <span
                  className={
                    vendor.available ? "text-green-600" : "text-red-600"
                  }
                >
                  {vendor.available ? "Available" : "Unavailable"}
                </span>
              </p>

              <div className="mb-2">
                <p className="font-semibold text-blue-900 mb-1">Skills:</p>
                <ul className="list-disc list-inside text-sm text-blue-800">
                  {vendor.skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 mt-4">
                {vendor.approved === null && (
                  <>
                    <button
                      onClick={() => updateApproval(vendor.id, true)}
                      className={`flex-1 px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 justify-center`}
                    >
                      <CheckCircle2 size={16} />
                      Approve
                    </button>

                    <button
                      onClick={() => updateApproval(vendor.id, false)}
                      className="flex-1 px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600 flex items-center gap-2 justify-center"
                    >
                      <XCircle size={16} />
                      Reject
                    </button>
                  </>
                )}

                {vendor.approved !== null && (
                  <button
                    onClick={() => deleteVendor(vendor.id)}
                    className="flex-1 px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 flex items-center gap-2 justify-center"
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}