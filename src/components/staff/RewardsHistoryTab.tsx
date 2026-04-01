import { useEffect, useState } from "react";
import { getRewardsHistory } from "../../api/services/reward/rewardService";

export default function RewardsHistoryTab() {

  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 🔥 NEW STATES
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("today"); // today | week | custom
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // 🔥 FETCH WITH PARAMS
  const fetchHistory = async (page = 1) => {
    try {
      setLoading(true);

      const res = await getRewardsHistory({
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

  // 🔥 AUTO FETCH ON FILTER CHANGE
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
        <h6 className="text-primary m-0">Rewards History</h6>
        <small className="text-muted">
          {pagination?.total || 0} records
        </small>
      </div>

      {/* 🔍 SEARCH + FILTER BAR */}
      <div className="row mb-3">

        {/* SEARCH */}
        <div className="col-md-4 col-12 mb-2">
          <input
            className="form-control"
            placeholder="Search name / mobile / vehicle"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* FILTER */}
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

        {/* CUSTOM DATE */}
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

        {/* SEARCH BUTTON */}
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
              <th>Customer</th>
              <th>Mobile</th>
              <th>Vehicle</th>
              <th>Fuel</th>
              <th>Litres</th>
              <th>Points</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => {

              const highlight = isToday(item.created_at);

              return (
                <tr key={item.id} className={highlight ? "today-row" : ""}>

                  <td>
                    <div className="fw-semibold">
                      {item.customer?.user?.name || "N/A"}
                    </div>                    
                  </td>
                  <td>
                      {item.customer?.user?.phone || "-"}
                    </td>

                  <td>{item.vehicle?.vehicle_number}</td>

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

      {/* MOBILE VIEW */}
      <div className="d-block d-md-none">
        {data.map((item) => (
          <div key={item.id} className="reward-card mb-2">

            <div className="d-flex justify-content-between">
              <strong>{item.customer?.user?.name || "N/A"}</strong>
              <span className="points-pill">{item.points}</span>
            </div>

            <small className="text-muted">
              {item.customer?.user?.phone}
            </small>

            <div className="mt-2 small">
              🚗 {item.vehicle?.vehicle_number} <br />
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