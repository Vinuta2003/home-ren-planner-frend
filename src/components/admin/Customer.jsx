import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";

export default function Customer() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:8080/admin/users");
      setCustomers(res.data); 
    } catch (err) {
      console.error(err);
      setError("Failed to fetch customers.");
    }
    setLoading(false);
  };

  const deleteCustomer = async (id) => {
    const confirm = window.confirm("Are you sure you want to remove this customer?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:8080/admin/users/${id}`);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete customer.");
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Customer List</h2>

      {loading && <p className="text-blue-700">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && customers.length === 0 && <p>No customers found.</p>}

      {!loading && customers.length > 0 && (
        <div className="overflow-x-auto rounded-lg shadow border border-blue-100 bg-blue-50">
          <table className="w-full table-auto">
            <thead className="bg-blue-100 text-blue-900">
              <tr>
                <th className="p-3">Profile</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((user, index) => (
                <tr key={user.id} className="border-t border-blue-100 hover:bg-white">
                  <td className="p-3">
                    <img
                      src={user.pic || "https://img.icons8.com/?size=100&id=12438&format=png&color=000000"}
                      alt="Profile"
                      className="w-10 h-10 rounded-full"
                    />
                  </td>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.contact}</td>
                  <td className="p-3">
                    <button
                      onClick={() => deleteCustomer(user.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
