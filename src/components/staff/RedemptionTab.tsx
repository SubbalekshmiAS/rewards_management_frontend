import { useState } from "react";
import { getRedemptionSummary, redeemPoints } from "../../api/services/redemption/redemptionService";

export default function RewardRedemptionTab() {
  const [search, setSearch] = useState("");
  const [customer, setCustomer] = useState<any>(null);
  const [summary, setSummary] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [redeemPointsValue, setRedeemPointsValue] = useState<{ [key: number]: number }>({});

  const handleSearch = async () => {
    if (!search.trim()) return alert("Enter mobile or vehicle number");

    try {
      setLoading(true);
      const res = await getRedemptionSummary(search.trim());
      setCustomer(res.customer);
      setSummary(res.summary);

      // Reset input values
      setRedeemPointsValue({});
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || "Error fetching summary");
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (vehicleType: number) => {
    const points = redeemPointsValue[vehicleType];

    if (points === undefined || points <= 0) return alert("Enter valid points");
    const maxPoints = summary.find((s) => s.vehicle_type === vehicleType)?.max_points || 0;

    if (points > maxPoints) return alert(`Cannot redeem more than ${maxPoints} points`);

    try {
      await redeemPoints({
        customer_id: customer.id,
        vehicle_type: vehicleType,
        points,
      });

      alert("Redeemed successfully");

      handleSearch(); // Refresh summary
    } catch (err: any) {
      alert(err?.response?.data?.message || "Error redeeming points");
    }
  };

  return (
    <div className="card p-3">
      <h6 className="text-primary mb-3">Reward Redemption</h6>

      {/* SEARCH */}
      <div className="row mb-3">
        <div className="col-md-8">
          <input
            className="form-control"
            placeholder="Enter mobile / vehicle"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <button className="btn btn-primary w-100" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {loading && <p>Loading...</p>}

      {/* REDEMPTION SUMMARY */}
      {summary.map((item) => (
        <div key={item.vehicle_type} className="card p-2 mb-2">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Type: {item.vehicle_type}</strong> ({item.vehicle_count} vehicle
              {item.vehicle_count > 1 ? "s" : ""})
              <div>Available Points: {item.points}</div>
            </div>

            <div style={{ width: "150px" }}>
              <input
                type="number"
                className="form-control mb-1"
                placeholder="Points"
                min={1}
                max={item.max_points}
                value={redeemPointsValue[item.vehicle_type] || ""}
                onChange={(e) =>
                  setRedeemPointsValue({
                    ...redeemPointsValue,
                    [item.vehicle_type]: Number(e.target.value),
                  })
                }
              />
              <button
                className="btn btn-danger w-100 btn-sm"
                onClick={() => handleRedeem(item.vehicle_type)}
              >
                Redeem
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}