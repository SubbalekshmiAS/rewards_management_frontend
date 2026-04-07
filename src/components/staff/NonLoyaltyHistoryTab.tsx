import { useEffect, useState } from "react";
import { getNonLoyaltyHistory } from "../../api/services/nonloyalty/nonLoyaltyService";
import { vehicleTypeMap } from "../../constants/vehicleTypes";

export default function NonLoyaltyHistoryTab() {

  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 🔥 STATES
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("today");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchHistory = async (page = 1) => {
    try {
      setLoading(true);

      const res = await getNonLoyaltyHistory({
        page,
        search,
        filter,
        from_date: fromDate,
        to_date: toDate
      });

      setData(res.data);
      setPagination(res);

    } catch (err) {
      console.error(err);
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

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="text-primary m-0">Non-Loyalty History</h6>
        <small className="text-muted">
          {pagination?.total || 0} records
        </small>
      </div>

      {/* SEARCH + FILTER */}
      <div className="row mb-3">

        <div className="col-md-4 col-12 mb-2">
          <input
            className="form-control"
            placeholder="Search vehicle number"
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
          <button
            className="btn btn-primary w-100"
            onClick={() => fetchHistory(1)}
          >
            Go
          </button>
        </div>

      </div>

      {loading && <p>Loading...</p>}

      {/* DESKTOP TABLE */}
      <div className="table-responsive d-none d-md-block premium-table">
        <table className="table align-middle">

          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Type</th>
              <th>Fuel</th>
              <th>Litres</th>
              <th>Amount</th>
              <th>Points</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => {
              const highlight = isToday(item.created_at);

              return (
                <tr key={item.id} className={highlight ? "today-row" : ""}>

                  <td>{item.vehicle_number}</td>

                  <td>{vehicleTypeMap[item.vehicle_type] || "-"}</td>

                  <td>
                    <span className={`badge ${
                      item.fuel_type === "petrol"
                        ? "bg-warning text-dark"
                        : "bg-secondary"
                    }`}>
                      {item.fuel_type}
                    </span>
                  </td>

                  <td>{item.litres} L</td>

                  <td>{item.amount || "-"}</td>

                  <td>
                    <span className="points-pill">
                      {item.points}
                    </span>
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

      {/* MOBILE */}
      <div className="d-block d-md-none">
        {data.map((item) => (
          <div key={item.id} className="reward-card mb-2">

            <div className="d-flex justify-content-between">
              <strong>{item.vehicle_number}</strong>
              <span className="points-pill">{item.points}</span>
            </div>

            <div className="mt-2 small">
              🚗 {vehicleTypeMap[item.vehicle_type]} <br />
              ⛽ {item.fuel_type} | {item.litres}L
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

          <span>
            {pagination.current_page} / {pagination.last_page}
          </span>

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