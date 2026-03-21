import { useState } from "react";

export default function CustomerEditTab() {
  const [search, setSearch] = useState("");
  const [customer, setCustomer] = useState<any>(null);

  const [form, setForm] = useState({
    mobile: "",
    name: "",
    email: "",
    address: "",
    alternate_mobile: "",
  });

  const [vehicles, setVehicles] = useState<any[]>([]);
  const [alternateMobiles, setAlternateMobiles] = useState<string[]>([""]);

  const [errors, setErrors] = useState<any>({});

  const [vehicleRequests, setVehicleRequests] = useState<number[]>([]);
  const [vehicleDeleteRequests, setVehicleDeleteRequests] = useState<number[]>([]);
  const [altRequests, setAltRequests] = useState<number[]>([]);
  const [altDeleteRequests, setAltDeleteRequests] = useState<number[]>([]);

  const [newVehicle, setNewVehicle] = useState({
    number: "",
    type: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [editField, setEditField] = useState("");
  const [editValue, setEditValue] = useState("");
  const [currentVehicleId, setCurrentVehicleId] = useState<number | null>(null);
  const [currentAltIndex, setCurrentAltIndex] = useState<number | null>(null);

  // SEARCH
  const handleSearch = () => {
    if (!search) {
      setErrors({ search: "Enter vehicle number or mobile" });
      return;
    }

    const mockData = {
      mobile: "9876543210",
      name: "Arun",
      email: "arun@gmail.com",
      address: "Chennai",
      alternate_mobile: "",
      alternate_mobiles: ["9999999999"],
      vehicles: [
        { id: 1, number: "TN01AB1234", type: "Car / Jeep" },
        { id: 2, number: "TN02XY5678", type: "Bike / Scooter" },
      ],
    };

    setCustomer(mockData);
    setForm(mockData);
    setVehicles(mockData.vehicles);
    setAlternateMobiles(mockData.alternate_mobiles);
    setErrors({});
  };

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  // REMOVE EMPTY ALT FIELD
  const removeAltField = (i: number) => {
    const arr = alternateMobiles.filter((_, index) => index !== i);
    setAlternateMobiles(arr);
  };

  const openEditModal = (
    field: string,
    value: string,
    vehicleId?: number,
    altIndex?: number
  ) => {
    setEditField(field);
    setEditValue(value);
    setCurrentVehicleId(vehicleId || null);
    setCurrentAltIndex(altIndex ?? null);
    setShowModal(true);
  };

  const handleRequestSubmit = () => {
    if (!editValue) return alert("Value required");

    if (editField === "vehicle" && currentVehicleId) {
      setVehicleRequests([...vehicleRequests, currentVehicleId]);
    }

    if (editField === "alternate_mobile" && currentAltIndex !== null) {
      setAltRequests([...altRequests, currentAltIndex]);
    }

    setShowModal(false);
  };

  const handleVehicleDeleteRequest = (id: number) => {
    if (!vehicleDeleteRequests.includes(id)) {
      setVehicleDeleteRequests([...vehicleDeleteRequests, id]);
    }
  };

  const removeVehicleDeleteRequest = (id: number) => {
    setVehicleDeleteRequests(vehicleDeleteRequests.filter((v) => v !== id));
  };

  const removeVehicleEditRequest = (id: number) => {
    setVehicleRequests(vehicleRequests.filter((v) => v !== id));
  };

  const addAlternateMobile = () => {
    setAlternateMobiles([...alternateMobiles, ""]);
  };

  const handleAltChange = (i: number, val: string) => {
    const arr = [...alternateMobiles];
    arr[i] = val;
    setAlternateMobiles(arr);
  };

  const handleAltDeleteRequest = (i: number) => {
    if (!altDeleteRequests.includes(i)) {
      setAltDeleteRequests([...altDeleteRequests, i]);
    }
  };

  const removeAltDeleteRequest = (i: number) => {
    setAltDeleteRequests(altDeleteRequests.filter((x) => x !== i));
  };

  const removeAltEditRequest = (i: number) => {
    setAltRequests(altRequests.filter((x) => x !== i));
  };

  const handleAddVehicle = () => {
    if (!newVehicle.number || !newVehicle.type) {
      alert("Enter vehicle details");
      return;
    }

    setVehicles([
      ...vehicles,
      {
        id: Date.now(),
        number: newVehicle.number.toUpperCase(),
        type: newVehicle.type,
      },
    ]);

    setNewVehicle({ number: "", type: "" });
  };

  const handleUpdate = () => {
    let newErrors: any = {};

    if (!form.name) newErrors.name = "Name required";
    if (!form.email) newErrors.email = "Email required";
    if (!form.address) newErrors.address = "Address required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    alert("Customer updated");
  };

  return (
    <div className="card p-4">
      <h5 className="mb-3 text-primary">Edit Customer</h5>

      {/* SEARCH */}
      <div className="row mb-4">
        <div className="col-md-8">
          <input
            className={`form-control ${errors.search ? "is-invalid" : ""}`}
            placeholder="Enter Vehicle Number or Mobile"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-4 d-flex align-items-end">
          <button className="btn btn-primary px-4" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {!customer && (
        <p className="text-muted">Search customer to edit details</p>
      )}

      {customer && (
        <>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label>Mobile</label>
              <div className="d-flex">
                <input className="form-control me-2" value={form.mobile} disabled />
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => openEditModal("mobile", form.mobile)}
                >
                  Edit
                </button>
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <label>Name</label>
              <input
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Email</label>
              <input
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Address</label>
              <textarea
                className={`form-control ${errors.address ? "is-invalid" : ""}`}
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>
          </div>

          {/* ALT MOBILES */}
          <hr />
          <h6>Alternate Mobiles</h6>

          {alternateMobiles.map((mob, i) => (
            <div className="row mb-2" key={i}>

              <div className="col-md-6 d-flex">
                <input
                  className="form-control me-2"
                  value={mob}
                  onChange={(e) => handleAltChange(i, e.target.value)}
                />

                <button
                  className="btn btn-outline-primary btn-sm me-2"
                  onClick={() =>
                    openEditModal("alternate_mobile", mob, undefined, i)
                  }
                >
                  Edit
                </button>

                {!mob ? (
                  <button
                    className="btn btn-outline-danger btn-sm me-2"
                    onClick={() => removeAltField(i)}
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-danger btn-sm me-2"
                    onClick={() => handleAltDeleteRequest(i)}
                  >
                    Delete
                  </button>
                )}

                {/* remove buttons */}
                {altRequests.includes(i) && (
                  <button
                    className="btn btn-outline-secondary btn-sm me-2"
                    onClick={() => removeAltEditRequest(i)}
                  >
                    Remove Edit Req
                  </button>
                )}

                {altDeleteRequests.includes(i) && (
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => removeAltDeleteRequest(i)}
                  >
                    Remove Delete Req
                  </button>
                )}
              </div>

            </div>
          ))}

          <div className="d-inline-block mb-3">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={addAlternateMobile}
            >
              + Add Alternate Mobile
            </button>
          </div>

          {/* VEHICLES */}
          <h6>Vehicles</h6>

          {vehicles.map((v) => (
            <div className="d-flex mb-2" key={v.id}>
              <input
                className="form-control me-2"
                style={{ maxWidth: "160px" }}
                value={v.number}
                disabled
              />
              <input
                className="form-control me-2"
                style={{ maxWidth: "140px" }}
                value={v.type}
                disabled
              />

              <button
                className="btn btn-outline-primary btn-sm me-2"
                onClick={() => openEditModal("vehicle", v.number, v.id)}
              >
                Edit
              </button>

              <button
                className="btn btn-outline-danger btn-sm me-2"
                onClick={() => handleVehicleDeleteRequest(v.id)}
              >
                Delete
              </button>

              {vehicleRequests.includes(v.id) && (
                <button
                  className="btn btn-outline-secondary btn-sm me-2"
                  onClick={() => removeVehicleEditRequest(v.id)}
                >
                  Remove Edit Req
                </button>
              )}

              {vehicleDeleteRequests.includes(v.id) && (
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => removeVehicleDeleteRequest(v.id)}
                >
                  Remove Delete Req
                </button>
              )}
            </div>
          ))}

          {/* ADD VEHICLE */}
          <div className="d-flex mt-2">
            <input
              className="form-control me-2"
              placeholder="Vehicle Number"
              value={newVehicle.number}
              onChange={(e) =>
                setNewVehicle({ ...newVehicle, number: e.target.value })
              }
            />

            <select
              className="form-control me-2"
              value={newVehicle.type}
              onChange={(e) =>
                setNewVehicle({ ...newVehicle, type: e.target.value })
              }
            >
              <option value="">Type</option>
              <option>Bike</option>
              <option>Car</option>
              <option>Auto</option>
              <option>Heavy</option>
            </select>

            <button className="btn btn-primary btn-sm" onClick={handleAddVehicle}>
              Add
            </button>
          </div>

          <div className="mt-3">
            <button className="btn btn-primary px-4" onClick={handleUpdate}>
              Update
            </button>
          </div>
        </>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h6>Edit {editField}</h6>

              <input
                className="form-control mb-3"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value.toUpperCase())}
              />

              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleRequestSubmit}
                >
                  Request Change
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}