import { useEffect, useState } from "react";
import {
  getShiftSummary,
  startShift,
  endShift
} from "../../api/services/shift/shiftService";

export default function StaffShiftTab() {

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchData = async () => {
    try {
      const res = await getShiftSummary();
      setData(res);
    } catch {
      setMsg("Failed to load shift");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // AUTO REFRESH (every 10 sec)
  useEffect(() => {
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = async () => {
    try {
      setLoading(true);
      await startShift();
      setMsg("Shift started");
      fetchData();
    } catch (err: any) {
      setMsg(err?.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleEnd = async () => {
    try {
      setLoading(true);
      await endShift();
      setMsg("Shift ended");

      await fetchData(); // ✅ reload correct data

    } catch (err: any) {
      setMsg(err?.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-3">

      <h6 className="text-primary mb-3">Staff Shift</h6>

      {/* MESSAGE */}
      {msg && (
        <div className="alert alert-info py-2">{msg}</div>
      )}

      {/* NO SHIFT */}
      {!data?.active && (
        <div className="text-center">

          <p className="text-muted">No active shift</p>

          <button
            className="btn btn-success w-100"
            onClick={handleStart}
            disabled={loading}
          >
            Start Shift
          </button>

        </div>
      )}

      {/* ACTIVE SHIFT */}
      {data?.active && (
        <>

          {/* STATUS */}
          <div className="mb-3">
            <p className="mb-1">
              <b>Status:</b> <span className="text-success">Active</span>
            </p>
            <p className="mb-0 small text-muted">
              Started: {new Date(data.shift.start_time).toLocaleString()}
            </p>
          </div>

          {/* SUMMARY */}
          <div className="row text-center mb-3">

            <div className="col-4">
              <div className="summary-box">
                <h6>{data.summary.points}</h6>
                <small>Points</small>
              </div>
            </div>

            <div className="col-4">
              <div className="summary-box">
                <h6>{data.summary.litres} L</h6>
                <small>Fuel</small>
              </div>
            </div>

            <div className="col-4">
              <div className="summary-box">
                <h6>{data.summary.customers}</h6>
                <small>Customers</small>
              </div>
            </div>

          </div>

          {/* LAST ACTIVITY */}
          {data.last_reward && (
            <div className="last-activity mb-3">

              <small className="text-muted">Last Reward</small>

              <div className="mt-1">
                🚗 {data.last_reward.vehicle?.vehicle_number} <br />
                ⛽ {data.last_reward.litres}L → {data.last_reward.points} pts
              </div>

            </div>
          )}

          {/* ACTION */}
          <button
            className="btn btn-danger w-100"
            onClick={handleEnd}
            disabled={loading}
          >
            End Shift
          </button>

        </>
      )}

    </div>
  );
}