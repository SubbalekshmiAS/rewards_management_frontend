import API from "./authApi"; // reuse same axios instance

// Check vehicle
export const checkVehicleApi = (vehicle: string) => {
  return API.get(`/customers/check-vehicle`, {
    params: { vehicle_number: vehicle },
  });
};

// Check mobile
export const checkMobileApi = (mobile: string) => {
  return API.get(`/customers/check-mobile`, {
    params: { mobile },
  });
};

// Add vehicle
export const addVehicleApi = (data: any) => {
  return API.post(`/vehicles`, data);
};