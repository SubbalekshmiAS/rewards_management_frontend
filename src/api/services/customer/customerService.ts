import API from "../../../lib/axios";

/*  CHECK VEHICLE */
export const checkVehicle = async (vehicle_number: string) => {
  try {
    const res = await API.post("/customers/check-vehicle", {
      vehicle_number,
    });

    return res.data;
  } catch (err: any) {
    throw err.response?.data || { message: "Vehicle check failed" };
  }
};

/*  CHECK MOBILE */
export const checkMobile = async (mobile: string) => {
  try {
    const res = await API.post("/customers/check-mobile", {
      mobile,
    });

    return res.data;
  } catch (err: any) {
    throw err.response?.data || { message: "Mobile check failed" };
  }
};

/*  ADD VEHICLE*/
export const addVehicle = async (data: {
  customer_id: number;
  vehicle_number: string;
  vehicle_type: string;
}) => {
  try {
    const res = await API.post("/vehicles", data);
    return res.data;
  } catch (err: any) {
    throw err.response?.data || { message: "Add vehicle failed" };
  }
};

/*  REGISTER CUSTOMER*/
export const registerCustomer = async (data: any) => {
  try {
    const res = await API.post("/customers/register", data);
    return res.data;
  } catch (err: any) {
    console.error("API ERROR:", err.response);

    if (err.response?.data) {
      throw err.response.data;
    }

    throw { message: "Server not reachable" };
  }
};

/*  SEND OTP */
export const sendOtp = async (mobile: string) => {
  try {
    const res = await API.post("/customers/send-otp", { mobile });
    return res.data;
  } catch (err: any) {
    throw err.response?.data || { message: "OTP send failed" };
  }
};

/* VERIFY OTP */
export const verifyOtp = async (mobile: string, otp: string) => {
  try {
    const res = await API.post("/customers/verify-otp", {
      mobile,
      otp,
    });
    return res.data;
  } catch (err: any) {
    throw err.response?.data || { message: "OTP verification failed" };
  }
};