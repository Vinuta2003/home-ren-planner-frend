import axios from "../../axios/axiosInstance";

export const getBudgetOverview = async (projectId) => {
  const res = await axios.get(`http://localhost:8080/projects/${projectId}/budget-overview`,{
  withCredentials: true
});
  return res.data;
};