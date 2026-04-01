import { useState } from "react";
import { FaPlusCircle, FaHistory } from "react-icons/fa";
import '../../styles/staff/CustomerRegistration.css'; // reuse same CSS

import AddRewardsTab from "../../components/staff/AddRewardsTab";
import RewardsHistoryTab from "../../components/staff/RewardsHistoryTab";

export default function AddRewardsContent() {

  const [activeTab, setActiveTab] = useState<"add" | "history">("add");

  const tabClass = (tab: string) =>
    `tab-item d-flex align-items-center ${
      activeTab === tab ? "active-tab" : "inactive-tab"
    }`;

  return (
    <div className="p-4">
      <div className="card shadow-sm p-4">

        <h5 className="mb-4 page-heading">Rewards Management</h5>

        {/* TABS */}
        <div className="tab-container border-bottom mb-4">

          <div
            onClick={() => setActiveTab("add")}
            className={tabClass("add")}
          >
            <FaPlusCircle className="me-2" />
            Add Rewards
          </div>

          <div
            onClick={() => setActiveTab("history")}
            className={tabClass("history")}
          >
            <FaHistory className="me-2" />
            Rewards History
          </div>

        </div>

        {/* CONTENT */}
        {activeTab === "add" && <AddRewardsTab />}
        {activeTab === "history" && <RewardsHistoryTab />}

      </div>
    </div>
  );
}