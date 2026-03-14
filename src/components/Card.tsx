// components/Card.tsx
//import React from "react";

type CardProps = {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
};

const Card: React.FC<CardProps> = ({ title, value, icon }) => (
  <div className="p-4 bg-white rounded-lg shadow flex items-center gap-4 hover:shadow-md transition">
    {icon && <div className="text-blue-700 text-2xl">{icon}</div>}
    <div>
      <div className="text-gray-500 text-sm">{title}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  </div>
);

export default Card;