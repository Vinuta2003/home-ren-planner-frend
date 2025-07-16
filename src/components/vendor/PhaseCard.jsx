import React from "react";
import { SendHorizonal } from "lucide-react";

const PhaseCard = ({ phase, quote, setQuotes, submitQuote }) => {
  return (
    <section className="bg-white border border-blue-100 rounded-2xl shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold text-blue-600">{phase.phaseName}</h2>
        <span className="text-sm px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-medium">
          {phase.phaseStatus}
        </span>
      </div>

      <p className="text-gray-700 mb-3">{phase.description}</p>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
        <p><strong>Start Date:</strong> {phase.startDate}</p>
        <p><strong>End Date:</strong> {phase.endDate}</p>
        <p><strong>Phase Type:</strong> {phase.phaseType}</p>
        <p>
          <strong>Vendor Cost:</strong>{" "}
          {phase.vendorCost != null ? (
            <span className="text-green-600">₹{phase.vendorCost}</span>
          ) : (
            <span className="text-red-500">Not sent</span>
          )}
        </p>
      </div>

      <div className="mt-2">
        <h3 className="font-semibold text-blue-800 mb-2">Materials</h3>
        <ul className="space-y-3">
          {phase.materials.map((m) => (
            <li
              key={m.exposedId}
              className="border rounded-lg bg-blue-50 p-3 text-sm"
            >
              <p className="font-semibold text-blue-800">{m.name}</p>
              <div className="grid grid-cols-3 gap-2 mt-1 text-gray-700">
                <span><strong>Quantity:</strong> {m.quantity} {m.unit}</span>
                <span><strong>Price/Unit:</strong> ₹{m.pricePerQuantity}</span>
                <span><strong>Total:</strong> ₹{m.totalPrice}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {phase.vendorCost == null && (
        <div className="mt-5 flex gap-2 items-center">
          <input
            type="number"
            placeholder="Enter quote (e.g., 5000)"
            className="border rounded-lg px-4 py-2 text-sm w-48 focus:outline-blue-400"
            value={quote}
            onChange={(e) =>
              setQuotes((prev) => ({ ...prev, [phase.id]: e.target.value }))
            }
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm rounded-lg flex items-center gap-2 transition"
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
