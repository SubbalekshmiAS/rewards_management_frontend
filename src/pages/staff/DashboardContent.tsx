import { useEffect, useState } from "react";
import { getStaffDashboard } from "../../api/services/dashboard/dashboardService";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function DashboardContent() {

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const COLORS = ["#facc15", "#6b7280"];

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await getStaffDashboard();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <p>Loading...</p>;

  const chartData = [
    { name: "Petrol", value: data?.fuel_stats?.petrol || 0 },
    { name: "Diesel", value: data?.fuel_stats?.diesel || 0 },
  ];

  return (
    <div className="p-3">

      {/* 🔥 SUMMARY */}
      <div className="row g-2 mb-3">

        <div className="col-6">
          <div className="card p-3 text-center">
            <small>Today Points</small>
            <h5>{data?.today_points || 0}</h5>
          </div>
        </div>

        <div className="col-6">
          <div className="card p-3 text-center">
            <small>Redeemed</small>
            <h5>{data?.today_redeemed || 0}</h5>
          </div>
        </div>

        <div className="col-6">
          <div className="card p-3 text-center">
            <small>Non Loyalty</small>
            <h5>{data?.non_loyalty_points || 0}</h5>
          </div>
        </div>

        <div className="col-6">
          <div className="card p-3 text-center">
            <small>Shift Status</small>
            <h5 className={data?.shift_active ? "text-success" : "text-danger"}>
              {data?.shift_active ? "Active" : "Inactive"}
            </h5>
          </div>
        </div>

      </div>

      {/* 📊 PIE CHART */}
      <div className="card p-3 mb-3">
        <h6 className="mb-3">Fuel Distribution</h6>

        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label
            >
              {chartData.map((entry, index) => (
    <Cell key={index} fill={COLORS[index]} />
  ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}