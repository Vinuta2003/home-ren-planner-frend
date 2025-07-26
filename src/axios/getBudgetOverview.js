import axios from "./axiosInstance";

export const getBudgetOverview = async (projectId) => {
  const res = await axios.get(`http://localhost:8080/api/projects/${projectId}/budget-overview`,{
  withCredentials: true
});
  return res.data;
};