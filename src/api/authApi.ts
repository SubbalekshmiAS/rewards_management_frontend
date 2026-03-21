import API from "../lib/axios";

export const loginApi = (data: any) => {
  return API.post("/login", data);
};

export const signupApi = (data: any) => {
  return API.post("/register", data);
};