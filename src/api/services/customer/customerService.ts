import API from "../../../lib/axios";
import type { Customer} from "../../../types/customer";

/*  CHECK VEHICLE */
// export const checkVehicle = async (vehicle_number: string) => {
//   try {
//     const res = await API.post("/customers/check-vehicle", {
//       vehicle_number,
//     });

//     return res.data;
//   } catch (err: any) {
//     throw err.response?.data || { message: "Vehicle check failed" };
//   }
// };

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

export const requestCustomerUpdate = async (id: number, data: any) => {
  try {
    const res = await API.post(`/customers/${id}/request-update`, data);
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
};

const mapCustomer = (data: any): Customer => {
  return { 
    customer_id: data.customer_id || "",
    mobile: data.mobile || "",
    name: data.name || "",
    email: data.email || "",
    address: data.address || "",
    vehicles: (data.vehicles || []).map((v: any) => ({
      id: v.id,
      number: v.number,
      type: v.type,
    })),
    alternate_mobiles: data.alternate_mobiles || [],
  };
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

interface CheckCustomerStatusResponse {
  registered: boolean;
  otp_verified: boolean;
}

export const checkCustomerStatus = async (mobile: string): Promise<CheckCustomerStatusResponse> => {
  try {
    const response = await API.post("/customers/check-status", { mobile });
    return response.data;
  } catch (err: any) {
    console.error("Error checking customer status:", err);
    throw new Error(err?.response?.data?.message || "Failed to check status");
  }
};

export const searchCustomer = async (search: string): Promise<Customer> => {
  try {
    const res = await API.post(`/customers/search?search=${search}`);
    return mapCustomer(res.data);
  } catch (err: any) {
    throw err.response?.data || { message: "Customer not found" };
  }
};

export const updateCustomer = async (id: number, data: any) => {
  try {
    const response = await API.put(
      `/customers/${id}`,
      data
    );

    return response.data;

  } catch (error: any) {
    console.log("API ERROR:", error.response);

    throw error.response?.data || {
      message: "Something went wrong"
    };
  }
};

export const checkAlternateMobile = async (mobile: string) => {
  const res = await API.post("/customers/check-alternate-mobile", { mobile });
  return res.data;
};

export const sendAltOtpApi = async (mobile: string, type: string, phone: string, id: number) => {
  const res = await API.post("/customers/send-otp", {
    mobile,
    type,
    phone,
    id
  });
console.log(res);
  return res.data;
};

export const verifyPrimaryOtpApi = async (data: {
  mobile: string;
  otp: string;
}) => {
  const res = await API.post("/customers/verify-primary-otp", data);
  return res.data;
};

export const verifyAlternateOtpApi = async (data: {
  mobile: string;
  otp: string;
  customer_id: number;
}) => {
  const res = await API.post("/customers/verify-alternate-otp", data);
  return res.data;
};

export const resendOtpApi = async (mobile: string) => {
  const res = await API.post("/resend-otp", { mobile });
  return res.data;
};