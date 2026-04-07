import API from "../../../lib/axios";

export const getStaffDashboard = async () => {
  const res = await API.get("/staff/dashboard");
  return res.data;
};