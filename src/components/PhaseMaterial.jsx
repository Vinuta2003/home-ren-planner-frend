import { useState } from "react";
import { useDispatch } from "react-redux";
import { getPhaseById } from "../app/features/phaseSlice";
import { deletePhaseMaterial, updatePhaseMaterialQuantity } from "../app/apis/phaseApis";

export function PhaseMaterial({ phaseMaterial }) {
  const [editMode, updateEditMode] = useState(false);
  const [quantity, updateQuantity] = useState(phaseMaterial.quantity);
  const [totalPrice, updateTotalPrice] = useState(phaseMaterial.totalPrice);
  const dispatch = useDispatch();

  const editButtonOnClickHandler = () => updateEditMode(true);

  const deleteButtonOnClickHandler = async () => {
    await deletePhaseMaterial(phaseMaterial.exposedId);
    await dispatch(getPhaseById(phaseMaterial.phaseResponse.id));
  };

  const increment = () => {
    if(quantity==""){
        updateQuantity(1);
        updateTotalPrice(phaseMaterial.pricePerQuantity);
    }
    else{
        const newQty = quantity + 1;
        updateQuantity(newQty);
        updateTotalPrice(phaseMaterial.pricePerQuantity * newQty);
    }
    
  };

  const decrement = () => {
    if (quantity!="" && quantity > 1) {
      const newQty = quantity - 1;
      updateQuantity(newQty);
      updateTotalPrice(phaseMaterial.pricePerQuantity * newQty);
    }
  };

  const save = async () => {
    if(quantity!="" && quantity>0){
        await updatePhaseMaterialQuantity(phaseMaterial.exposedId, quantity);
        updateEditMode(false);
        await dispatch(getPhaseById(phaseMaterial.phaseResponse.id));
    }
    
  };

  const cancel = () => {
    updateQuantity(phaseMaterial.quantity);
    updateEditMode(false);
  };

  const quantityInputHandler = (quantityInput)=>{
    if(quantityInput==""){
        updateQuantity(quantityInput)
        updateTotalPrice("---");
    }
    else if(quantityInput==0){
        updateQuantity(1)
        updateTotalPrice(phaseMaterial.pricePerQuantity);
    }
    else{
        updateQuantity(Number(quantityInput));
        updateTotalPrice(phaseMaterial.pricePerQuantity * Number(quantityInput));
    }
    
  }

  return (
    <div className="border rounded-xl shadow-sm p-4 bg-white space-y-2">
      <div className="text-lg font-semibold text-gray-800">{phaseMaterial.name}</div>

      <div className="text-gray-700">
        {editMode ? (
          <div className="flex items-center space-x-2">
            <span>Quantity:</span>{" "}
            <button onClick={decrement} className="px-2 py-1 bg-gray-200 rounded">-</button>
            {/* <span className="px-2">{quantity}</span> */}
            <input type="number" min={1} value={quantity} onChange={(event)=>{quantityInputHandler(event.target.value);}} className="w-16 px-2 py-1 border border-gray-300 rounded text-center appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"/>
            <button onClick={increment} className="px-2 py-1 bg-gray-200 rounded">+</button>
            <span className="ml-1 text-sm text-gray-600">{phaseMaterial.unit}</span>
          </div>
        ) : (
            <>
            <span>Quantity:</span>{" "}
          <span className="font-medium">{phaseMaterial.quantity} {phaseMaterial.unit}</span>
          </>
        )}
      </div>

      <div className="text-gray-600">
        Price Per Quantity: <span className="font-medium">{phaseMaterial.pricePerQuantity} Rs</span>
      </div>

      <div className="text-gray-600">
        Total Price: <span className="font-medium">{editMode ? totalPrice : phaseMaterial.totalPrice} Rs</span>
      </div>

      <div className="space-x-2">
        {editMode ? (
          <>
            <button onClick={save} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Save</button>
            <button onClick={cancel} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-gray-500">Cancel</button>
          </>
        ) : (
          <>
            <button onClick={editButtonOnClickHandler} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Edit</button>
            <button onClick={deleteButtonOnClickHandler} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
          </>
        )}
      </div>
    </div>
  );
}
