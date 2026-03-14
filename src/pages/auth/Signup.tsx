import { Link } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";

export default function Signup() {
  return (
    <AuthLayout>
      <div
        className="card shadow"
        style={{
          padding: "30px",
          borderRadius: "12px",
          width: "400px"
        }}
      >
        <h2 className="text-center mb-4">
          Sign Up
        </h2>

        <div className="mb-3">
          <label className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter name"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
          />
        </div>

        <button className="btn btn-primary w-100">
          Create Account
        </button>

        <div className="text-center mt-3">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </div>

      </div>
    </AuthLayout>
  );
}