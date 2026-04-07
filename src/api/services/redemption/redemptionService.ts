import API from "../../../lib/axios";

export const getBalance = (customerId: number) => {
  return API.get(`/redemption/balance/${customerId}`);
};

// export const redeemPoints = (data: any) => {
//   return API.post(`/redemption/redeem`, data);
// };

// export const getRedemptionHistory = (params: any) => {
//   return API.post(`/redemption/redemption-history`, { params });
// };
export const getRedemptionHistory = async (params: any) => {
  try {
    const res = await API.get("/redemption/redemption-history", {
      params //  this sends query params properly
    });

    return res.data;
  } catch (err: any) {
    throw err.response?.data || err;
  }
};

// GET REDEMPTION SUMMARY
export const getRedemptionSummary = async (search: string) => {
  const res = await API.post("/redemption/redemption-summary", {
    search
  });
  return res.data;
};

// REDEEM POINTS
export const redeemPoints = async (data: {
  customer_id: number;
  vehicle_type: number;
  points: number;
}) => {
  const res = await API.post("/redemption/redeem", data);
  return res.data;
};