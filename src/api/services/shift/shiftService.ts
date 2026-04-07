import API from "../../../lib/axios";

export const startShift = async () => {
  const res = await API.post("/shift/start");
  return res.data;
};

export const endShift = async () => {
  const res = await API.post("/shift/end");
  return res.data;
};

export const getCurrentShift = async () => {
  const res = await API.get("/shift/current");
  return res.data;
};

export const getShiftSummary = async () => {
  const res = await API.get("/shift/summary");
  return res.data;
};

export const getShiftHistory = async (params: any) => {
  const res = await API.get("/shift/shift-history", {
    params: {
      page: params.page,
      from: params.from,   // ✅ match backend
      to: params.to        // ✅ match backend
    }
  });

  return res.data; // keep this
};
