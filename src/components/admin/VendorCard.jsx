import { CheckCircle2, XCircle, Trash2, Mail, Phone, AlertCircle } from "lucide-react";

export default function VendorCard({ vendor, onApprove, onReject, onRemove }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-md flex flex-col h-full">
      <div className="flex items-center gap-4 mb-3">
        <img
          src={vendor?.pic || "https://img.icons8.com/?size=100&id=12438&format=png&color=000000"}
          alt="Profile"
          className="w-14 h-14 rounded-lg"
        />
        <div>
          <h5 className="text-lg font-extrabold text-blue-900 leading-tight">{vendor.companyName}</h5>
          <p className="text-base font-semibold text-blue-700 mt-1">{vendor.name}</p>
          <p className="text-xs text-gray-500 font-medium mt-0.5 flex items-center gap-1"><Mail size={14} className="inline-block" />{vendor.email}</p>
          <p className="text-xs text-gray-500 font-medium mt-0.5 flex items-center gap-1"><Phone size={14} className="inline-block" />{vendor.contact}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 mb-2 mt-1">
        <span className="text-blue-800 text-sm font-semibold">Experience:</span>
        <span className="text-gray-700 text-sm font-bold">{vendor.experience} years</span>
        <span className={`ml-auto text-xs font-bold rounded px-2 py-0.5 ${vendor.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {vendor.available ? "Available" : "Unavailable"}
        </span>
      </div>
      <div className="mb-2">
        <p className="font-semibold text-blue-900 mb-1">Skills:</p>
        {vendor.skills && vendor.skills.length > 0 ? (
          <ul className="text-sm space-y-1 mt-2">
            {vendor.skills.map((skill, index) => {
              const [name, price] = skill.split(" - ");
              return (
                <li key={index} className="flex justify-between items-center bg-white py-0.5 px-3 rounded-lg">
                  <span className="font-medium text-blue-900">{name}</span>
                  <span className="font-semibold text-green-700">{price}</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex items-center justify-center text-gray-400 italic text-md gap-1 mt-1">
            <AlertCircle size={14} />
            No Skills Found
          </div>
        )}
      </div>
      <div className="flex gap-2 mt-auto pt-1">
        {onApprove && onReject ? (
          <>
            <button
              onClick={() => onApprove(vendor.exposedId)}
              className="flex-1 px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 justify-center cursor-pointer"
            >
              <CheckCircle2 size={16} />
              Approve
            </button>
            <button
              onClick={() => onReject(vendor.exposedId)}
              className="flex-1 px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600 flex items-center gap-2 justify-center cursor-pointer"
            >
              <XCircle size={16} />
              Reject
            </button>
          </>
        ) : onRemove ? (
          <button
            onClick={() => onRemove(vendor.exposedId)}
            className="flex-1 px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 flex items-center gap-2 justify-center cursor-pointer"
          >
            <Trash2 size={16} />
            Delete Vendor
          </button>
        ) : null}
      </div>
    </div>
  );
} 