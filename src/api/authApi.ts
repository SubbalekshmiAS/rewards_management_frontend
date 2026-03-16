import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
  headers:{
    //"Content-Type":"application/json",
    "Accept":"application/json"
  }
});

export const loginApi = (data:any) => {
  return API.post("/login",data);
};

export const signupApi = (data:any) => {
  return API.post("/register",data);
};