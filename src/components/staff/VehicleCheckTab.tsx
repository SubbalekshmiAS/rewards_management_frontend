import { useState } from "react";
import { searchCustomer } from "../../api/services/customer/customerService";
import { vehicleTypeMap } from "../../constants/vehicleTypes";

export default function VehicleCheckTab() {

  const [search, setSearch] = useState("");
  const [customer, setCustomer] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");
    setCustomer(null);

    if (!search) {
      setError("Enter vehicle or mobile");
      return;
    }

    const value = search.trim().toUpperCase();

    const isMobile = /^[6-9]\d{9}$/.test(value);
    const isVehicle = /^[A-Z0-9]{6,12}$/.test(value);

    if (!isMobile && !isVehicle) {
      setError("Enter valid mobile (10 digits) or vehicle number");
      return;
    }

    try {
      const res = await searchCustomer(value);
      setCustomer(res);
    } catch (err: any) {
      setError(err?.message || "Customer not found");
    }
  };

  return (
    <div className="card p-3 p-md-4">

      <h5 className="text-primary mb-3">Vehicle Check</h5>

      {/* SEARCH */}
      <div className="row mb-3">

        <div className="col-12 col-md-8 mb-2 mb-md-0">
          <input
            className={`form-control ${error ? "is-invalid" : ""}`}
            placeholder="Enter vehicle number or mobile"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-12 col-md-4 d-flex align-items-end">
          <button
            className="btn btn-primary w-100 w-md-auto"
            onClick={handleSearch}
          >
            Check
          </button>
        </div>

      </div>

      {/* ERROR */}
      {error && <div className="text-danger mb-2">{error}</div>}

      {/* RESULT */}
      {customer && (
        <div className="card p-3 mt-3">

          <h6 className="mb-3">Customer Details</h6>

          <div className="row">

            <div className="col-12 col-md-6 mb-2">
              <label>Mobile</label>
              <input className="form-control" value={customer.mobile} disabled />
            </div>

            <div className="col-12 col-md-6 mb-2">
              <label>Name</label>
              <input className="form-control" value={customer.name || ""} disabled />
            </div>

            <div className="col-12 col-md-6 mb-2">
              <label>Email</label>
              <input className="form-control" value={customer.email || ""} disabled />
            </div>

            <div className="col-12 col-md-6 mb-2">
              <label>Address</label>
              <input className="form-control" value={customer.address || ""} disabled />
            </div>

          </div>

          {/* VEHICLES */}
          <hr />
          <h6>Vehicles</h6>

          {customer.vehicles?.length === 0 && (
            <p className="text-muted">No vehicles</p>
          )}

          {customer.vehicles?.map((v: any) => (
            <div
              key={v.id}
              className="d-flex flex-column flex-md-row gap-2 mb-2"
            >
              <input
                className="form-control"
                value={v.number}
                disabled
              />
              <input
                className="form-control"
                value={vehicleTypeMap[v.type] || "Unknown"}
                disabled
              />
            </div>
          ))}

          {/* ALTERNATE MOBILES */}
          <hr />
          <h6>Alternate Mobiles</h6>

          {(!customer.alternate_mobiles || customer.alternate_mobiles.length === 0) && (
            <p className="text-muted">No alternate numbers</p>
          )}

          {customer.alternate_mobiles?.map((alt: any) => (
            <div
              key={alt.id}
              className="d-flex flex-column flex-md-row gap-2 mb-2 align-items-md-center"
            >
              <input
                className="form-control"
                value={alt.mobile}
                disabled
              />

              <span
                className={`badge ${
                  alt.is_active ? "bg-success" : "bg-warning"
                }`}
              >
                {alt.status}
              </span>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}