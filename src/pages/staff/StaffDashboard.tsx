import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/staff/StaffDashboard.css';

import {
  FaTachometerAlt,
  FaUserPlus,
  FaGift,
  FaPlusCircle,
  FaClock,
  FaExchangeAlt,
  FaUserTimes,
  FaSignOutAlt,
} from 'react-icons/fa';

import DashboardContent from './DashboardContent';
import CustomerRegistrationContent from './CustomerRegistration';
import RewardsCheckContent from './RewardsCheckContent';
import AddRewardsContent from './AddRewardsContent';
import ShiftActiveContent from './ShiftActiveContent';
import RewardsRedemptionContent from './RewardsRedemptionContent';
import NonLoyaltyContent from './NonLoyaltyContent';
import { useNavigate } from "react-router-dom";

type MenuKey =
  | 'dashboard'
  | 'customer'
  | 'rewardsCheck'
  | 'addRewards'
  | 'shiftActive'
  | 'rewardsRedemption'
  | 'nonLoyalty'
  | 'logout';

const StaffDashboard: React.FC = () => {

 const [activeMenu, setActiveMenu] = useState<MenuKey>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false); // ✅ correct place

  const navigate = useNavigate();

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { key: 'customer', label: 'Customer Registration', icon: <FaUserPlus /> },
    { key: 'rewardsCheck', label: 'Rewards Check', icon: <FaGift /> },
    { key: 'addRewards', label: 'Add Rewards', icon: <FaPlusCircle /> },
    { key: 'shiftActive', label: 'Shift Active', icon: <FaClock /> },
    { key: 'rewardsRedemption', label: 'Rewards Redemption', icon: <FaExchangeAlt /> },
    { key: 'nonLoyalty', label: 'Non-Loyalty Users', icon: <FaUserTimes /> },
    { key: 'logout', label: 'Log Out', icon: <FaSignOutAlt /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard': return <DashboardContent />;
      case 'customer': return <CustomerRegistrationContent />;
      case 'rewardsCheck': return <RewardsCheckContent />;
      case 'addRewards': return <AddRewardsContent />;
      case 'shiftActive': return <ShiftActiveContent />;
      case 'rewardsRedemption': return <RewardsRedemptionContent />;
      case 'nonLoyalty': return <NonLoyaltyContent />;
      default: return <div>Select a menu</div>;
    }
  };

  return (
    <div className="staff-dashboard">

      {/* OVERLAY (mobile) */}
      {sidebarOpen && (
        <div
          className="overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <h3 className="sidebar-title">Staff Panel</h3>

        <ul className="nav flex-column">
          {menuItems.map((item) => (
            <li key={item.key} className="nav-item mb-2">
              <button
                onClick={() => {
                  if (item.key === "logout") {
                    handleLogout();
                  } else {
                    setActiveMenu(item.key);
                    setSidebarOpen(false); // ✅ auto close on mobile
                  }
                }}
                className={`nav-btn ${activeMenu === item.key ? 'active' : ''}`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* CONTENT */}
      <div className="content">

        {/* MOBILE MENU BUTTON */}
        <button
          className="btn btn-primary d-md-none mb-3"
          onClick={() => setSidebarOpen(true)}
        >
          ☰ Menu
        </button>

        {renderContent()}
      </div>

    </div>
  );
};

export default StaffDashboard;