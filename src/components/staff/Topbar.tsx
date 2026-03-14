// components/staff/Topbar.tsx
import React from "react";

const Topbar: React.FC = () => (
  <div className="flex justify-between items-center px-6 h-full bg-white shadow">
    <input
      type="text"
      placeholder="Search"
      className="border rounded-lg px-3 py-1 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <div className="flex items-center gap-4">
      <button className="relative">
        🔔
        <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2 h-2"></span>
      </button>
      <div className="flex items-center gap-2">
        <span>Vijayabala</span>
        <img src="https://via.placeholder.com/32" alt="profile" className="w-8 h-8 rounded-full" />
      </div>
    </div>
  </div>
);

export default Topbar;