import { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";

export default function ForgotPassword() {

  const [email, setEmail] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {

      const res = await fetch("http://127.0.0.1:8000/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      alert(data.message);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthLayout>
      <div className="d-flex justify-content-center align-items-center vh-100">

        <div className="card p-4 shadow" style={{ width: "400px" }}>

          <h3 className="mb-3">Forgot Password</h3>

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label>Email</label>

              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button className="btn btn-primary w-100">
              Send Reset Link
            </button>

          </form>

        </div>

      </div>
    </AuthLayout>
  );
}