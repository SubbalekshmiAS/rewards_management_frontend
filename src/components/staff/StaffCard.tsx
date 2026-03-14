// components/staff/StaffCard.tsx
//import React from "react";

type Props = {
  title: string;
  value: string | number;
};

const StaffCard: React.FC<Props> = ({ title, value }) => (
  <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition">
    <div className="text-gray-500 text-sm">{title}</div>
    <div className="text-xl font-bold">{value}</div>
  </div>
);

export default StaffCard;