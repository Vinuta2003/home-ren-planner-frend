import axios from "axios";

const BASE_URL = "http://localhost:8080/phase";

export const fetchPhaseById = async (id) => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

export const fetchPhasesByProject = async (projectId) => {
  const res = await axios.get(`${BASE_URL}/project/${projectId}`);
  return res.data;
};

export const createPhaseApi = async (phaseRequestDTO) => {
  const res = await axios.post(`${BASE_URL}`, phaseRequestDTO);
  return res.data;
};

export const updatePhaseApi = async (id, updatedPhaseRequestDTO) => {
  const res = await axios.put(`${BASE_URL}/${id}`, updatedPhaseRequestDTO);
  return res.data;
};

export const deletePhaseApi = async (id) => {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data;
};

export const getMaterialsByPhaseId = async (id) => {
  const res = await axios.get(`${BASE_URL}/materials?id=${id}`);
  return res.data;
};

export const getTotalCost = async (id) => {
  const res = await axios.get(`${BASE_URL}/${id}/total-cost`);
  return res.data;
};

export const setVendorCostApi = async (vendorId, phaseId, cost) => {
  const res = await axios.post(`${BASE_URL}/vendor/${vendorId}/phase/${phaseId}/cost?cost=${cost}`);
  return res.data;
};

export const getPhasesByRenovationTypeApi = async (type) => {
  const res = await axios.get(`${BASE_URL}/phases/by-renovation-type/${type}`);
  return res.data;
};
