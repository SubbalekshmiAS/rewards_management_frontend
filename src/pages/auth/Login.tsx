import { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import { loginService } from "../../api/services/authService";
import "../../styles/auth.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login(){

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [errors,setErrors] = useState<any>({});
  const navigate = useNavigate();

  useEffect(()=>{
    if(Object.keys(errors).length > 0){
      const timer = setTimeout(()=>{
        setErrors({});
      },4000);

      return ()=>clearTimeout(timer);
    }
  },[errors]);

  const handleSubmit = async (e:any)=>{

    e.preventDefault();
    setErrors({});

    const result = await loginService(email,password);

    if(!result.success){
      setErrors(result.errors);
      return;
    }

    // save token
    localStorage.setItem("token", result.data.token);
    localStorage.setItem("user", JSON.stringify(result.data.user));

    // redirect
   const user = result.data.user;

    if (user.role === "staff") {
      navigate("/staff/dashboard");
    } else if (user.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/customer/dashboard");
    }

    console.log(result.data);

    //alert("Login successful");

  };

  return(

    <AuthLayout>

      <form
        className="card shadow login-card"
        onSubmit={handleSubmit}
        noValidate
      >

        <h2 className="text-center mb-4">
          Sign In
        </h2>

        {errors?.general && (
          <div className="login-error mb-3 text-center">
            {errors.general[0]}
          </div>
        )}
        <div className="mb-3">

          <label className="form-label">
            Email address
          </label>

          <input
            type="text"
            className="form-control"
            placeholder="Enter email"
            value={email}
            onChange={(e)=>{
              setEmail(e.target.value);
              setErrors({...errors,email:null});
            }}
          />

          {errors?.email && (
            <div className="login-error">
              {errors.email[0]}
            </div>
          )}

        </div>

        <div className="mb-3">

          <label className="form-label">
            Password
          </label>

          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            value={password}
            onChange={(e)=>{
              setPassword(e.target.value);
              setErrors({...errors,password:null});
            }}
          />

          {errors?.password && (
            <div className="login-error">
              {errors.password[0]}
            </div>
          )}

        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
        >
          Login
        </button>

      </form>

    </AuthLayout>

  );

}