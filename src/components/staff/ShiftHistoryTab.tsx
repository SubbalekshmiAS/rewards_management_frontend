import { useEffect, useState } from "react";
import { getShiftHistory } from "../../api/services/shift/shiftService";

interface Reward {
  id: number;
  points: number;
  litres: number;
}

interface Shift {
  id: number;
  start_time: string;
  end_time: string | null;
  rewards?: Reward[];
}

export default function ShiftHistoryTab() {

  const [data, setData] = useState<Shift[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState("today");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // ✅ BUILD PARAMS PROPERLY
  const buildParams = (page = 1) => {
    let params: any = { page };

    if (filter === "today") {
      const today = new Date().toISOString().split("T")[0];
      params.from = today;
      params.to = today;
    }

    if (filter === "week") {
      const today = new Date();
      const lastWeek = new Date(today.setDate(today.getDate() - 7))
        .toISOString()
        .split("T")[0];

      params.from = lastWeek;
      params.to = new Date().toISOString().split("T")[0];
    }

    if (filter === "custom") {
      params.from = fromDate;
      params.to = toDate;
    }

    return params;
  };

  const fetchHistory = async (page = 1) => {
    try {
      setLoading(true);

      const res = await getShiftHistory(buildParams(page));

      console.log("API RES:", res);

      setData(res.data || []);
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

  return (
    <div className="card p-3">

      {/* HEADER */}
      <div className="d-flex justify-content-between mb-3">
        <h6 className="text-primary m-0">Shift History</h6>
        <small>{pagination?.total || 0} entries</small>
      </div>

      {/* FILTER */}
      <div className="row mb-3">

        <div className="col-md-3">
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
            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <button
                className="btn btn-primary w-100"
                onClick={() => fetchHistory(1)}
              >
                Go
              </button>
            </div>
          </>
        )}
      </div>

      {loading && <p>Loading...</p>}

      {/* TABLE */}
      <div className="table-responsive">
        <table className="table align-middle">

          <thead>
            <tr>
              <th>Date</th>
              <th>Start</th>
              <th>End</th>
              <th>Fuel</th>
              <th>Points</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {!Array.isArray(data) || data.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">
                  No shifts found
                </td>
              </tr>
            ) : (
              data.flatMap((shift) => {

                const rewards = Array.isArray(shift.rewards)
                  ? shift.rewards
                  : [];

                // ✅ If no rewards
                if (rewards.length === 0) {
                  return (
                    <tr key={`shift-${shift.id}`}>
                      <td>{new Date(shift.start_time).toLocaleDateString()}</td>
                      <td>{new Date(shift.start_time).toLocaleTimeString()}</td>
                      <td>
                        {shift.end_time
                          ? new Date(shift.end_time).toLocaleTimeString()
                          : "Active"}
                      </td>
                      <td colSpan={3} className="text-center">
                        No rewards
                      </td>
                    </tr>
                  );
                }

                // ✅ Each reward = separate row
                return rewards.map((r) => (
                  <tr key={r.id}>

                    <td>
                      {new Date(shift.start_time).toLocaleDateString()}
                    </td>

                    <td>
                      {new Date(shift.start_time).toLocaleTimeString()}
                    </td>

                    <td>
                      {shift.end_time
                        ? new Date(shift.end_time).toLocaleTimeString()
                        : "Active"}
                    </td>

                    <td>
                      {Number(r.litres).toFixed(2)} L
                    </td>

                    <td>
                      {Number(r.points).toFixed(2)}
                    </td>

                    <td>
                      <span className={`badge ${
                        shift.end_time ? "bg-secondary" : "bg-success"
                      }`}>
                        {shift.end_time ? "Completed" : "Active"}
                      </span>
                    </td>

                  </tr>
                ));
              })
            )}
          </tbody>

        </table>
      </div>

      {/* PAGINATION */}
      {pagination && (
        <div className="d-flex justify-content-between mt-3">

          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={!pagination.prev_page_url}
            onClick={() => fetchHistory(pagination.current_page - 1)}
          >
            Prev
          </button>

          <span>
            {pagination.current_page} / {pagination.last_page}
          </span>

          <button
            className="btn btn-sm btn-outline-secondary"
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