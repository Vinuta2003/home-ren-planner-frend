import { useState } from "react";
import { useDispatch } from "react-redux";
import { getPhaseById } from "../../redux/phase/phaseSlice";
import { deletePhaseMaterial, updatePhaseMaterialQuantity } from "../../axios/phaseApis";
import {
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  Plus,
  Minus,
} from "lucide-react";

export function PhaseMaterial({ phaseMaterial }) {
  const [editMode, updateEditMode] = useState(false);
  const [quantity, updateQuantity] = useState(phaseMaterial.quantity);
  const [showDeleteModal, updateShowDeleteModal] = useState(false);
  const [totalPrice, updateTotalPrice] = useState(phaseMaterial.totalPrice);
  const dispatch = useDispatch();

  const editButtonOnClickHandler = () => updateEditMode(true);
  const deleteButtonOnClickHandler = () => updateShowDeleteModal(true);
  const cancelDeleteButtonOnClickHandler = () => updateShowDeleteModal(false);

  const confirmDeleteButtonOnClickHandler = async () => {
    await deletePhaseMaterial(phaseMaterial.exposedId);
    await dispatch(getPhaseById(phaseMaterial.phaseId));//phaseId
  };

  const increment = () => {
    if (quantity === "") {
      updateQuantity(1);
      updateTotalPrice(phaseMaterial.pricePerQuantity);
    } else {
      const newQty = quantity + 1;
      updateQuantity(newQty);
      updateTotalPrice(phaseMaterial.pricePerQuantity * newQty);
    }
  };

  const decrement = () => {
    if (quantity !== "" && quantity > 1) {
      const newQty = quantity - 1;
      updateQuantity(newQty);
      updateTotalPrice(phaseMaterial.pricePerQuantity * newQty);
    }
  };

  const save = async () => {
    if (quantity !== "" && quantity > 0) {
      await updatePhaseMaterialQuantity(phaseMaterial.exposedId, quantity);
      updateEditMode(false);
      await dispatch(getPhaseById(phaseMaterial.phaseId));
    }
  };

  const cancel = () => {
    updateQuantity(phaseMaterial.quantity);
    updateEditMode(false);
  };

  const quantityInputHandler = (quantityInput) => {
    if (quantityInput === "") {
      updateQuantity(quantityInput);
      updateTotalPrice("---");
    } else if (quantityInput == 0) {
      updateQuantity(1);
      updateTotalPrice(phaseMaterial.pricePerQuantity);
    } else {
      updateQuantity(Number(quantityInput));
      updateTotalPrice(phaseMaterial.pricePerQuantity * Number(quantityInput));
    }
  };

  return (
    <div className="rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300 p-4 bg-white space-y-4">
      {/* Title */}
      <div className="text-xl font-semibold text-gray-800">{phaseMaterial.name}</div>
      <div className="border-t border-black-200" />

      {/* Quantity Section */}
      <div className="text-gray-700 text-base">
        {editMode ? (
          <div className="flex items-center space-x-2">
            <span className="font-medium text-blue-600">Quantity:</span>
            <button
              onClick={decrement}
              className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(event) => quantityInputHandler(event.target.value)}
              className="h-10 w-16 px-2 border border-gray-300 rounded text-center appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              onClick={increment}
              className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded"
            >
              <Plus className="w-4 h-4" />
            </button>
            <span className="text-gray-900 font-semibold">{phaseMaterial.unit}</span>
          </div>
        ) : (
          <div className="text-base">
            <span className="font-medium text-blue-600">Quantity:</span>{" "}
            <span className="text-gray-900 font-semibold">{phaseMaterial.quantity} {phaseMaterial.unit}</span>
          </div>
        )}
      </div>

      {/* Price per Quantity */}
      <div className="text-gray-700 text-base">
        <span className="font-medium text-blue-600">Price per </span><span className="font-medium text-red-600">{phaseMaterial.unit}:</span>{" "}
        <span className="text-gray-900 font-semibold">₹{phaseMaterial.pricePerQuantity}</span>
      </div>

      {/* Total Price */}
      <div className="text-gray-700 text-base">
        <span className="font-medium text-blue-600">Total Price:</span>{" "}
        <span className="text-gray-900 font-semibold">
          ₹{editMode ? totalPrice : phaseMaterial.totalPrice}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="space-x-3 pt-2">
        {editMode ? (
          <>
            {quantity !== "" && (
              <button
                onClick={save}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 inline-flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Save
              </button>
            )}
            <button
              onClick={cancel}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 inline-flex items-center"
            >
              <XCircle className="w-4 h-4 mr-1" />
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={editButtonOnClickHandler}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center"
            >
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </button>
            <button
              onClick={deleteButtonOnClickHandler}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 inline-flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </button>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Are you sure?</h2>
            <p className="text-base text-gray-700 mb-2">
              You are about to delete the following phase material:
            </p>
            <div className="text-lg font-semibold text-red-600 mb-4">
              {phaseMaterial.name}
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Once deleted, you’ll need to re-add it from the materials list.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDeleteButtonOnClickHandler}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center"
              >
                <XCircle className="w-5 h-5 mr-2" />
                Cancel
              </button>
              <button
                onClick={confirmDeleteButtonOnClickHandler}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 inline-flex items-center"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

