import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../axios/axiosInstance";
import { Trash2, AlertCircle, Loader2 } from "lucide-react";

export default function Customer({ onAction }) {
  const [customers, setCustomers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  useEffect(() => {
    setPage(0); // Reset to first page when pageSize changes
  }, [pageSize]);

  useEffect(() => {
    fetchCustomers(page, pageSize);
  }, [page, pageSize]);

  const fetchCustomers = async (page = 0, size = pageSize) => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get(`/admin/users?page=${page}&size=${size}`);
      console.log(res.data.content)
      setCustomers(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch customers.");
    }
    setLoading(false);
  };

  const deleteCustomer = (id) => {
    setCustomerToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!customerToDelete) return;
    try {
      const response = await axiosInstance.delete(`/admin/users/${customerToDelete}`);
      if (response?.data?.message === "SUCCESS") {
        toast.success("Customer Deleted Successfully")
        setCustomers((prev) => prev.filter((c) => c.exposedId !== customerToDelete));
        onAction(); // Call the onAction prop to refresh dashboard stats
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete customer");
    }
    setShowDeleteModal(false);
    setCustomerToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCustomerToDelete(null);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg border border-blue-100 p-8 mb-2">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">Customer List</h2>

        <div className="flex items-center gap-2 mb-4">
          <label htmlFor="pageSize" className="text-blue-900 font-semibold">Rows per page:</label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
            className="border cursor-pointer border-blue-300 rounded-lg px-4 py-2 bg-white text-blue-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm hover:border-blue-400"
          >
            {[5, 10, 20, 50].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

          <div className="overflow-x-auto rounded-lg shadow border border-blue-100 bg-blue-50">
            <table className="w-full table-fixed">
              <thead className="bg-blue-100 text-blue-900">
                <tr>
                  <th className="p-3 w-1/7">Profile</th>
                  <th className="p-3 w-1/5">Name</th>
                  <th className="p-3 w-1/5">Email</th>
                  <th className="p-3 w-1/7">Phone</th>
                  <th className="p-3 w-1/7">Actions</th>
                </tr>
              </thead>
              <tbody>
                {!loading && !error && customers?.length > 0 && (
                  customers.map((user) => (
                    <tr key={user.exposedId} className="border-t border-blue-100 hover:bg-white">
                      <td className="p-3 text-center align-middle">
                        <img
                          src={user?.pic || "https://img.icons8.com/?size=100&id=12438&format=png&color=000000"}
                          alt="Profile"
                          className="w-10 h-10 rounded-full mx-auto"
                        />
                      </td>
                      <td className="p-3 text-center align-middle whitespace-normal break-words">{user.name}</td>
                      <td className="p-3 text-center align-middle whitespace-normal break-words">{user.email}</td>
                      <td className="p-3 text-center align-middle whitespace-normal break-words">{user.contact}</td>
                      <td className="p-3 text-center items-center justify-center align-middle">
                        <div className="flex justify-center">
                          <button
                            onClick={() => deleteCustomer(user.exposedId)}
                            className="px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer bg-red-500 hover:bg-red-600 text-white font-semibold text-sm shadow-sm hover:shadow-md transition-colors duration-150"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        {/* Pagination Controls */}
        {!loading && customers?.length > 0 && !error && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold disabled:opacity-50 cursor-pointer"
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              &lt;&lt; Prev
            </button>
            <span className="text-sm text-blue-900">Page {page + 1} of {totalPages}</span>
            <button
              className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold disabled:opacity-50 cursor-pointer"
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              Next &gt;&gt;
            </button>
          </div>
        )}
        {loading && (
          <div role="status" className="flex justify-center items-center py-8">
            <Loader2 className="animate-spin text-blue-600" size={36} />
          </div>
        )}
        {error && (
          <div className="p-3 text-center">
            <span className="inline-flex items-center gap-2 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded shadow-sm font-semibold mx-auto">
              <AlertCircle size={18} className="text-red-500" />
              {error}
            </span>
          </div>
        )}
        {!error && customers?.length === 0 && (
          <div className="p-3 text-center">
            <span className="inline-flex items-center text-gray-400 italic text-md gap-1 mx-auto">
              <AlertCircle size={14} />
              No customers found.
            </span>
          </div>
        )}
      </div>
      {/* Modal for delete confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-red-700 mb-4">Delete Customer</h3>
            <p className="mb-6 text-gray-700">Are you sure you want to delete this customer? This action cannot be undone.</p>
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
    </div>
  );
}
