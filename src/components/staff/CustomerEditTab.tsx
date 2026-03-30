import { useState } from "react";
import {
  searchCustomer,
  requestCustomerUpdate,
  sendAltOtpApi
} from "../../api/services/customer/customerService";
import type { Customer, Vehicle, AlternateMobile } from "../../types/customer";
import { vehicleTypeOptions, vehicleTypeMap } from "../../constants/vehicleTypes";

export default function CustomerEditTab() {
  const [search, setSearch] = useState("");
  const [mobile, setMobile] = useState("");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);


  const [form, setForm] = useState({
    mobile: "",
    name: "",
    email: "",
    address: "",
    alternate_mobile: "",
  });

  //const [alternateMobiles, setAlternateMobiles] = useState<string[]>([]);
  const [alternateMobiles, setAlternateMobiles] = useState<AlternateMobile[]>([]);

  const [errors, setErrors] = useState<any>({});

  const [vehicleRequests, setVehicleRequests] = useState<number[]>([]);
  const [vehicleDeleteRequests, setVehicleDeleteRequests] = useState<number[]>([]);
  const [altRequests, setAltRequests] = useState<number[]>([]);
  const [altDeleteRequests, setAltDeleteRequests] = useState<number[]>([]);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpAltIndex, setOtpAltIndex] = useState<number | null>(null);

  const [newVehicle, setNewVehicle] = useState({
    number: "",
    type: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [editField, setEditField] = useState("");
  const [editValue, setEditValue] = useState("");
  const [currentVehicleId, setCurrentVehicleId] = useState<number | null>(null);
  const [currentAltIndex, setCurrentAltIndex] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  // SEARCH
  const handleSearch = async () => {
    if (!search) {
      setErrors({ search: "Enter mobile or vehicle number" });
      return;
    }

    const isMobile = /^[6-9]\d{9}$/.test(search);
    const isVehicle = /^[A-Z0-9]{6,12}$/.test(search.toUpperCase());

    if (!isMobile && !isVehicle) {
      setErrors({
        search: "Enter valid mobile (10 digits) or vehicle number"
      });
      return;
    }

    try {
      const res = await searchCustomer(search); // API call
      setCustomer(res);
      setAlternateMobiles(
        (res.alternate_mobiles || []).map((m: any) => ({
          id: m.id,
          mobile: m.mobile,
          vehicles: m.vehicles || [],
          verified: m.verified || false,
          otpSent: false
        }))
      );
      setForm({
        mobile: res.mobile || "",
        name: res.name || "",
        email: res.email || "",
        address: res.address || "",
        alternate_mobile: "",
      });
      //MAP VEHICLES
      setVehicles(
        (res.vehicles || []).map((v: any) => ({
          id: v.id,
          number: v.number,
          type: v.type,
        }))
      );
      setErrors({});
    } catch (err: any) {
      setCustomer(null);
      setErrors({ search: err.message || "Customer not found" });
    }
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

  const confirmDeleteAlt = () => {
    if (deleteIndex === null) return;

    const arr = [...alternateMobiles];

    // if already saved in DB → mark pending
    if (arr[deleteIndex].id) {
      arr[deleteIndex].deleteRequested = true;
    } else {
      // if not saved yet → remove directly
      arr.splice(deleteIndex, 1);
    }

    setAlternateMobiles(arr);
    setShowDeleteModal(false);
    setDeleteIndex(null);
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
    setAlternateMobiles([
      ...alternateMobiles,
      {
        mobile: "",
        vehicles: [],
        verified: false,
        otpSent: false
      }
    ]);
  };

  const isAltReadyForOtp = (alt: AlternateMobile) => {
    const isValidMobile = /^[6-9]\d{9}$/.test(alt.mobile);
    const hasVehicle = alt.vehicles && alt.vehicles.length > 0;

    return isValidMobile && hasVehicle;
  };

 const handleAltChange = (i: number, val: string) => {
  const updated = alternateMobiles.map((item, index) =>
    index === i
      ? {
          ...item,
          mobile: val,
          error: {
            ...item.error,
            mobile: "" // ✅ clear only mobile error while typing
          }
        }
      : item
  );

  setAlternateMobiles(updated);
};

  const handleMobileUpdate = async () => {
    let newErrors: any = {};

    // FRONTEND VALIDATION
    if (!editValue) {
      newErrors.mobile = "Mobile is required";
    } else if (!/^[6-9]\d{9}$/.test(editValue)) {
      newErrors.mobile = "Enter valid 10-digit mobile number";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      // API CALL
      console.log(customer);
      await requestCustomerUpdate(customer.customer_id, {
        field: "mobile",
        new_value: editValue,
      });

      setSuccessMsg("Update request sent for approval");
      setShowModal(false);

    } catch (err: any) {
  console.log("UPDATE ERROR:", err);

  if (err?.errors?.mobile) {
    setErrors({
      mobile: Array.isArray(err.errors.mobile)
              ? err.errors.mobile[0]
              : err.errors.mobile
                });
  } else if (err?.message) {
    setErrors({
      mobile: err.message
    });
  } else {
    setErrors({
      mobile: "Update failed"
    });
  }
}
  };

  const assignVehicleToAlt = (i: number, vehicle: Vehicle) => {
    const arr = [...alternateMobiles];
    arr[i].vehicles.push(vehicle);
    setAlternateMobiles(arr);
  };

  const sendOtp = async (i: number) => {
  try {
    // send OTP to REGISTERED mobile
    await sendAltOtpApi(form.mobile, "alternate");

    // update UI (immutable)
    const updated = alternateMobiles.map((item, index) =>
      index === i ? { ...item, otpSent: true } : item
    );

    setAlternateMobiles(updated);

    // open popup
    setOtpAltIndex(i);
    setShowOtpModal(true);

  } catch (err: any) {
    console.log("OTP ERROR:", err);

    alert(
      err?.response?.data?.message || "Failed to send OTP"
    );
  }
};

  const verifyOtp = (i: number) => {
    const arr = [...alternateMobiles];
    arr[i].verified = true;
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

  const handleVerifyOtp = () => {
    let newErrors: any = {};

    if (!otpValue) {
      newErrors.otp = "OTP is required";
    } else if (!/^\d{6}$/.test(otpValue)) {
      newErrors.otp = "Enter valid 6-digit OTP";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const updated = [...alternateMobiles];
    updated[otpAltIndex!].verified = true;

    setAlternateMobiles(updated);
    setShowOtpModal(false);
    setOtpValue("");
    setErrors({});
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

      {errors.search && (
        <div className="text-danger mt-1">
          {errors.search}
        </div>
      )}

      {/* SEARCH */}
      <div className="row mb-4">
        <div className="col-md-8">
          <input
            className={`form-control ${errors.search ? "is-invalid" : ""}`}
            placeholder="Enter Vehicle Number or Mobile"
            value={search}
            onChange={(e) => setSearch(e.target.value.toUpperCase())}
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

          {alternateMobiles.length === 0 && (
            <p className="text-muted">No alternate numbers added</p>
          )}

          {alternateMobiles.map((alt, i) => (
            <div className="alt-row" key={i}>

              {/* MOBILE */}
              <div className="alt-col">
                <input
                  className={`form-control ${alt.error?.mobile ? "is-invalid" : ""}`}
                  placeholder="Alternate Mobile"
                  value={alt.mobile}
                  onChange={(e) => handleAltChange(i, e.target.value)}
                />
                <div className="error-box">{alt.error?.mobile || ""}</div>
              </div>

              {/* VEHICLE */}
              <div className="alt-col">
                <select
                  className={`form-control ${alt.error?.vehicle ? "is-invalid" : ""}`}
                  onChange={(e) => {
                    const v = vehicles.find(v => v.id === Number(e.target.value));
                    if (v) assignVehicleToAlt(i, v);
                  }}
                >
                  <option value="">Assign Vehicle</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.number} ({vehicleTypeMap[v.type] || "Unknown"})
                    </option>
                  ))}
                </select>
                <div className="error-box">{alt.error?.vehicle || ""}</div>
              </div>

              {/* BUTTONS */}
              <div className="alt-actions">

                {!alt.verified && (
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={async () => {
  const arr = [...alternateMobiles];
  const currentAlt = arr[i];

  let error: any = {};

  // FRONTEND VALIDATION
  if (!currentAlt.mobile) {
    error.mobile = "Mobile is required";
  } else if (!/^[6-9]\d{9}$/.test(currentAlt.mobile)) {
    error.mobile = "Enter valid 10-digit mobile";
  }

  if (!currentAlt.vehicles || currentAlt.vehicles.length === 0) {
    error.vehicle = "Assign at least one vehicle";
  }

  arr[i].error = error;
  setAlternateMobiles(arr);

  if (Object.keys(error).length > 0) return;

  try {
    //console.log(customer);
    // BACKEND CHECK
    console.log(customer.mobile);
    await sendAltOtpApi(currentAlt.mobile,"alternate",customer.mobile,customer.customer_id);

    // IF SUCCESS → SEND OTP
    arr[i].otpSent = true;
    setAlternateMobiles(arr);

    setOtpAltIndex(i);
    setShowOtpModal(true);

  } catch (err: any) {
  console.log("API ERROR:", err.response?.data);

  const apiError = err?.response?.data?.errors?.mobile;

  const message =
    Array.isArray(apiError)
      ? apiError[0]
      : apiError || "Mobile validation failed";

  // IMMUTABLE UPDATE (important)
  const updated = alternateMobiles.map((item, index) =>
    index === i
      ? {
          ...item,
          error: {
            ...item.error,
            mobile: message
          }
        }
      : item
  );

  setAlternateMobiles(updated);
}
}}
                  >
                    Send OTP
                  </button>
                )}

                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => {
                    if (alt.id) {
                      setDeleteIndex(i);
                      setShowDeleteModal(true);
                    } else {
                      const arr = [...alternateMobiles];
                      arr.splice(i, 1);
                      setAlternateMobiles(arr);
                    }
                  }}
                >
                  Delete
                </button>

                {alt.verified && (
                  <span className="badge bg-success">Verified</span>
                )}

              </div>
            </div>
          ))}

          <div className="mt-2">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={addAlternateMobile}
            >
              + Add Alternate Mobile
            </button>
          </div>
          <hr />

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
                value={vehicleTypeMap[v.type]}
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
                setNewVehicle({ ...newVehicle, type: Number(e.target.value) })
              }
            >
              <option value="">Select Type *</option>

              {vehicleTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
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
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4">

              <h5 className="mb-3">Edit Mobile</h5>

              {/* INPUT */}
              <div className="mb-3">
                <input
                  className={`form-control ${errors.mobile ? "is-invalid" : ""}`}
                  value={editValue}
                  onChange={(e) => {
                    setEditValue(e.target.value);

                    // 🔥 clear error on typing
                    setErrors((prev: any) => ({
                      ...prev,
                      mobile: ""
                    }));
                  }}
                />

                {/* ERROR */}
                {errors.mobile && (
                  <div className="invalid-feedback d-block">
                    {String(errors.mobile)} 
                  </div>
                )}
              </div>

              {/* ACTIONS */}
              <div className="d-flex justify-content-end gap-2 mt-3">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setShowModal(false);
                    setErrors((prev: any) => ({
                      ...prev,
                      mobile: ""
                    }));
                  }}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleMobileUpdate}
                >
                  Send Update Request
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
{successMsg && (
  <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content p-4 text-center">

        <h5 className="text-success mb-3">Success</h5>
        <p>{successMsg}</p>

        <button
          className="btn btn-primary btn-sm mt-2"
          onClick={() => setSuccessMsg("")}
        >
          OK
        </button>

      </div>
    </div>
  </div>
)}
      {showDeleteModal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">

              <h6>Confirm Delete</h6>
              <p>Are you sure you want to send delete request?</p>

              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={confirmDeleteAlt}
                >
                  Send Request
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
      {showOtpModal && otpAltIndex !== null && (
        <div className="modal d-block otp-modal" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">

            <div className="modal-content">

              {/* HEADER */}
              <div className="otp-header">
                Verify Alternate Number
              </div>

              {/* BODY */}
              <div className="otp-body">

                {/* REGISTERED */}
                <div>
                  <div className="otp-label">Registered Number</div>
                  <div className="otp-value">{form.mobile}</div>
                </div>

                {/* ALTERNATE */}
                <div>
                  <div className="otp-label">Alternate Number</div>
                  <div className="otp-value">
                    {alternateMobiles[otpAltIndex].mobile}
                  </div>
                </div>

                <p className="text-muted small mb-3">
                  An OTP has been sent to the registered number for verification.
                </p>

                {/* INPUT */}
                <input
                  className={`form-control form-control-lg mb-2 ${errors.otp ? "is-invalid" : ""
                    }`}
                  placeholder="Enter 6-digit OTP"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                />

                {errors.otp && (
                  <div className="invalid-feedback d-block">
                    {errors.otp}
                  </div>
                )}

                {/* ACTIONS */}
                <div className="otp-actions">

                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => console.log("resend")}
                  >
                    Resend OTP
                  </button>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => {
                        setShowOtpModal(false);
                        setOtpValue("");
                        setErrors({});
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      className="btn btn-primary btn-sm"
                      disabled={!otpValue || otpValue.length !== 6}
                      onClick={handleVerifyOtp}
                    >
                      Verify
                    </button>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}