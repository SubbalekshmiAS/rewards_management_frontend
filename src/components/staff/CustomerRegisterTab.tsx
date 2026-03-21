import { useState } from "react";
import {
  registerCustomer,
  verifyOtp,
  sendOtp,
} from "../../api/services/customer/customerService";

export default function CustomerRegisterTab() {

  const [form, setForm] = useState({
    mobile: "",
    name: "",
    email: "",
    address: "",
  });

  const [vehicles, setVehicles] = useState([
    { vehicle_number: "", vehicle_type_id: "" }
  ]);

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  // 🔥 OTP STATES
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // handle customer fields
  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });

    if (errors[key]) {
      setErrors({ ...errors, [key]: "" });
    }
  };

  const handleVehicleChange = (index: number, key: string, value: string) => {
    const updated = [...vehicles];

    if (key === "vehicle_number") {
      value = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    }

    updated[index][key] = value;
    setVehicles(updated);

    if (errors[`vehicle_number_${index}`]) {
      setErrors({ ...errors, [`vehicle_number_${index}`]: "" });
    }

    if (errors[`vehicle_type_${index}`]) {
      setErrors({ ...errors, [`vehicle_type_${index}`]: "" });
    }
  };

  const addVehicleRow = () => {
    setVehicles([...vehicles, { vehicle_number: "", vehicle_type_id: "" }]);
  };

  const removeVehicleRow = (index: number) => {
    if (vehicles.length === 1) return;
    setVehicles(vehicles.filter((_, i) => i !== index));
  };

  // ✅ VALIDATION
  const validate = () => {
    let newErrors: any = {};

    if (!form.mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      newErrors.mobile = "Enter valid mobile number";
    }

    vehicles.forEach((v, i) => {
      if (!v.vehicle_number) {
        newErrors[`vehicle_number_${i}`] = "Vehicle number is required";
      } else if (!/^[A-Z0-9]{6,12}$/.test(v.vehicle_number)) {
        newErrors[`vehicle_number_${i}`] = "Enter valid vehicle number";
      }

      if (!v.vehicle_type_id) {
        newErrors[`vehicle_type_${i}`] = "Select vehicle type";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔥 REGISTER
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await registerCustomer({
        ...form,
        vehicles
      });

      // ✅ OPEN OTP MODAL (NO ALERT)
      setShowOtpModal(true);
      setSuccessMessage("");

    } catch (err: any) {
    console.error("FULL ERROR:", err);

    if (err?.errors) {
      setErrors(err.errors); // Laravel validation
    } else if (err?.message) {
      alert(err.message);
    } else {
      alert("Unknown error");
    }
  } finally {
      setLoading(false);
    }
  };

  // 🔥 VERIFY OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      setOtpError("Enter OTP");
      return;
    }

    try {
      setOtpLoading(true);

      interface VerifyOtpResponse {
      message: string;
    }

      const res: VerifyOtpResponse = await verifyOtp(form.mobile, otp);

      setSuccessMessage(res.message || "Customer verified successfully");
      setTimeout(() => setSuccessMessage(""), 3000);

      setShowOtpModal(false);

      // reset form ONLY after success
      setForm({
        mobile: "",
        name: "",
        email: "",
        address: "",
      });

      setVehicles([{ vehicle_number: "", vehicle_type_id: "" }]);
      setOtp("");
      setErrors({});

    } catch (err: any) {
      setOtpError(err.message || "Invalid OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="card p-4">

      <h5 className="mb-3 page-heading">Register New Customer</h5>

      {/* UPDATED: Display success message */}
      {successMessage && (
        <div className="text-success mb-2">
          {successMessage}
        </div>
      )}
      

      <div className="row">

        <div className="col-md-6 mb-3">
          <label>Mobile Number *</label>
          <input
            className={`form-control ${errors.mobile ? "is-invalid" : ""}`}
            value={form.mobile}
            onChange={(e) => handleChange("mobile", e.target.value)}
          />
          {errors.mobile && (
            <small className="text-danger">{errors.mobile}</small>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label>Name</label>
          <input
            className="form-control"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>Email</label>
          <input
            className="form-control"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>Address</label>
          <textarea
            className="form-control"
            rows={2}
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </div>

      </div>

      <hr />
      <h6 className="mb-3">Vehicles *</h6>

      {vehicles.map((v, i) => (
        <div className="row mb-2" key={i}>

          <div className="col-md-5">
            <input
              className={`form-control ${errors[`vehicle_number_${i}`] ? "is-invalid" : ""}`}
              placeholder="Vehicle Number *"
              value={v.vehicle_number}
              onChange={(e) =>
                handleVehicleChange(i, "vehicle_number", e.target.value)
              }
            />
            {errors[`vehicle_number_${i}`] && (
              <small className="text-danger">
                {errors[`vehicle_number_${i}`]}
              </small>
            )}
          </div>

          <div className="col-md-5">
            <select
              className={`form-control ${errors[`vehicle_type_${i}`] ? "is-invalid" : ""}`}
              value={v.vehicle_type_id}
              onChange={(e) =>
                handleVehicleChange(i, "vehicle_type_id", e.target.value)
              }
            >
              <option value="">Select Type *</option>
              <option value="1">Bike / Scooter</option>
              <option value="2">Auto (3 Wheeler)</option>
              <option value="3">Car / Jeep</option>
              <option value="4">Light Commercial (LCV)</option>
              <option value="5">Heavy Commercial (HCV)</option>
            </select>

            {errors[`vehicle_type_${i}`] && (
              <small className="text-danger">
                {errors[`vehicle_type_${i}`]}
              </small>
            )}
          </div>

          <div className="col-md-2 d-flex align-items-center">
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => removeVehicleRow(i)}
            >
              Remove
            </button>
          </div>

        </div>
      ))}

      <div className="mt-2 d-flex">
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={addVehicleRow}
        >
          + Add Vehicle
        </button>
      </div>

      <div className="mt-3">
        <button
          className="btn btn-primary px-4"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Processing..." : "Register & Send OTP"}
        </button>
      </div>

      {/* 🔥 OTP MODAL */}
      {showOtpModal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">

              <h6>Enter OTP</h6>

              <input
                className={`form-control mb-2 ${otpError ? "is-invalid" : ""}`}
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setOtpError("");
                }}
              />

              {otpError && (
                <small className="text-danger">{otpError}</small>
              )}

              <div className="d-flex justify-content-end gap-2 mt-3">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowOtpModal(false)}
                >
                  Close
                </button>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleVerifyOtp}
                  disabled={otpLoading}
                >
                  {otpLoading ? "Verifying..." : "Verify"}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}