import { useEffect, useState } from "react";
import axiosInstance from "../../axios/axiosInstance";
import { Pencil, Trash2, PlusCircle, XCircle } from "lucide-react";

export default function Material() {
  const [materials, setMaterials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    unit: "KG",
    phaseType: "ELECTRICAL",
    pricePerQuantity: 0,
  });

  const units = ["KG", "UNITS", "L"];
  const phaseTypes = ["ELECTRICAL", "PLUMBING", "CARPENTARY", "CIVIL", "TILING","PAINTING"];

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await axiosInstance.get("/admin/materials");
      setMaterials(res.data);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axiosInstance.put(`/admin/materials/${editId}`, form);
      } else {
        await axiosInstance.post("/admin/materials", form);
      }
      setForm({ name: "", unit: "KG", phaseType: "ELECTRICAL", pricePerQuantity: 0 });
      setShowForm(false);
      setEditId(null);
      fetchMaterials();
    } catch (err) {
      console.error("Add/Update failed", err);
    }
  };

  const handleDeleteOrRestore = async (id, deleted) => {
    try {
      if (deleted) {
        await axiosInstance.patch(`/admin/materials/re-add/${id}`);
      } else {
        await axiosInstance.patch(`/admin/materials/delete/${id}`);
      }
      fetchMaterials();
    } catch (err) {
      console.error("Delete/Restore failed", err);
    }
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

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-900">Material List</h2>
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
                {phaseTypes.map((p) => (
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
            {editId ? "Update Material" : "Submit Material"}
          </button>
        </form>
      )}

      <div className="overflow-x-auto rounded-lg shadow border border-blue-100 bg-blue-50">
        <table className="w-full table-auto">
          <thead className="bg-blue-100 text-blue-900">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Unit</th>
              <th className="p-3">Phase</th>
              <th className="p-3">Price / Qty</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((material) => (
              <tr key={material.exposedId} className="border-t border-blue-100 hover:bg-white">
                <td className="p-3">{material.name}</td>
                <td className="p-3">{material.unit}</td>
                <td className="p-3">{material.phaseType}</td>
                <td className="p-3">₹{material.pricePerQuantity}</td>
                <td className="p-3">
                  {material.deleted ? (
                    <span className="text-red-600 font-semibold">Deleted</span>
                  ) : (
                    <span className="text-green-700 font-semibold">Active</span>
                  )}
                </td>
                <td className="p-3 flex gap-2">
                  <button
                    className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    onClick={() => handleEdit(material)}
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button
                    className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    onClick={() => handleDeleteOrRestore(material.exposedId, material.deleted)}
                  >
                    <Trash2 size={16} />
                    {material.deleted ? "Restore" : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
