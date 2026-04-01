import { useState } from "react";
import { FaSearch, FaHistory } from "react-icons/fa";

import RewardsCheckTab from "../../components/staff/RewardsCheckTab";
import RewardsHistoryTab from "../../components/staff/RewardsHistoryTab";

import "../../styles/staff/RewardsCheck.css";

export default function RewardsCheckContent() {

  const [activeTab, setActiveTab] = useState<"check" | "history">("check");

  const tabClass = (tab: string) =>
    `tab-item ${activeTab === tab ? "active-tab" : "inactive-tab"}`;

  return (
    <div className="p-3">

      <div className="card p-3 shadow-sm">

        <h5 className="mb-3 page-heading">Rewards</h5>

        {/* TABS */}
        <div className="tab-container border-bottom mb-3">

          <div
            className={tabClass("check")}
            onClick={() => setActiveTab("check")}
          >
            <FaSearch className="me-2" />
            Check Rewards
          </div>

          <div
            className={tabClass("history")}
            onClick={() => setActiveTab("history")}
          >
            <FaHistory className="me-2" />
            History
          </div>

        </div>

        {/* CONTENT */}
        {activeTab === "check" && <RewardsCheckTab />}
        {activeTab === "history" && <RewardsHistoryTab />}

      </div>
    </div>
  );
}