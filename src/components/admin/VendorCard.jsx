import { CheckCircle2, XCircle, Trash2, Mail, Phone, AlertCircle, Star, Clock } from "lucide-react";

export default function VendorCard({ vendor, onApprove, onReject, onRemove }) {
  return (
    <div className="backdrop-blur-sm bg-blue-50/90 border border-blue-200/50 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full group max-w-sm relative overflow-hidden">
      {/* Subtle Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-white/20 rounded-xl"></div>
      <div className="relative z-10 flex flex-col h-full">
      {/* Header Section with Gradient Background */}
      <div className="flex items-start gap-3 mb-3">
        <div className="relative flex-shrink-0">
          <img
            src={vendor?.pic || "https://img.icons8.com/?size=100&id=12438&format=png&color=000000"}
            alt="Profile"
            className="w-12 h-12 rounded-lg object-cover border-2 border-gray-200 shadow-md group-hover:scale-105 transition-transform duration-300"
          />
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
            vendor.available ? 'bg-green-400' : 'bg-red-400'
          }`}></div>
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="text-base font-bold text-gray-900 leading-tight mb-1">
            {vendor.companyName}
          </h5>
          <p className="text-sm font-semibold text-gray-700 mb-2">
            {vendor.name}
          </p>
          
          {/* Contact Information with Icons */}
          <div className="space-y-1">
            <div className="flex items-start gap-2 text-xs text-gray-600 bg-blue-50 rounded-md px-2 py-1">
              <Mail size={12} className="flex-shrink-0 text-blue-500 mt-0.5" />
              <span className="break-all leading-relaxed min-w-0 flex-1">{vendor.email}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 bg-blue-50 rounded-md px-2 py-1">
              <Phone size={12} className="flex-shrink-0 text-blue-500" />
              <span className="break-all">{vendor.contact}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Experience and Availability with Enhanced Design */}
      <div className="flex items-center justify-between mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-blue-600" />
          <span className="text-gray-700 text-xs font-medium">Experience:</span>
          <span className="text-gray-900 text-xs font-bold bg-white px-2 py-0.5 rounded-md border border-gray-200">
            {vendor.experience} years
          </span>
        </div>
        <span className={`text-xs font-semibold rounded-md px-3 py-1 ${
          vendor.available 
            ? "bg-blue-100 text-blue-800 border border-blue-200" 
            : "bg-gray-100 text-gray-800 border border-gray-200"
        }`}>
          {vendor.available ? "Available" : "Unavailable"}
        </span>
      </div>

      {/* Skills Section with Table Design */}
      <div className="flex-1">
        <h6 className="font-bold text-gray-800 mb-3 text-xs uppercase tracking-wider flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Skills & Pricing
        </h6>
        {vendor.skills && vendor.skills.length > 0 ? (
          <div className="bg-white/90 rounded-lg border border-blue-200 overflow-hidden shadow-sm">
            {/* Table Header */}
            <div className="bg-blue-50 px-3 py-2 border-b border-blue-200">
              <div className="flex justify-between items-center text-xs font-semibold text-gray-700">
                <span>Skill</span>
                <span>Price</span>
              </div>
            </div>
            {/* Table Body */}
            <div className="divide-y divide-blue-100">
              {vendor.skills.map((skill, index) => {
                const [name, price] = skill.split(" - ");
                const cleanPrice = price ? price.replace(/₹/g, '').trim() : '';
                return (
                  <div key={index} className="flex justify-between items-center px-3 py-2 hover:bg-blue-50 transition-colors duration-150">
                    <span className="font-medium text-gray-800 text-xs">{name}</span>
                    <span className="font-bold text-blue-600 text-xs bg-blue-100 px-2 py-1 rounded-md">
                      ₹{cleanPrice}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center text-gray-400 italic text-xs gap-2 py-4 bg-blue-50 rounded-lg border border-blue-200">
            <AlertCircle size={14} className="text-gray-400" />
            No Skills Found
          </div>
        )}
      </div>

      {/* Action Buttons with Enhanced Design */}
      <div className="flex gap-2 mt-4 pt-3 border-t border-blue-200">
        {onApprove && onReject ? (
          <>
            <button
              onClick={() => onApprove(vendor.exposedId)}
              className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all duration-200 flex items-center gap-2 justify-center font-semibold text-xs shadow-sm hover:shadow-md transform hover:scale-105 cursor-pointer"
            >
              <CheckCircle2 size={14} />
              Approve
            </button>
            <button
              onClick={() => onReject(vendor.exposedId)}
              className="flex-1 px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-all duration-200 flex items-center gap-2 justify-center font-semibold text-xs shadow-sm hover:shadow-md transform hover:scale-105 cursor-pointer"
            >
              <XCircle size={14} />
              Reject
            </button>
          </>
        ) : onRemove ? (
          <button
            onClick={() => onRemove(vendor.exposedId)}
            className="w-full px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all duration-200 flex items-center gap-2 justify-center font-semibold text-xs shadow-sm hover:shadow-md transform hover:scale-105 cursor-pointer"
          >
            <Trash2 size={14} />
            Delete
          </button>
        ) : null}
      </div>
      </div>
    </div>
  );
} 