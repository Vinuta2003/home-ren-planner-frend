import { useState, useEffect } from "react";
import SideBar from "../components/admin/SideBar"
import Vendor from "../components/admin/Vendor"
import Customer from "../components/admin/Customer";
import Material from "../components/admin/Material";
import { Users, Building2, Package, TrendingUp } from "lucide-react";
import axiosInstance from "../axios/axiosInstance";

export default function AdminDashboard()
{
    const [activeTab, setActiveTab] = useState("dashboard");
    const [stats, setStats] = useState({
        customers: 0,
        vendors: 0,
        materials: 0,
        pendingVendors: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            // Fetch statistics from your API endpoints
            const [customersRes, vendorsRes, materialsRes, pendingVendorsRes] = await Promise.all([
                axiosInstance.get('/admin/users?page=0&size=1'),
                axiosInstance.get('/admin/vendors/approved?page=0&size=1'),
                axiosInstance.get('/admin/materials?page=0&size=1000'), // Get all materials to filter active ones
                axiosInstance.get('/admin/vendors/pending?page=0&size=1')
            ]);

            // Filter active materials (not deleted)
            const activeMaterials = materialsRes.data.content?.filter(material => !material.deleted) || [];

            setStats({
                customers: customersRes.data.totalElements || 0,
                vendors: vendorsRes.data.totalElements || 0,
                materials: activeMaterials.length,
                pendingVendors: pendingVendorsRes.data.totalElements || 0
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    // Function to refresh stats when actions are performed
    const refreshStats = () => {
        fetchStats();
    };

    const DashboardOverview = () => (
        <div className="w-full max-w-6xl mx-auto">
            <div className="mb-6">
                <p className="text-blue-600 font-bold text-lg">Welcome back! Here's an overview.</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Customers Card */}
                <div className="bg-white rounded-lg shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-600 text-sm font-medium">Total Customers</p>
                            <p className="text-3xl font-bold text-blue-900">
                                {loading ? "..." : stats.customers}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Users className="text-blue-600" size={24} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-green-600 text-sm">
                        <TrendingUp size={16} />
                        <span className="ml-1">Active users</span>
                    </div>
                </div>

                {/* Vendors Card */}
                <div className="bg-white rounded-lg shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-600 text-sm font-medium">Approved Vendors</p>
                            <p className="text-3xl font-bold text-blue-900">
                                {loading ? "..." : stats.vendors}
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <Building2 className="text-green-600" size={24} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-green-600 text-sm">
                        <TrendingUp size={16} />
                        <span className="ml-1">Active vendors</span>
                    </div>
                </div>

                {/* Pending Vendors Card */}
                <div className="bg-white rounded-lg shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-600 text-sm font-medium">Pending Approvals</p>
                            <p className="text-3xl font-bold text-orange-600">
                                {loading ? "..." : stats.pendingVendors}
                            </p>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-lg">
                            <Building2 className="text-orange-600" size={24} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-orange-600 text-sm">
                        <span>Awaiting review</span>
                    </div>
                </div>

                {/* Materials Card */}
                <div className="bg-white rounded-lg shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-600 text-sm font-medium">Total Materials</p>
                            <p className="text-3xl font-bold text-blue-900">
                                {loading ? "..." : stats.materials}
                            </p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <Package className="text-purple-600" size={24} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-purple-600 text-sm">
                        <span>Available items</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg border border-blue-100 p-6 mb-8">
                <h2 className="text-xl font-bold text-blue-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button 
                        onClick={() => setActiveTab("customer")}
                        className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors duration-150 text-left"
                    >
                        <div className="flex items-center gap-3 cursor-pointer">
                            <Users className="text-blue-600" size={20} />
                            <div>
                                <p className="font-semibold text-blue-900">Manage Customers</p>
                                <p className="text-sm text-blue-600">View and manage customer accounts</p>
                            </div>
                        </div>
                    </button>

                    <button 
                        onClick={() => setActiveTab("vendor")}
                        className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors duration-150 text-left"
                    >
                        <div className="flex items-center gap-3 cursor-pointer">
                            <Building2 className="text-green-600" size={20} />
                            <div>
                                <p className="font-semibold text-green-900">Manage Vendors</p>
                                <p className="text-sm text-green-600">Approve and manage vendor accounts</p>
                            </div>
                        </div>
                    </button>

                    <button 
                        onClick={() => setActiveTab("material")}
                        className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors duration-150 text-left"
                    >
                        <div className="flex items-center gap-3 cursor-pointer">
                            <Package className="text-purple-600" size={20} />
                            <div>
                                <p className="font-semibold text-purple-900">Manage Materials</p>
                                <p className="text-sm text-purple-600">Add and manage material inventory</p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
    
    return(
        <>
            <div className="admin-dashboard min-h-screen bg-blue-50">
                <SideBar setActiveTab={setActiveTab} activeTab={activeTab}/>
                <div className="ml-64 flex-1 flex flex-col p-8 bg-blue-50 overflow-auto h-screen">
                    {activeTab === "dashboard" && <DashboardOverview/>}
                    {activeTab === "customer" && <Customer onAction={refreshStats}/>}
                    {activeTab === "vendor" && <Vendor onAction={refreshStats}/>}
                    {activeTab === "material" && <Material onAction={refreshStats}/>}
                </div>
            </div>
        </>
    )
}