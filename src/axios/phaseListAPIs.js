import axiosInstance from "./axiosInstance";

const BASE_URL = "/phase";


export const createPhaseApi = async (phaseRequestDTO) => {
  try{
  const res = await axiosInstance.post(`${BASE_URL}`, phaseRequestDTO);
  return res.data;}
  catch(e){
    console.log("error:",e);
    throw e;
  }
};

export const updatePhaseApi = async (id, updatedPhaseRequestDTO) => {
  const res = await axiosInstance.put(`${BASE_URL}/${id}`, updatedPhaseRequestDTO);
  return res.data;
};

export const deletePhaseApi = async (id) => {
  const res = await axiosInstance.delete(`${BASE_URL}/${id}`);
  return res.data;
};

export const getMaterialsByPhaseId = async (id) => {
  const res = await axiosInstance.get(`${BASE_URL}/materials?id=${id}`);
  return res.data;
};


export const setVendorCostApi = async (vendorId, phaseId, cost) => {
  const res = await axiosInstance.post(`${BASE_URL}/vendor/${vendorId}/phase/${phaseId}/cost?cost=${cost}`);
  return res.data;
};

