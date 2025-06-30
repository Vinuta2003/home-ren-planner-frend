import { useState } from "react";
import { useDispatch } from "react-redux";
import { addMaterial, deleteMaterial, updateMaterialQuantity } from "../app/features/phaseSlice";

export function Material(props){
    const {material} = props;
    const [addMode,updateAddMode] = useState(false)
    const [quantity,updateQuantity] = useState(0);
    const dispatch = useDispatch();

    const addButtonOnClickHandler = ()=>{
        updateQuantity(1);
        updateAddMode(true);
        dispatch(addMaterial({
            materialExposedId : material.exposedId,
            quantity : 1
        }))
    }

    const removeButtonOnClickHandler = ()=>{
        updateQuantity(0);
        updateAddMode(false);
        dispatch(deleteMaterial(material.exposedId));
    }

    const incrementButtonOnClickListener = ()=>{
        const newQuantity = quantity+1;
        updateQuantity(newQuantity);
        dispatch(updateMaterialQuantity({
            materialExposedId : material.exposedId,
            quantity : newQuantity
        }))
    }

    const decrementButtonOnClickListener = ()=>{
        if(quantity>1){
            const newQuantity = quantity-1;
            updateQuantity(newQuantity);
            dispatch(updateMaterialQuantity({
            materialExposedId : material.exposedId,
            quantity : newQuantity
        }))
        }     
    }

    if(!addMode){
        return(
        <div>
            <div><span>{material.name}</span></div>
            <div><span>{`${material.pricePerQuantity} Rs`}</span><span>/</span><span>{material.unit}</span></div>
            <div>
                <button onClick={()=>{addButtonOnClickHandler();}}>Add</button>
            </div>
        </div>
    )
    }
    else{
      return(
        <div>
            <div><span>{material.name}</span></div>
            <div><span>{`${material.pricePerQuantity} Rs`}</span><span>/</span><span>{material.unit}</span></div>
            <div>
                <span>Quantity: </span><button onClick={()=>{decrementButtonOnClickListener();}}>-</button><span>{quantity}</span><button onClick={()=>{incrementButtonOnClickListener();}}>+</button><span>{` ${material.unit}`}</span>
                <button onClick={()=>{removeButtonOnClickHandler();}}>Remove</button>
            </div>
        </div>
    )  
    }
    
}