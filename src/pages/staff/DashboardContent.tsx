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
    <div className="card p-3">

      <h5 className="mb-3">Staff Details</h5>

      <div className="table-responsive">
        <table className="table table-bordered">

          <thead>
            <tr>
              <th>Name</th>
              <th>Course</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>John Doe</td>
              <td>UI/UX Design</td>
              <td>Enrolled</td>
              <td>12/04/2023</td>
            </tr>

            <tr>
              <td>Jane Smith</td>
              <td>Full Stack Dev</td>
              <td>Enrolled</td>
              <td>15/04/2023</td>
            </tr>

            <tr>
              <td>Arun</td>
              <td>Front-End</td>
              <td>Unenrolled</td>
              <td>20/04/2023</td>
            </tr>
          </tbody>

        </table>
      </div>
    </div>
  </div>
);

export default DashboardContent;