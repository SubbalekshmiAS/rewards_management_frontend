import { useState } from "react";
import { FaClock, FaHistory } from "react-icons/fa";
import "../../styles/staff/CustomerRegistration.css"; // reuse CSS for tabs

import StaffShiftTab from "../../components/staff/StaffShiftTab";
import ShiftHistoryTab from "../../components/staff/ShiftHistoryTab";

export default function StaffShiftContent() {
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");

  const tabClass = (tab: string) =>
    `tab-item d-flex align-items-center ${
      activeTab === tab ? "active-tab" : "inactive-tab"
    }`;

  return (
    <div className="p-4">
      <div className="card shadow-sm p-4">

        <h5 className="mb-4 page-heading">Shift Management</h5>

        {/* TABS */}
        <div className="tab-container border-bottom mb-4">

          <div onClick={() => setActiveTab("active")} className={tabClass("active")}>
            <FaClock className="me-2" />
            Active Shift
          </div>

          <div onClick={() => setActiveTab("history")} className={tabClass("history")}>
            <FaHistory className="me-2" />
            Shift History
          </div>

        </div>

        {/* CONTENT */}
        {activeTab === "active" && <StaffShiftTab />}
        {activeTab === "history" && <ShiftHistoryTab />}

      </div>
    </div>
  );
}