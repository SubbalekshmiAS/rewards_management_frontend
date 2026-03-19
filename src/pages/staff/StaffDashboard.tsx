import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/staff/StaffDashboard.css'; // separate CSS
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
import CustomerRegistrationContent from './CustomerRegistrationContent';
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

const STAFF_BLUE = '#4e73df';

const StaffDashboard: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<MenuKey>('dashboard');

  const menuItems: { key: MenuKey; label: string; icon: JSX.Element }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { key: 'customer', label: 'Customer Registration', icon: <FaUserPlus /> },
    { key: 'rewardsCheck', label: 'Rewards Check', icon: <FaGift /> },
    { key: 'addRewards', label: 'Add Rewards', icon: <FaPlusCircle /> },
    { key: 'shiftActive', label: 'Shift Active', icon: <FaClock /> },
    { key: 'rewardsRedemption', label: 'Rewards Redemption', icon: <FaExchangeAlt /> },
    { key: 'nonLoyalty', label: 'Non-Loyalty Users', icon: <FaUserTimes /> },
    { key: 'logout', label: 'Log Out', icon: <FaSignOutAlt /> },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard': return <DashboardContent />;
      case 'customer': return <CustomerRegistrationContent />;
      case 'rewardsCheck': return <RewardsCheckContent />;
      case 'addRewards': return <AddRewardsContent />;
      case 'shiftActive': return <ShiftActiveContent />;
      case 'rewardsRedemption': return <RewardsRedemptionContent />;
      case 'nonLoyalty': return <NonLoyaltyContent />;
      //case 'logout': return <div>Logging out...</div>;
      default: return <div>Select a menu</div>;
    }
  };

  const navigate = useNavigate();
  
  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/login");
};

  return (
    <div className="staff-dashboard d-flex">
      <div className="sidebar">
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
                    }
                  }}
                className={`nav-btn d-flex align-items-center w-100 text-start ${
                  activeMenu === item.key ? 'active' : ''
                }`}
              >
                <span className="me-2">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="content flex-grow-1 p-4 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default StaffDashboard;