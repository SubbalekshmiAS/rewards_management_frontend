// components/staff/DashboardMenu.tsx
//import React from "react";

type MenuProps = {
  onSelect: (panel: string) => void;
  activePanel: string;
};

const DashboardMenu: React.FC<MenuProps> = ({ onSelect, activePanel }) => {
  const menuItems = [
    "Dashboard",
    "Vehicle Entry",
    "Customer Registration",
    "Shift Summary",
    "Fuel Stats",
    "Rewards",
  ];

  return (
    <div className="flex flex-col gap-3">
      {menuItems.map((item) => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          className={`p-3 rounded text-left hover:bg-blue-800 transition ${
            activePanel === item ? "bg-blue-700 font-bold" : ""
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default DashboardMenu;