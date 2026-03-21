import { useState } from "react";
import {
  checkVehicle,
  checkMobile,
  addVehicle,
} from "../../api/services/customer/customerService";

export default function VehicleCheckTab() {
  const [vehicle, setVehicle] = useState("");
  const [mobile, setMobile] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  // 🔍 CHECK FLOW
  const handleCheck = async () => {
    setError("");
    setData(null);

    if (!vehicle) {
      setError("Vehicle number is required");
      return;
    }

    try {
      // 1️⃣ Check vehicle
      const res = await checkVehicle(vehicle);
      setData(res);
      return;
    } catch {
      // 2️⃣ Vehicle not found → check mobile
      if (!mobile) {
        setError("Vehicle not found. Enter mobile number");
        return;
      }

      try {
        const res = await checkMobile(mobile);

        setData({
          ...res,
          vehicle_not_found: true,
        });
      } catch {
        setError("Customer not found. Please register");
      }
    }
  };

  // 🚗 ADD VEHICLE
  const handleAddVehicle = async () => {
    if (!vehicleType) {
      setError("Select vehicle type");
      return;
    }

    try {
      await addVehicle({
        customer_id: data.id,
        vehicle_number: vehicle,
        vehicle_type: vehicleType,
      });

      alert("Vehicle added successfully");
    } catch {
      setError("Failed to add vehicle");
    }
  };

  return (
    <div className="card p-4">

      <h5 className="text-primary mb-3">Vehicle Check</h5>

      {/* INPUTS */}
      <div className="row">

        <div className="col-md-4 mb-3">
          <label>Vehicle Number *</label>
          <input
            className="form-control"
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value.toUpperCase())}
          />
        </div>

        <div className="col-md-4 mb-3">
          <label>Mobile Number</label>
          <input
            className="form-control"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>

        <div className="col-md-4 d-flex align-items-end mb-3">
          <button className="btn btn-primary px-4" onClick={handleCheck}>
            Check
          </button>
        </div>

      </div>

      {/* ERROR */}
      {error && <div className="text-danger small mb-2">{error}</div>}

      {/* RESULT */}
      {data && (
        <div className="card p-3 mt-3">

          <p><b>Name:</b> {data.name}</p>
          <p><b>Mobile:</b> {data.mobile}</p>

          {/* VEHICLES */}
          {data.vehicles && (
            <p>
              <b>Vehicles:</b> {data.vehicles.join(", ")}
            </p>
          )}

          {/* 🚗 ADD VEHICLE (only if not found) */}
          {data.vehicle_not_found && (
            <div className="mt-3">

              <div className="row">

                <div className="col-md-6 mb-2">
                  <label>Vehicle Type *</label>
                  <select
                    className="form-control"
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                  >
                    <option value="">Select</option>
                    <option>Two Wheeler</option>
                    <option>Three Wheeler</option>
                    <option>Four Wheeler</option>
                    <option>Heavy Vehicle</option>
                  </select>
                </div>

                <div className="col-md-6 d-flex align-items-end mb-2">
                  <button
                    className="btn btn-primary px-4"
                    onClick={handleAddVehicle}
                  >
                    Add Vehicle
                  </button>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}