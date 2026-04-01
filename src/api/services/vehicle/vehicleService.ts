import API from "../../../lib/axios";

/*  CHECK VEHICLE */
export const searchVehicle = async (vehicle_number: string) => {
  try {
    const res = await API.post("/customers/check-vehicle", {
      vehicle_number,
    });

    return res.data;
  } catch (err: any) {
    throw err.response?.data || { message: "Vehicle check failed" };
  }
};