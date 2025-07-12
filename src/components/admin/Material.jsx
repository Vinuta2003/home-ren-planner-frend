import { useEffect, useState } from "react";
import axiosInstance from "../../axios/axiosInstance";
import { Pencil, Trash2, PlusCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function Material({ onAction }) {
  const [materials, setMaterials] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    unit: "KG",
    phaseType: "ELECTRICAL",
    pricePerQuantity: 0,
  });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);
  const [materialToRemove, setMaterialToRemove] = useState(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("ALL");

  // Function to group materials by phase type
  const groupMaterialsByPhaseType = (materials) => {
    if (!materials) return {};
    
    return materials.reduce((groups, material) => {
      const phaseType = material.phaseType;
      if (!groups[phaseType]) {
        groups[phaseType] = [];
      }
      groups[phaseType].push(material);
      return groups;
    }, {});
  };

  // Function to get materials for active tab
  const getMaterialsForActiveTab = (materials) => {
    if (!materials) return [];
    if (activeTab === "ALL") return materials;
    return materials.filter(material => material.phaseType === activeTab);
  };

  // Function to capitalize phase type text
  const capitalizePhaseType = (phaseType) => {
    return phaseType.charAt(0).toUpperCase() + phaseType.slice(1).toLowerCase();
  };

  // Function to get background color for phase type
  const getPhaseTypeColor = (phaseType) => {
    switch (phaseType) {
      case 'ELECTRICAL':
        return 'bg-blue-100 text-blue-800';
      case 'PLUMBING':
        return 'bg-green-100 text-green-800';
      case 'CARPENTRY':
        return 'bg-yellow-100 text-yellow-800';
      case 'CIVIL':
        return 'bg-purple-100 text-purple-800';
      case 'TILING':
        return 'bg-orange-100 text-orange-800';
      case 'PAINTING':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const units = ["KG", "UNITS", "L"];
  const phaseTypes = ["ALL", "ELECTRICAL", "PLUMBING", "CARPENTRY", "CIVIL", "TILING", "PAINTING"];

  useEffect(() => {
    setPage(0);
  }, [pageSize]);

  useEffect(() => {
    fetchMaterials(page, pageSize);
  }, [page, pageSize]);

  const fetchMaterials = async (page = 0, size = pageSize) => {
    try {
      const res = await axiosInstance.get(`/admin/materials?page=${page}&size=${size}`);
      setMaterials(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Fetch failed", err);
      setError("Error occurred while fetching materials.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (editId) {
        response = await axiosInstance.put(`/admin/materials/${editId}`, form);
      } else {
        response = await axiosInstance.post("/admin/materials", form);
      }
      if (response?.data?.message === "SUCCESS") {
        toast.success(`Material ${editId ? "Updated" : "Added"} Successfully`)
        setForm({ name: "", unit: "KG", phaseType: "ELECTRICAL", pricePerQuantity: 0 });
        setShowForm(false);
        setEditId(null);
        fetchMaterials();
        onAction(); // Call the onAction prop to refresh dashboard stats
      }
      else {
        toast.error("Operation Failed")
      }
    } catch (err) {
      toast.error("Error Occured in Server")
      console.error("Add/Update failed", err);
    }
  };

  const handleDeleteOrRestore = (id, deleted) => {
    if (!deleted) {
      setMaterialToDelete(id);
      setShowDeleteModal(true);
    } else {
      confirmDeleteOrRestore(id, deleted);
    }
  };

  const confirmDeleteOrRestore = async (id, deleted) => {
    try {
      const response = await axiosInstance.patch(`/admin/materials/${deleted ? "re-add" : "delete"}/${id}`)
      if (response?.data?.message === "SUCCESS") {
        toast.success(`Material ${deleted ? "Restored" : "Deleted"} Successfully`)
        fetchMaterials();
        onAction(); // Call the onAction prop to refresh dashboard stats
      }
      else toast.error("Operation Failed")
    } catch (err) {
      toast.error("Error Occurred in Server")
    }
    setShowDeleteModal(false);
    setMaterialToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (materialToDelete) {
      confirmDeleteOrRestore(materialToDelete, false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setMaterialToDelete(null);
  };

  const handleEdit = (material) => {
    setEditId(material.exposedId);
    setForm({
      name: material.name,
      unit: material.unit,
      phaseType: material.phaseType,
      pricePerQuantity: material.pricePerQuantity,
    });
    setShowForm(true);
  };

  const handlePermanentRemove = (id) => {
    setMaterialToRemove(id);
    setShowRemoveModal(true);
  };

  const confirmPermanentRemove = async () => {
    if (!materialToRemove) return;
    try {
      const response = await axiosInstance.delete(`/admin/materials/hard/${materialToRemove}`);
      if (response?.data?.message === "SUCCESS") {
        toast.success("Material removed permanently.");
        fetchMaterials();
        onAction(); // Call the onAction prop to refresh dashboard stats
      } else {
        toast.error("Failed to remove material permanently.");
      }
    } catch (err) {
      toast.error("Error occurred while removing permanently.");
    }
    setShowRemoveModal(false);
    setMaterialToRemove(null);
  };

  const handleCancelRemove = () => {
    setShowRemoveModal(false);
    setMaterialToRemove(null);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg border border-blue-100 p-8 mb-2">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-900">Materials List</h2>
          <button
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
            onClick={() => {
              setShowForm(!showForm);
              setEditId(null);
              setForm({ name: "", unit: "KG", phaseType: "ELECTRICAL", pricePerQuantity: 0 });
            }}
          >
            {showForm ? <XCircle size={18} /> : <PlusCircle size={18} />}
            {showForm ? "Cancel" : "Add Material"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleAddOrUpdate}
            className="bg-blue-50 p-6 mb-6 rounded shadow border border-blue-200 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-1">Unit</label>
                <select
                  name="unit"
                  value={form.unit}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                >
                  {units.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-1">Phase Type</label>
                <select
                  name="phaseType"
                  value={form.phaseType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                >
                  {phaseTypes.slice(1).map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-1">Price per Quantity (₹)</label>
                <input
                  type="number"
                  name="pricePerQuantity"
                  value={form.pricePerQuantity}
                  onChange={handleChange}
                  min={0}
                  required
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
              onClick={handleAddOrUpdate}
            >
              {editId ? "Update Material" : "Add Material"}
            </button>
          </form>
        )}

        <div className="flex items-center gap-2 mb-4">
          <label htmlFor="materialPageSize" className="text-blue-900 font-semibold">Rows per page:</label>
          <select
            id="materialPageSize"
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
            className="border cursor-pointer border-blue-300 rounded-lg px-4 py-2 bg-white text-blue-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm hover:border-blue-400"
          >
            {[5, 10, 20, 50].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {phaseTypes.map((phaseType) => (
              <button
                key={phaseType}
                onClick={() => setActiveTab(phaseType)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === phaseType
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-blue-100 text-blue-900 hover:bg-blue-200 hover:shadow-sm"
                }`}
              >
                {phaseType === "ALL" ? "All Materials" : capitalizePhaseType(phaseType)}
              </button>
            ))}
          </div>
        </div>

        {materials && materials.length > 0 && (
          <div className="bg-white rounded-lg shadow border border-blue-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-100 text-blue-900">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-center">Unit</th>
                    <th className="p-3 text-center">Phase Type</th>
                    <th className="p-3 text-center">Price / Qty</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getMaterialsForActiveTab(materials).map((material) => (
                    <tr key={material.exposedId} className="border-t border-blue-200 hover:bg-blue-50 transition-colors">
                      <td className="p-3 text-left align-middle whitespace-normal break-words">{material.name}</td>
                      <td className="p-3 text-center align-middle whitespace-normal break-words">{material.unit}</td>
                      <td className="p-3 text-center align-middle whitespace-normal break-words">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPhaseTypeColor(material.phaseType)}`}>
                          {capitalizePhaseType(material.phaseType)}
                        </span>
                      </td>
                      <td className="p-3 text-center align-middle whitespace-normal break-words">₹{material.pricePerQuantity}</td>
                      <td className="p-3 text-center align-middle whitespace-normal break-words">
                        {material.deleted ? (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">Deleted</span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Active</span>
                        )}
                      </td>
                      <td className="p-3 text-center align-middle">
                        <div className="flex gap-2 justify-center">
                          {material.deleted ? (
                            <>
                              <button
                                className="px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer bg-green-500 hover:bg-green-600 text-white font-semibold text-sm shadow-sm hover:shadow-md transition-colors duration-150"
                                onClick={() => handleDeleteOrRestore(material.exposedId, true)}
                              >
                                <PlusCircle size={14} /> Restore
                              </button>
                              <button
                                className="px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer bg-red-500 hover:bg-red-600 text-white font-semibold text-sm shadow-sm hover:shadow-md transition-colors duration-150"
                                onClick={() => handlePermanentRemove(material.exposedId)}
                              >
                                <Trash2 size={14} /> Remove
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white font-semibold text-sm shadow-sm hover:shadow-md transition-colors duration-150"
                                onClick={() => handleEdit(material)}
                                disabled={material.deleted}
                              >
                                <Pencil size={14} /> Edit
                              </button>
                              <button
                                className="px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer bg-red-500 hover:bg-red-600 text-white font-semibold text-sm shadow-sm hover:shadow-md transition-colors duration-150"
                                onClick={() => handleDeleteOrRestore(material.exposedId, false)}
                              >
                                <Trash2 size={14} /> Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination Controls */}
        {materials && materials.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              className="px-3 py-1 rounded bg-blue-100 text-blue-900 font-semibold disabled:opacity-50 cursor-pointer"
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              &lt;&lt; Prev
            </button>
            <span className="text-sm text-blue-900">Page {page + 1} of {totalPages}</span>
            <button
              className="px-3 py-1 rounded bg-blue-100 text-blue-900 font-semibold disabled:opacity-50 cursor-pointer"
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              Next &gt;&gt;
            </button>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="animate-spin text-blue-600" size={36} />
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center mt-4">
            <div className="flex items-center gap-2 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded shadow-sm font-semibold">
              <AlertCircle size={18} className="text-red-500" />
              {error}
            </div>
          </div>
        )}
        {materials && materials?.length === 0 && (
          <p className="flex items-center justify-center text-gray-400 italic text-md gap-1 mt-1"><AlertCircle size={14} /> No materials found.</p>
        )}
      </div>

      {/* Modal for delete confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-red-700 mb-4">Delete Material</h3>
            <p className="mb-6 text-gray-700">Are you sure you want to delete this material? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold cursor-pointer"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 font-semibold cursor-pointer"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for permanent remove confirmation */}
      {showRemoveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-red-700 mb-4">Remove Material</h3>
            <p className="mb-6 text-gray-700">Are you sure you want to remove this material permanently? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold cursor-pointer"
                onClick={handleCancelRemove}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-700 text-white hover:bg-red-800 font-semibold cursor-pointer"
                onClick={confirmPermanentRemove}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
