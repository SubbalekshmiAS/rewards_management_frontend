import { useState } from "react";
import { FaCar, FaHistory  } from "react-icons/fa";
import NonLoyaltyAddTab from "../../components/staff/NonLoyaltyAddTab";
import "../../styles/staff/CustomerRegistration.css";
import NonLoyaltyHistoryTab  from "../../components/staff/NonLoyaltyHistoryTab";

export default function NonLoyaltyUser() {
 const [activeTab, setActiveTab] = useState<"add" | "history">("add");

  const tabClass = (tab: string) =>
    `tab-item d-flex align-items-center ${
      activeTab === tab ? "active-tab" : "inactive-tab"
    }`;

  return (
    <div className="p-4">
      <div className="card shadow-sm p-4">
        <h5 className="mb-4">Non-Loyalty Customer</h5>

        {/* Tabs */}
        <div className="tab-container border-bottom mb-4">

          <div
            onClick={() => setActiveTab("add")}
            className={tabClass("add")}
          >
            <FaCar className="me-2" />
            Add Entry
          </div>

          <div
            onClick={() => setActiveTab("history")}
            className={tabClass("history")}
          >
            <FaHistory className="me-2" />
            History
          </div>

        </div>

        {/* Content */}
        {activeTab === "add" && <NonLoyaltyAddTab />}
        {activeTab === "history" && <NonLoyaltyHistoryTab />}
      </div>
    </div>
  );
}