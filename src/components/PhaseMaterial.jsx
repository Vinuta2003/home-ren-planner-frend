import { useState } from "react";
import { useDispatch } from "react-redux";
import { getPhaseById, getPhaseMaterialsByPhaseId} from "../app/features/phaseSlice";
import { deletePhaseMaterial, updatePhaseMaterialQuantity } from "../app/apis/phaseApis";

export function PhaseMaterial(props){
    const {phaseMaterial} = props;
    const [editMode,updateEditMode] = useState(false);
    const [quantity,updateQuantity] = useState(phaseMaterial.quantity)
    const [totalPrice, updateTotalPrice] = useState(phaseMaterial.totalPrice)
    const dispatch = useDispatch();
    


    const editButtonOnClickHandler = ()=>{
        updateEditMode(true);
    }

    const deleteButtonOnClickHandler = async()=>{
        await deletePhaseMaterial(phaseMaterial.exposedId);

        await dispatch(getPhaseById(phaseMaterial.phaseResponse.id));

        
    }

    const incrementButtonOnClickListener = ()=>{
        const newQuantity = quantity+1;
        updateQuantity(newQuantity);
        updateTotalPrice(phaseMaterial.pricePerQuantity*newQuantity)
    }

    const decrementButtonOnClickListener = ()=>{
        if(quantity>1){
            const newQuantity = quantity-1;
            updateQuantity(newQuantity);
            updateTotalPrice(phaseMaterial.pricePerQuantity*newQuantity)
        }     
    }

    const saveButtonOnClickHandler = async ()=>{
        await updatePhaseMaterialQuantity(phaseMaterial.exposedId,quantity);

        updateEditMode(false);

        await dispatch(getPhaseById(phaseMaterial.phaseResponse.id));
       
    }

    const cancelButtonOnClickHandler = ()=>{
        updateQuantity(phaseMaterial.quantity);
        updateEditMode(false);
    }



    if(!editMode){
        return(
        <div>
            <div><span>{phaseMaterial.name}</span></div>
            <div><span>Quantity: </span><span>{phaseMaterial.quantity}</span><span>{` ${phaseMaterial.unit}`}</span></div>
            <div><span>{`Price Per Quantity : ${phaseMaterial.pricePerQuantity} Rs`}</span></div>
            <div><span>{`Total Price : ${phaseMaterial.totalPrice} Rs`}</span></div>
            <div>
                <button onClick={()=>{editButtonOnClickHandler();}}>Edit</button>
                <button onClick={()=>{deleteButtonOnClickHandler(phaseMaterial.exposedId);}}>Delete</button>
            </div>
        </div>
    )
    }
    else{
        return(
            <div>
                <div><span>{phaseMaterial.name}</span></div>
                <div><span>Quantity: </span><button onClick={()=>{decrementButtonOnClickListener();}}>-</button><span>{quantity}</span><button onClick={()=>{incrementButtonOnClickListener();}}>+</button><span>{` ${phaseMaterial.unit}`}</span></div>
                <div><span>{`Price Per Quantity : ${phaseMaterial.pricePerQuantity} Rs`}</span></div>
                <div><span>{`Total Price : ${totalPrice} Rs`}</span></div>
                <div>
                    <button onClick={()=>{saveButtonOnClickHandler();}}>Save</button>
                    <button onClick={()=>{cancelButtonOnClickHandler();}}>Cancel</button>
                </div>
            </div>
        )
        
    }
    
}