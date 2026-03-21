import React from "react";
import { FaTachometerAlt, FaUsers, FaChalkboardTeacher, FaBook } from "react-icons/fa";

type Props = {
  active: string;
  onSelect: (panel: string) => void;
};

const Sidebar: React.FC<Props> = ({ active, onSelect }) => {
  const menu = [
    { name: "Dashboard", icon: <FaTachometerAlt /> },
    { name: "Staff", icon: <FaUsers /> },
    { name: "Vehicle Entry", icon: <FaChalkboardTeacher /> },
    { name: "Customer Registration", icon: <FaBook /> },
  ];

  return (
    <div className="flex flex-col gap-4">
      {menu.map((item) => (
        <button
          key={item.name}
          onClick={() => onSelect(item.name)}
          className={`flex items-center gap-3 p-3 rounded hover:bg-blue-800 transition ${active === item.name ? "bg-blue-700 font-bold" : ""
            }`}
        >
          {item.icon} {item.name}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;