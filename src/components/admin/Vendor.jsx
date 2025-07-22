import { useEffect, useState, useCallback } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../../axios/axiosInstance";
import VendorCard from "./VendorCard";

export default function Vendor({ onAction }) {
  const [approvedVendors, setApprovedVendors] = useState([]);
  const [pendingVendors, setPendingVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("approved");
  const [approvedPage, setApprovedPage] = useState(0);
  const [approvedTotalPages, setApprovedTotalPages] = useState(1);
  const [pendingPage, setPendingPage] = useState(0);
  const [pendingTotalPages, setPendingTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState(null);

  const fetchApprovedVendors = useCallback(async (page = 0, size = pageSize) => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get(`/admin/vendors/approved?page=${page}&size=${size}`);
      setApprovedVendors(res.data.content);
      setApprovedTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch approved vendors.");
    }
    setLoading(false);
  }, [pageSize]);

  const fetchPendingVendors = useCallback(async (page = 0, size = pageSize) => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get(`/admin/vendors/pending?page=${page}&size=${size}`);
      setPendingVendors(res.data.content);
      setPendingTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch pending vendors.");
    }
    setLoading(false);
  }, [pageSize]);

  useEffect(() => {
    if (activeTab === "approved") {
      setApprovedPage(0);
    } else {
      setPendingPage(0);
    }
  }, [pageSize, activeTab]);

  useEffect(() => {
    if (activeTab === "approved") {
      fetchApprovedVendors(approvedPage, pageSize);
    }
  }, [activeTab, approvedPage, pageSize, fetchApprovedVendors]);

  useEffect(() => {
    if (activeTab === "approval") {
      fetchPendingVendors(pendingPage, pageSize);
    }
  }, [activeTab, pendingPage, pageSize, fetchPendingVendors]);

  const updateApproval = async (id, approved) => {
    try {
      const response = await axiosInstance.put(`/admin/vendor/${id}/approve`, null, { params: { approved } });
      if (response?.data?.message === "SUCCESS") {
        toast.success(`Vendor Approval Request ${approved ? "Accepted" : "Rejected"}`)
        setPendingVendors((prev) => prev.filter((v) => v.exposedId !== id));
        onAction(); // Call the onAction prop to refresh dashboard stats
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update vendor approval");
    }
  };

  const deleteVendor = async (id) => {
    setVendorToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!vendorToDelete) return;
    try {
      const response = await axiosInstance.delete(`/admin/vendor/${vendorToDelete}`);
      if (response?.data?.message === "SUCCESS") {
        toast.success(`Vendor Deleted Successfully`)
        setApprovedVendors((prev) => prev.filter((v) => v.exposedId !== vendorToDelete));
        onAction(); // Call the onAction prop to refresh dashboard stats
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete vendor");
    }
    setShowDeleteModal(false);
    setVendorToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setVendorToDelete(null);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg border border-blue-100 p-8 mb-2">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">Vendor List</h2>

        {/* Page Size Selector */}
        <div className="flex items-center gap-2 mb-4">
          <label htmlFor="vendorPageSize" className="text-blue-900 font-semibold">Vendors per page:</label>
          <select
            id="vendorPageSize"
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
            className="border cursor-pointer border-blue-300 rounded-lg px-4 py-2 bg-white text-blue-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm hover:border-blue-400"
          >
            {[5, 10, 20, 50].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className="flex mb-6 border-b border-blue-200">
          <button
            className={`px-6 py-2 font-semibold focus:outline-none transition border-b-2 cursor-pointer -mb-px ${activeTab === 'approved'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-blue-400 hover:text-blue-600'
              }`}
            onClick={() => setActiveTab('approved')}
          >
            Approved Vendors
            <span className="ml-2 text-xs bg-blue-100 text-blue-700 rounded px-2 py-0.5">{approvedVendors.length}</span>
          </button>
          <button
            className={`px-6 py-2 font-semibold focus:outline-none transition border-b-2 cursor-pointer -mb-px ${activeTab === 'approval'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-blue-400 hover:text-blue-600'
              }`}
            onClick={() => setActiveTab('approval')}
          >
            Approval Requests
            <span className="ml-2 text-xs bg-blue-100 text-blue-700 rounded px-2 py-0.5">{pendingVendors.length}</span>
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="animate-spin text-blue-600" size={36} />
          </div>
        )}
        {!loading && error && (
          <div className="flex items-center justify-center py-8">
            <span className="inline-flex items-center gap-2 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded shadow-sm font-semibold mx-auto">
              <AlertCircle size={18} className="text-red-500" />
              {error}
            </span>
          </div>
        )}
        {!loading && !error && activeTab === 'approval' && (
          pendingVendors.length === 0 ? (
            <div className="flex items-center justify-center text-gray-400 italic text-md gap-1 mt-1">
              <AlertCircle size={14} />
              No Approval Requests Found
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingVendors.map((vendor) => (
                  <VendorCard
                    key={vendor.exposedId}
                    vendor={vendor}
                    onApprove={id => updateApproval(id, true)}
                    onReject={id => updateApproval(id, false)}
                  />
                ))}
              </div>
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold disabled:opacity-50 cursor-pointer"
                  onClick={() => setPendingPage(p => Math.max(0, p - 1))}
                  disabled={pendingPage === 0}
                >
                  &lt;&lt; Prev
                </button>
                <span className="text-sm text-blue-900">Page {pendingPage + 1} of {pendingTotalPages}</span>
                <button
                  className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold disabled:opacity-50 cursor-pointer"
                  onClick={() => setPendingPage(p => Math.min(pendingTotalPages - 1, p + 1))}
                  disabled={pendingPage >= pendingTotalPages - 1}
                >
                  Next &gt;&gt;
                </button>
              </div>
            </>
          )
        )}
        {!loading && !error && activeTab === 'approved' && (
          approvedVendors.length === 0 ? (
            <div className="flex items-center justify-center text-gray-400 italic text-md gap-1 mt-1">
              <AlertCircle size={14} />
              No Approved Vendors Found
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {approvedVendors.map((vendor) => (
                  <VendorCard
                    key={vendor.exposedId}
                    vendor={vendor}
                    onRemove={deleteVendor}
                  />
                ))}
              </div>
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold disabled:opacity-50 cursor-pointer"
                  onClick={() => setApprovedPage(p => Math.max(0, p - 1))}
                  disabled={approvedPage === 0}
                >
                  &lt;&lt; Prev
                </button>
                <span className="text-sm text-blue-900">Page {approvedPage + 1} of {approvedTotalPages}</span>
                <button
                  className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold disabled:opacity-50 cursor-pointer"
                  onClick={() => setApprovedPage(p => Math.min(approvedTotalPages - 1, p + 1))}
                  disabled={approvedPage >= approvedTotalPages - 1}
                >
                  Next &gt;&gt;
                </button>
              </div>
            </>
          )
        )}
      </div>
      {/* Modal for delete confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-red-700 mb-4">Delete Vendor</h3>
            <p className="mb-6 text-gray-700">Are you sure you want to delete this vendor? This action cannot be undone.</p>
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