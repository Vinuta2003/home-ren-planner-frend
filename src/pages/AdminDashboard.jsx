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
            <div className="admin-dashboard flex flex-row">
                <SideBar setActiveTab={setActiveTab} activeTab={activeTab}/>
                <div className="content">
                    {activeTab === "customer" && <Customer/>}
                    {activeTab === "vendor" && <Vendor/>}
                    {activeTab === "material" && <Material/>}
                </div>
            </div>
        </>
    )
}