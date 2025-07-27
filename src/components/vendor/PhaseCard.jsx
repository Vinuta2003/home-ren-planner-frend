import React from "react";
import { SendHorizonal } from "lucide-react";

const PhaseCard = ({ phase, quote, setQuotes, submitQuote }) => {
  return (
    <section className="bg-white border border-blue-100 rounded-2xl shadow p-6 mb-6 transition-shadow duration-200 hover:shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold text-blue-700">{phase.phaseName}</h2>
        <span
          className={
            `text-sm px-3 py-1 rounded-lg font-semibold border ` +
            (phase.phaseStatus === "NOTSTARTED"
              ? "bg-red-100 text-red-800 border-red-200"
              : phase.phaseStatus === "INPROGRESS"
              ? "bg-yellow-100 text-yellow-800 border-yellow-200"
              : phase.phaseStatus === "COMPLETED"
              ? "bg-green-100 text-green-800 border-green-200"
              : phase.phaseStatus === "INSPECTION"
              ? "bg-blue-100 text-blue-800 border-blue-200"
              : "bg-gray-100 text-gray-800 border-gray-200")
          }
        >
          {phase.phaseStatus}
        </span>
      </div>

      <p className="text-gray-700 mb-4 text-base">{phase.description}</p>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
        <p><strong>Start Date:</strong> <span className="font-medium text-gray-900">{phase.startDate}</span></p>
        <p><strong>End Date:</strong> <span className="font-medium text-gray-900">{phase.endDate}</span></p>
        <p><strong>Phase Type:</strong> <span className="font-medium text-blue-800">{phase.phaseType}</span></p>
        <p>
          <strong>Vendor Cost:</strong>{" "}
          {phase.vendorCost != null ? (
            <span className="text-green-600 font-semibold">₹{phase.vendorCost}</span>
          ) : (
            <span className="text-red-500 font-semibold">Not sent</span>
          )}
        </p>
      </div>

      <div className="mt-3">
        {phase.materials && phase.materials.length > 0 && (
          <>
            <h3 className="font-semibold text-blue-900 mb-2 text-base">Materials</h3>
            <ul className="space-y-2">
              {phase.materials.map((m) => (
                <li
                  key={m.exposedId}
                  className="border border-blue-50 rounded-lg bg-blue-50/60 p-3 text-sm"
                >
                  <p className="font-semibold text-blue-800">{m.name}</p>
                  <div className="grid grid-cols-3 gap-2 mt-1 text-gray-700">
                    <span><strong>Quantity:</strong> <span className="font-medium">{m.quantity} {m.unit}</span></span>
                    <span><strong>Price/Unit:</strong> <span className="text-blue-700 font-medium">₹{m.pricePerQuantity}</span></span>
                    <span><strong>Total:</strong> <span className="text-green-700 font-semibold">₹{m.totalPrice}</span></span>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {phase.vendorCost == null && phase.phaseStatus === "INSPECTION" && (
        <div className="mt-6 flex gap-2 items-center">
          <input
            type="number"
            placeholder="Enter quote (e.g., 5000)"
            className="border border-blue-200 rounded-lg px-4 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
            value={quote}
            onChange={(e) =>
              setQuotes((prev) => ({ ...prev, [phase.id]: e.target.value }))
            }
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm rounded-lg flex items-center gap-2 transition focus:outline-none focus:ring-2 focus:ring-blue-300 font-semibold shadow cursor-pointer"
            onClick={() => submitQuote(phase.id)}
          >
            <SendHorizonal size={16} />
            Submit Quote
          </button>
        </div>
      )}
    </section>
  );
};

export default PhaseCard;
