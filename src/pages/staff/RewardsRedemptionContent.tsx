import { useState } from "react";
import { FaGift, FaHistory } from "react-icons/fa";
import "../../styles/staff/CustomerRegistration.css"; // reuse same CSS

import RedemptionTab from "../../components/staff/RedemptionTab";
import RedemptionHistoryTab from "../../components/staff/RedemptionHistoryTab";

export default function RewardRedemptionContent() {

  const [activeTab, setActiveTab] = useState<"redeem" | "history">("redeem");

  const tabClass = (tab: string) =>
    `tab-item d-flex align-items-center ${
      activeTab === tab ? "active-tab" : "inactive-tab"
    }`;

  return (
    <div className="p-3 p-md-4">
      <div className="card shadow-sm p-3 p-md-4">

        <h5 className="mb-3 mb-md-4 page-heading">
          Reward Redemption
        </h5>

        {/* TABS */}
        <div className="tab-container border-bottom mb-3 mb-md-4 flex-wrap">

          <div
            onClick={() => setActiveTab("redeem")}
            className={tabClass("redeem")}
          >
            <FaGift className="me-2" />
            Redeem
          </div>

          <div
            onClick={() => setActiveTab("history")}
            className={tabClass("history")}
          >
            <FaHistory className="me-2" />
            Redemption History
          </div>

        </div>

        {/* CONTENT */}
        <div className="mt-2">
          {activeTab === "redeem" && <RedemptionTab />}
          {activeTab === "history" && <RedemptionHistoryTab />}
        </div>

      </div>
    </div>
  );
}