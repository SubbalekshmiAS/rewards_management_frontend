import API from "../../../lib/axios";

export const checkVehicle = async (vehicleNumber: string) => {
  const res = await API.get(`/non-loyalty-users/check/${vehicleNumber}`);
  return res.data;
};

export const addNonLoyaltyUser = async (data: any) => {
  const res = await API.post('/non-loyalty-users', data);
  return res.data;
};

export const updateNonLoyaltyUser = async (id: number, data: any) => {
  const res = await API.put(`/non-loyalty-users/${id}`, data);
  return res.data;
};

// export const getNonLoyaltyHistory = async (page = 1) => {
//   const res = await API.get(`/non-loyalty-users/history?page=${page}`);
//   return res.data;
// };

export const getNonLoyaltyHistory = async (params: any) => {
  const res = await API.get('/non-loyalty-users/history', { params });
  return res.data;
};