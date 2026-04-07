import { useState, useEffect } from "react";
import {
  checkVehicle,
  addNonLoyaltyUser,
} from "../../api/services/nonloyalty/nonLoyaltyService";

import {
  vehicleTypeOptions,
  vehicleTypeMap,
} from "../../constants/vehicleTypes";

export default function NonLoyaltyAddTab() {
  const [vehicleNumber, setVehicleNumber] = useState("");

  const [vehicleType, setVehicleType] = useState<number | "">("");
  const [fuelType, setFuelType] = useState("petrol");
  const [litres, setLitres] = useState("");
  const [amount, setAmount] = useState("");

  const [existing, setExisting] = useState<any>(null);

  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<
    "error" | "success" | "info" | null
  >(null);

  const [loading, setLoading] = useState(false);

  // ✅ AUTO CLEAR MESSAGE
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  // 🔍 CHECK VEHICLE
  const handleCheckVehicle = async () => {
    if (!vehicleNumber) {
      setMessage("Enter vehicle number");
      setMessageType("error");
      return;
    }

    try {
      const res = await checkVehicle(vehicleNumber);

      if (res.exists) {
        const log = res.data;

        setExisting(log);
        setVehicleType(log.vehicle_type);
        setFuelType(log.fuel_type);

        setMessage(
          `Existing vehicle → ${vehicleTypeMap[log.vehicle_type]}`
        );
        setMessageType("info");
      } else {
        setExisting(null);
        setVehicleType("");
        setFuelType("petrol");

        setMessage("New vehicle. Enter details");
        setMessageType("info");
      }
    } catch (err: any) {
      console.error(err);
      setMessage("Error checking vehicle");
      setMessageType("error");
    }
  };

  // ➕ SUBMIT
  const handleSubmit = async () => {
    if (!vehicleNumber || !vehicleType || !fuelType || !litres || !amount) {
      setMessage("All fields are required");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      await addNonLoyaltyUser({
        vehicle_number: vehicleNumber,
        vehicle_type: Number(vehicleType),
        fuel_type: fuelType,
        litres: parseFloat(litres),
        amount: parseFloat(amount),
      });

      setMessage("Saved successfully");
      setMessageType("success");

      // ✅ RESET FORM (but keep vehicle if existing)
      setLitres("");
      setAmount("");

      if (!existing) {
        setVehicleNumber("");
        setVehicleType("");
        setFuelType("petrol");
      }
    } catch (err: any) {
      console.error(err);
      setMessage(err?.response?.data?.message || "Error saving");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      {/* 🔥 MESSAGE BOX */}
      {message && (
        <div
          className={`mb-3 alert ${
            messageType === "error"
              ? "alert-danger"
              : messageType === "success"
              ? "alert-success"
              : "alert-info"
          }`}
        >
          {message}
        </div>
      )}

      {/* VEHICLE SEARCH */}
      <div className="mb-3 d-flex">
        <input
          className="form-control me-2"
          placeholder="Enter vehicle number"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleCheckVehicle}>
          Search
        </button>
      </div>

      {/* VEHICLE TYPE */}
      <div className="mb-2">
        <select
          className="form-control"
          value={vehicleType}
          onChange={(e) => setVehicleType(Number(e.target.value))}
          disabled={!!existing}
        >
          <option value="">Select vehicle type</option>
          {vehicleTypeOptions.map((v) => (
            <option key={v.value} value={v.value}>
              {v.label}
            </option>
          ))}
        </select>
      </div>

      {/* FUEL TYPE */}
      <div className="mb-2">
        <select
          className="form-control"
          value={fuelType}
          onChange={(e) => setFuelType(e.target.value)}
        >
          <option value="petrol">Petrol</option>
          <option value="diesel">Diesel</option>
        </select>
      </div>

      {/* LITRES */}
      <div className="mb-2">
        <input
          type="number"
          className="form-control"
          placeholder="Litres"
          value={litres}
          onChange={(e) => setLitres(e.target.value)}
        />
      </div>

      {/* AMOUNT */}
      <div className="mb-2">
        <input
          type="number"
          className="form-control"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      {/* SUBMIT */}
      <button
        className="btn btn-primary"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Saving..." : "Submit"}
      </button>
    </div>
  );
}