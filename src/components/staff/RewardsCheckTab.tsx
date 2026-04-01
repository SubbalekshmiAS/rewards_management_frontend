import { useState } from "react";
import { getRewardsSummary } from "../../api/services/reward/rewardService";
import { FaCar, FaCoins, FaTag } from "react-icons/fa";

export default function RewardsCheckTab() {

  const [search, setSearch] = useState("");
  const [customer, setCustomer] = useState<any>(null);
  const [summary, setSummary] = useState<any[]>([]);
  const [totalPoints, setTotalPoints] = useState<number>(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const vehicleTypeMap: any = {
    1: "Bike / Scooter",
    2: "Auto (3 Wheeler)",
    3: "Car / Jeep",
    4: "Light Commercial (LCV)",
    5: "Heavy Commercial (HCV)",
  };

  // 🔍 SEARCH
  const handleSearch = async () => {

    setError("");
    setCustomer(null);
    setSummary([]);
    setTotalPoints(0);

    if (!search) {
      setError("Enter mobile or vehicle number");
      return;
    }

    try {
      setLoading(true);

      const res = await getRewardsSummary(search);

      setCustomer(res.customer);
      setSummary(res.summary);
      setTotalPoints(res.total_points);

    } catch (err: any) {
      setError(err?.message || "Customer not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-3">

      <h6 className="text-primary mb-3">Check Rewards</h6>

      {/* SEARCH */}
      <div className="row mb-3">
        <div className="col-md-8 col-12 mb-2">
          <input
            className="form-control"
            placeholder="Enter Mobile / Vehicle"
            value={search}
            onChange={(e) => setSearch(e.target.value.toUpperCase())}
          />
        </div>

        <div className="col-md-4 col-12">
          <button className="btn btn-primary w-100" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}

      {/* CUSTOMER INFO */}
      {customer && (
        <div className="card p-3 mb-3 bg-light">

          <div className="d-flex justify-content-between align-items-center flex-wrap">

            <div>
              <div className="fw-semibold">
                {customer.user?.name || "N/A"}
              </div>
              <small className="text-muted">
                {customer.user?.phone || "-"}
              </small>
            </div>

            <div className="total-points-box mt-2 mt-md-0">
              <div className="points-label">Total Points</div>
              <div className="points-value">{totalPoints}</div>
            </div>

          </div>

        </div>
      )}

      {/* DESKTOP TABLE */}
      {summary.length > 0 && (
        <div className="table-responsive d-none d-md-block">

          <table className="table align-middle">

            <thead>
              <tr>
                <th>Vehicle Number</th>
                <th>Vehicle Type</th>
                <th>Total Points</th>
              </tr>
            </thead>

            <tbody>
              {summary.map((item) => (
                <tr key={item.id}>

                  <td>
                    <strong>{item.vehicle_number}</strong>
                  </td>

                  <td>
                    {vehicleTypeMap[item.vehicle_type] || "Unknown"}
                  </td>

                  <td>
                    <span className="points-pill">
                      {item.total_points}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}

      {/* MOBILE VIEW */}
      <div className="d-block d-md-none">

        {summary.map((item) => (
            <div key={item.id} className="reward-card">

            {/* TOP */}
            <div className="reward-top">

                <div className="d-flex align-items-left gap-2 vehicle-number">
                <FaCar size={14} />
                {item.vehicle_number}
                </div>

                <div className="points-pill d-flex align-items-center gap-1">
                {item.total_points}
                </div>

            </div>

            {/* BOTTOM */}
            <div className="reward-bottom d-flex align-items-left gap-1">
                {vehicleTypeMap[item.vehicle_type]}
            </div>

            </div>
        ))}

        </div>

      {!loading && customer && summary.length === 0 && (
        <p className="text-muted">No rewards found</p>
      )}

    </div>
  );
}