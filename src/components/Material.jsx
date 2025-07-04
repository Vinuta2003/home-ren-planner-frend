import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMaterial, deleteMaterial, updateMaterialQuantity } from "../app/features/phaseSlice";

export function Material({ material }) {
  const [addMode, updateAddMode] = useState(false);
  const [quantity, updateQuantity] = useState(0);
  const dispatch = useDispatch();
  const chosenMaterialsList = useSelector((state)=>state.phase.chosenMaterialsList);

  const add = () => {
    updateQuantity(1);
    updateAddMode(true);
    dispatch(addMaterial({ materialExposedId: material.exposedId, quantity: 1 }));
  };

  const remove = () => {
    updateQuantity(0);
    updateAddMode(false);
    dispatch(deleteMaterial(material.exposedId));
  };

  const increment = () => {
    if(quantity==""){
        updateQuantity(1);
        dispatch(addMaterial({ materialExposedId: material.exposedId, quantity: 1 }));
    }
    else{
        const newQty = quantity + 1;
        updateQuantity(newQty);
        dispatch(updateMaterialQuantity({ materialExposedId: material.exposedId, quantity: newQty }));
    }
    
  };

  const decrement = () => {
    if (quantity!="" && quantity > 1) {
      const newQty = quantity - 1;
      updateQuantity(newQty);
      dispatch(updateMaterialQuantity({ materialExposedId: material.exposedId, quantity: newQty }));
    }
  };

  const quantityInputHandler = (quantityInput)=>{
    const newQty = Number(quantityInput);
    if(quantityInput==""){
        updateQuantity(quantityInput);
        dispatch(deleteMaterial(material.exposedId));
    }
    else if(quantityInput==0){
        updateQuantity(1)
        const exists = chosenMaterialsList.some((val)=>val.materialExposedId==material.exposedId);
        if(exists){
            dispatch(updateMaterialQuantity({ materialExposedId: material.exposedId, quantity: 1 }));
        }
        else{
           dispatch(addMaterial({ materialExposedId: material.exposedId, quantity: 1 })); 
        }
    }
    else{
        updateQuantity(newQty);
        const exists = chosenMaterialsList.some((val)=>val.materialExposedId==material.exposedId);
        if(exists){
            dispatch(updateMaterialQuantity({ materialExposedId: material.exposedId, quantity: newQty }));
        }
        else{
           dispatch(addMaterial({ materialExposedId: material.exposedId, quantity: newQty })); 
        }
    }
    
  }

  return (
    <div className="border rounded-xl shadow p-4 bg-white space-y-2">
      <div className="text-lg font-semibold text-gray-800">{material.name}</div>
      <div className="text-gray-600">
        {material.pricePerQuantity} Rs / {material.unit}
      </div>

      {!addMode ? (
        <button
          onClick={add}
          className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add
        </button>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-gray-700">Quantity:</span>
            <button onClick={decrement} className="px-2 py-1 bg-gray-200 rounded">-</button>
            {/* <span>{quantity}</span> */}
            <input type="number" min={1} value={quantity} onChange={(event)=>{quantityInputHandler(event.target.value);}} className="w-16 px-2 py-1 border border-gray-300 rounded text-center appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"/>
            <button onClick={increment} className="px-2 py-1 bg-gray-200 rounded">+</button>
            <span className="text-sm text-gray-500">{material.unit}</span>
          </div>
          <button
            onClick={remove}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
