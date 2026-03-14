// pages/staff/DashboardContent.tsx
import React from "react";

const DashboardContent: React.FC = () => (
  <div className="space-y-6">
    {/* Summary Cards */}
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 bg-white rounded shadow">Total Users: 2201</div>
      <div className="p-4 bg-white rounded shadow">Total Staff: 1901</div>
      <div className="p-4 bg-white rounded shadow">New Students: 1001</div>
      <div className="p-4 bg-white rounded shadow">Trained Students: 881</div>
    </div>

    {/*  Staff Details Table */}
    <div className="bg-white rounded shadow p-4">
      <h2 className="font-bold mb-4">Staff Details</h2>
      <table className="w-full table-auto">
        <thead>
          <tr className="text-left border-b">
            <th className="px-2 py-1">Name</th>
          </tr>
        </thead>
        <tbody>
          {[
            { name: "John Doe", course: "UI/UX Design", status: "Enrolled", enrolled: "12/04/2023" },
            { name: "Jane Smith", course: "Full Stack Dev", status: "Enrolled", enrolled: "15/04/2023" },
            { name: "Arun", course: "Front-End", status: "Unenrolled", enrolled: "20/04/2023" },
          ].map((student) => (
            <tr key={student.name} className="border-b">
              <td className="px-2 py-1">{student.name}</td>
              <td className="px-2 py-1">{student.course}</td>
              <td className="px-2 py-1">{student.status}</td>
              <td className="px-2 py-1">{student.enrolled}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default DashboardContent;