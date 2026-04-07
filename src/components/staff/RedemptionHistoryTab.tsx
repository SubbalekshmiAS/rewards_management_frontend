import { useEffect, useState } from "react";
import { getRedemptionHistory } from "../../api/services/redemption/redemptionService";
import { vehicleTypeMap } from "../../constants/vehicleTypes";

export default function RedemptionHistoryTab() {

  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("today"); // today | week | custom
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchHistory = async (page = 1) => {
    try {
      setLoading(true);

      const res = await getRedemptionHistory({
        page,
        search,
        filter,
        from_date: fromDate,
        to_date: toDate
      });

      setData(res.data);
      setPagination(res);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    fetchHistory(1);
  }, [filter]);

  const isToday = (date: string) => {
    const d = new Date(date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  };

  return (
    <div className="card p-3">

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="text-primary m-0">Redemption History</h6>
        <small className="text-muted">{pagination?.total || 0} records</small>
      </div>

      {/* SEARCH & FILTER */}
      <div className="row mb-3">
        <div className="col-md-4 col-12 mb-2">
          <input
            className="form-control"
            placeholder="Search name / mobile / vehicle"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-3 col-6 mb-2">
          <select
            className="form-control"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {filter === "custom" && (
          <>
            <div className="col-md-2 col-6 mb-2">
              <input
                type="date"
                className="form-control"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="col-md-2 col-6 mb-2">
              <input
                type="date"
                className="form-control"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </>
        )}

        <div className="col-md-1 col-6 mb-2">
          <button className="btn btn-primary w-100" onClick={() => fetchHistory(1)}>Go</button>
        </div>
      </div>

      {loading && <p>Loading...</p>}

      {/* TABLE */}
      <div className="table-responsive d-none d-md-block premium-table">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Mobile</th>
              <th>Vehicle Type</th>
              <th>Fuel Type</th>
              <th>Points</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => {
              const highlight = isToday(item.created_at);
              return (
                <tr key={item.id} className={highlight ? "today-row" : ""}>
                  <td>{item.customer?.user?.name || "N/A"}</td>
                  <td>{item.customer?.user?.phone || "-"}</td>
                  <td>{vehicleTypeMap[item.vehicle_type] || "-"}</td>
                  <td>{item.vehicle?.fuel_type || "-"}</td>
                  <td>
                    <span className="points-pill">{item.points}</span>
                  </td>
                  <td className="small text-muted">
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW */}
      <div className="d-block d-md-none">
        {data.map((item) => (
          <div key={item.id} className="reward-card mb-2">
            <div className="d-flex justify-content-between">
              <strong>{item.customer?.user?.name || "N/A"}</strong>
              <span className="points-pill">{item.points}</span>
            </div>
            <small className="text-muted">{item.customer?.user?.phone}</small>
            <div className="mt-2 small">              
              🏷️ {item.vehicle?.vehicle_type} | ⛽ {item.vehicle?.fuel_type} | {item.points} pts
            </div>
            <div className="text-muted small mt-1">
              {new Date(item.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {pagination && (
        <div className="pagination-box mt-3">
          <button
            disabled={!pagination.prev_page_url}
            onClick={() => fetchHistory(pagination.current_page - 1)}
          >
            Prev
          </button>
          <span>{pagination.current_page} / {pagination.last_page}</span>
          <button
            disabled={!pagination.next_page_url}
            onClick={() => fetchHistory(pagination.current_page + 1)}
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
}