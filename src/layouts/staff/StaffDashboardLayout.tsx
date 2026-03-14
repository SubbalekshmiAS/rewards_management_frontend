// layouts/staff/StaffDashboardLayout.tsx
import React, { ReactNode } from "react";

type Props = {
  sidebar: ReactNode;
  main: ReactNode;
};

const StaffDashboardLayout: React.FC<Props> = ({ sidebar, main }) => (
  <div className="flex h-screen bg-gray-50">
    {/* Left Sidebar */}
    <aside className="w-64 bg-blue-900 text-white flex flex-col p-4">
      {sidebar}
    </aside>

    {/* Right Panel */}
    <main className="flex-1 p-6 overflow-auto">{main}</main>
  </div>
);

export default StaffDashboardLayout;