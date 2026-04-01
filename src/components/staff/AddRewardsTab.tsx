import { useState, useEffect } from "react";
import {
  getRewardRate,
  addReward
} from "../../api/services/reward/rewardService";
import {
  searchCustomer,
} from "../../api/services/customer/customerService";

export default function AddRewardsTab() {

  const [search, setSearch] = useState("");
  const [customer, setCustomer] = useState<any>(null);

  const [vehicleId, setVehicleId] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [litres, setLitres] = useState("");

  const [rate, setRate] = useState<number>(0);
  const [points, setPoints] = useState<number>(0);

  const [errors, setErrors] = useState<any>({});
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (success) {
        const timer = setTimeout(() => {
        setSuccess("");
        }, 3000);

        return () => clearTimeout(timer);
    }
    }, [success]);

  // 🔍 SEARCH
  const handleSearch = async () => {
    setErrors({});
    setCustomer(null);

    if (!search) {
      setErrors({ search: "Enter mobile or vehicle number" });
      return;
    }

    try {
      const res = await searchCustomer(search);
      setCustomer(res);
    } catch (err: any) {
      setErrors({ search: err.message || "Customer not found" });
    }
  };

  // ✅ FETCH RATE (ONLY WHEN vehicle + fuel changes)
  useEffect(() => {
    const fetchRate = async () => {
      setRate(0);
      setPoints(0);

      if (!vehicleId || !fuelType) return;

      try {
        const vehicle = customer.vehicles.find(
          (v: any) => v.id === Number(vehicleId)
        );

        if (!vehicle) return;

        const res = await getRewardRate({
          vehicle_type_id: vehicle.type,
          fuel_type: fuelType
        });

        setRate(Number(res.rate));

      } catch {
        setErrors((prev: any) => ({
          ...prev,
          rate: "Rate not found"
        }));
      }
    };

    if (customer) {
      fetchRate();
    }

  }, [vehicleId, fuelType]);

  // ✅ CALCULATE POINTS (NO API)
  useEffect(() => {
    if (!litres || Number(litres) <= 0) {
      setPoints(0);
      return;
    }

    setPoints(Number(litres) * rate);

  }, [litres, rate]);

  // ➕ SUBMIT
  const handleSubmit = async () => {
    let newErrors: any = {};

    if (!customer) newErrors.customer = "Search customer first";
    if (!vehicleId) newErrors.vehicleId = "Select vehicle";
    if (!fuelType) newErrors.fuelType = "Select fuel type";

    if (!litres) {
      newErrors.litres = "Enter litres";
    } else if (Number(litres) <= 0) {
      newErrors.litres = "Litres must be greater than 0";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      await addReward({
        customer_id: customer.customer_id,
        vehicle_id: vehicleId,
        fuel_type: fuelType,
        litres: Number(litres),
        rate,
        points
      });

      setSuccess("Reward added successfully");

      // RESET
      setVehicleId("");
      setFuelType("");
      setLitres("");
      setRate(0);
      setPoints(0);
      setErrors({});

    } catch (err: any) {
      setErrors({
        general: err.message || "Failed to add reward"
      });
    }
  };

  return (
    <div className="card p-3">

      <h6 className="mb-3 text-primary">Add Rewards</h6>

      {/* SEARCH */}
      <div className="row mb-3">
        <div className="col-md-8 col-12 mb-2">
          <input
            className={`form-control ${errors.search ? "is-invalid" : ""}`}
            placeholder="Enter Mobile / Vehicle"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value.toUpperCase());
              setErrors((prev: any) => ({ ...prev, search: "" }));
            }}
          />
          {errors.search && (
            <small className="text-danger">{errors.search}</small>
          )}
        </div>

        <div className="col-md-4 col-12">
          <button className="btn btn-primary w-100" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {success && (
        <div className="alert alert-success py-2 mb-2">
            {success}
        </div>
        )}

      {/* CUSTOMER */}
      {customer && (
        <div className="card p-3 mb-3 bg-light">
          <p><b>Name:</b> {customer.name}</p>
          <p><b>Mobile:</b> {customer.mobile}</p>
        </div>
      )}

      {/* FORM */}
      {customer && (
        <div className="row">

          {/* VEHICLE */}
          <div className="col-md-4 col-12 mb-3">
            <label>Vehicle *</label>
            <select
              className={`form-control ${errors.vehicleId ? "is-invalid" : ""}`}
              value={vehicleId}
              onChange={(e) => {
                setVehicleId(e.target.value);
                setErrors((prev: any) => ({ ...prev, vehicleId: "" }));
              }}
            >
              <option value="">Select</option>
              {customer.vehicles.map((v: any) => (
                <option key={v.id} value={v.id}>
                  {v.number}
                </option>
              ))}
            </select>
            {errors.vehicleId && (
              <small className="text-danger">{errors.vehicleId}</small>
            )}
          </div>

          {/* FUEL */}
          <div className="col-md-4 col-12 mb-3">
            <label>Fuel Type *</label>
            <select
              className={`form-control ${errors.fuelType ? "is-invalid" : ""}`}
              value={fuelType}
              onChange={(e) => {
                setFuelType(e.target.value);
                setErrors((prev: any) => ({ ...prev, fuelType: "" }));
              }}
            >
              <option value="">Select</option>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
            </select>
            {errors.fuelType && (
              <small className="text-danger">{errors.fuelType}</small>
            )}
          </div>

          {/* LITRES */}
          <div className="col-md-4 col-12 mb-3">
            <label>Litres *</label>
            <input
              type="number"
              className={`form-control ${errors.litres ? "is-invalid" : ""}`}
              value={litres}
              onChange={(e) => {
                setLitres(e.target.value);
                setErrors((prev: any) => ({ ...prev, litres: "" }));
              }}
            />
            {errors.litres && (
              <small className="text-danger">{errors.litres}</small>
            )}
          </div>

          {/* RATE */}
          <div className="col-md-6 col-12 mb-3">
            <label>Rate</label>
            <input className="form-control" value={rate} disabled />
          </div>

          {/* POINTS */}
          <div className="col-md-6 col-12 mb-3">
            <label>Reward Points</label>
            <input className="form-control" value={points} disabled />
          </div>

          {/* BUTTON */}
          <div className="col-12">
            <button
              className="btn btn-primary w-100"
              onClick={handleSubmit}
            >
              Add Reward
            </button>
          </div>

        </div>
      )}

    </div>
  );
}