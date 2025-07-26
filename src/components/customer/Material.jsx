import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addMaterial,
  deleteMaterial,
  updateMaterialQuantity,
} from "../../redux/phase/phaseSlice";
import { Plus, Minus, Trash2, PlusCircle } from "lucide-react";

export function Material({ material }) {
  const [addMode, updateAddMode] = useState(false);
  const [quantity, updateQuantity] = useState(0);
  const dispatch = useDispatch();
  const chosenMaterialsList = useSelector(
    (state) => state.phase.chosenMaterialsList
  );

  const add = () => {
    updateQuantity(1);
    updateAddMode(true);
    dispatch(
      addMaterial({ materialExposedId: material.exposedId, quantity: 1 })
    );
  };

  const remove = () => {
    updateQuantity(0);
    updateAddMode(false);
    dispatch(deleteMaterial(material.exposedId));
  };

  const increment = () => {
    if (quantity === "") {
      updateQuantity(1);
      dispatch(
        addMaterial({ materialExposedId: material.exposedId, quantity: 1 })
      );
    } else {
      const newQty = quantity + 1;
      updateQuantity(newQty);
      dispatch(
        updateMaterialQuantity({
          materialExposedId: material.exposedId,
          quantity: newQty,
        })
      );
    }
  };

  const decrement = () => {
    if (quantity !== "" && quantity > 1) {
      const newQty = quantity - 1;
      updateQuantity(newQty);
      dispatch(
        updateMaterialQuantity({
          materialExposedId: material.exposedId,
          quantity: newQty,
        })
      );
    }
  };

  const quantityInputHandler = (quantityInput) => {
    const newQty = Number(quantityInput);
    if (quantityInput === "") {
      updateQuantity(quantityInput);
      dispatch(deleteMaterial(material.exposedId));
    } else if (quantityInput == 0) {
      updateQuantity(1);
      const exists = chosenMaterialsList.some(
        (val) => val.materialExposedId === material.exposedId
      );
      if (exists) {
        dispatch(
          updateMaterialQuantity({
            materialExposedId: material.exposedId,
            quantity: 1,
          })
        );
      } else {
        dispatch(
          addMaterial({ materialExposedId: material.exposedId, quantity: 1 })
        );
      }
    } else {
      updateQuantity(newQty);
      const exists = chosenMaterialsList.some(
        (val) => val.materialExposedId === material.exposedId
      );
      if (exists) {
        dispatch(
          updateMaterialQuantity({
            materialExposedId: material.exposedId,
            quantity: newQty,
          })
        );
      } else {
        dispatch(
          addMaterial({
            materialExposedId: material.exposedId,
            quantity: newQty,
          })
        );
      }
    }
  };

  return (
    <div className="rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300 p-4 bg-white space-y-4">
      {/* Title */}
      <div className="text-xl font-semibold text-gray-800">
        {material.name}
      </div>

      {/* Horizontal line */}
      <div className="border-t border-black-200" />

      {/* Price & Unit */}
      <div className="text-gray-900 font-semibold">
        <span className="text-gray-900 font-semibold">₹{material.pricePerQuantity}</span><span className="text-red-600 font-semibold"> / {material.unit}</span>
      </div>

      {/* Add or Quantity Controls */}
      {!addMode ? (
        <button
          onClick={add}
          className="px-4 py-2 bg-blue-600 text-white items-center rounded-lg hover:bg-blue-700 inline-flex "
        >
          <PlusCircle className="w-4 h-4 mr-1" />
          Add
        </button>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 ml-4">
            <span className="font-medium text-blue-600">Quantity:</span>
            <button
              data-testid="decrement-btn"
              onClick={decrement}
              className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(event) => {
                quantityInputHandler(event.target.value);
              }}
              className="h-10 w-16 px-2 border border-gray-300 rounded text-center appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              data-testid="increment-btn"
              onClick={increment}
              className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded"
            >
              <Plus className="w-4 h-4" />
            </button>
            <span className="text-gray-900 font-semibold">{material.unit}</span>
          </div>
          <button
            onClick={remove}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 inline-flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
