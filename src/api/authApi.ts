import API from "../lib/axios";

export const loginApi = async (data: any) => {
 const res = await API.post("/login", data);

  // store token
  localStorage.setItem("token", res.data.token);
  // console.log('authapi');
  // console.log(res.data);

  return res.data;
  
};

export const signupApi = (data: any) => {
  return API.post("/register", data);
};