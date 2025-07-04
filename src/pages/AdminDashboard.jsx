import { useState } from "react";
import SideBar from "../components/admin/SideBar"
import Vendor from "../components/admin/Vendor"
import Customer from "../components/admin/Customer";
import Material from "../components/admin/Material";

export default function AdminDashboard()
{
    const [activeTab, setActiveTab] = useState("customer");
    
    return(
        <>
            <div className="admin-dashboard min-h-screen bg-blue-50">
                <SideBar setActiveTab={setActiveTab} activeTab={activeTab}/>
                <div className="ml-64 flex-1 flex flex-col p-8 bg-blue-50 overflow-auto h-screen">
                    {activeTab === "customer" && <Customer/>}
                    {activeTab === "vendor" && <Vendor/>}
                    {activeTab === "material" && <Material/>}
                </div>
            </div>
        </>
    )
}