import API from "../../../lib/axios";

// export const addRewardApi = async (data: {
//   customer_id: number;
//   amount: number;
//   points: number;
// }) => {
//   const res = await API.post("/api/rewards", data);
//   return res.data;
// };

// SEARCH CUSTOMER (mobile OR vehicle)
// export const searchCustomer = async (value: string) => {
//   try {
//     const res = await API.post(`/customers/search`, {
//       params: { value }
//     });

//     return res.data.data; // adjust if your backend format differs
//   } catch (err: any) {
//     throw err?.response?.data || { message: "Customer not found" };
//   }
// };


// GET REWARD RATE
export const getRewardRate = async (data: {
  vehicle_type_id: number;
  fuel_type: string;
}) => {
  try {
    const res = await API.get(`/customers/reward-rate`, {
      params: data
    });

    return res.data.data; // { rate: number }
  } catch (err: any) {
    throw err?.response?.data || { message: "Rate not found" };
  }
};


// ADD REWARD
export const addReward = async (data: {
  customer_id: number;
  vehicle_id: string;
  fuel_type: string;
  litres: number;
  rate: number;
  points: number;
}) => {
  try {
    const res = await API.post(`/customers/rewards`, data);

    return res.data;
  } catch (err: any) {
    throw err?.response?.data || { message: "Failed to add reward" };
  }
};

export const getRewardsHistory = async (params: any) => {
  try {
    const res = await API.get("/staff/rewards-history", {
      params //  this sends query params properly
    });

    return res.data;
  } catch (err: any) {
    throw err.response?.data || err;
  }
};

export const getRewardsSummary = async (search: string) => {
  try {
    const res = await API.get("staff/rewards/check", {
      params: { search }
    });

    return res.data;
  } catch (err: any) {
    throw err.response?.data || err;
  }
};