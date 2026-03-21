import { useState } from "react";
import { FaCar, FaUserPlus, FaEdit } from "react-icons/fa";

import VehicleCheckTab from "../../components/staff/VehicleCheckTab";
import CustomerRegisterTab from "../../components/staff/CustomerRegisterTab";
import CustomerEditTab from "../../components/staff/CustomerEditTab";

export default function CustomerRegistration() {
  const [activeTab, setActiveTab] = useState<"check" | "register" | "edit">("check");

  // reusable tab style (clean)
  const tabClass = (tab: string) =>
    `me-4 pb-2 d-flex align-items-center ${activeTab === tab
      ? "border-bottom border-primary fw-bold text-primary"
      : "text-muted"
    }`;

  return (
    <div className="p-4">
      <div className="card shadow-sm p-4">

        <h5 className="mb-4 page-heading">Customer Management</h5>

        {/* Tabs */}
        <div className="d-flex border-bottom mb-4">

          {/* Vehicle Check */}
          <div
            onClick={() => setActiveTab("check")}
            className={tabClass("check")}
            style={{ cursor: "pointer" }}
          >
            <FaCar className="me-2" />
            Vehicle Check
          </div>

          {/* Register */}
          <div
            onClick={() => setActiveTab("register")}
            className={tabClass("register")}
            style={{ cursor: "pointer" }}
          >
            <FaUserPlus className="me-2" />
            Register Customer
          </div>

          {/* Edit */}
          <div
            onClick={() => setActiveTab("edit")}
            className={tabClass("edit")}
            style={{ cursor: "pointer" }}
          >
            <FaEdit className="me-2" />
            Edit Customer
          </div>

        </div>

        {/* Tab Content */}
        {activeTab === "check" && <VehicleCheckTab />}
        {activeTab === "register" && <CustomerRegisterTab />}
        {activeTab === "edit" && <CustomerEditTab />}

      </div>
    </div>
  );
}
