import { useEffect, useState } from "react";
import API from "../services/api";

function AdminDashboard() {
  const [pendingArrivals, setPendingArrivals] = useState([]);
  const [unpaidFines, setUnpaidFines] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchPendingArrivals();
    fetchUnpaidFines();
  }, []);

  const fetchUnpaidFines = async () => {
    try {
      const res = await API.get("/fines/unpaid");
      setUnpaidFines(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPendingArrivals = async () => {
    try {
      const res = await API.get("/bookings/pending-arrivals");
      setPendingArrivals(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleConfirm = async (bookingId) => {
    try {
      const res = await API.put(`/bookings/admin-confirm/${bookingId}`, {
        admin_id: user.id,
      });

      alert(res.data.message);
      fetchPendingArrivals();
    } catch (err) {
      console.log(err);
      alert("Failed to confirm arrival");
    }
  };

  const handleNoShow = async (bookingId) => {
    try {
      const res = await API.put(`/bookings/admin-no-show/${bookingId}`, {
        admin_id: user.id,
        fine_amount: 100.00,
      });

      alert(res.data.message);
      fetchPendingArrivals();
    } catch (err) {
      console.log(err);
      alert("Failed to mark no-show");
    }
  };

  const handleConfirmPayment = async (fineId) => {
    try {
      const res = await API.put(`/fines/pay/${fineId}`);
      alert(res.data.message);
      fetchUnpaidFines();
    } catch (err) {
      console.log(err);
      alert("Failed to confirm payment");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>
      <p>Pending student arrival confirmations</p>

      {pendingArrivals.length === 0 ? (
        <p>No pending arrivals right now.</p>
      ) : (
        <div className="row">
          {pendingArrivals.map((item) => (
            <div key={item.arrival_id} className="col-md-6 mb-3">
              <div className="card p-3 shadow-sm">
                <h5>{item.student_name}</h5>
                <p><strong>Email:</strong> {item.student_email}</p>
                <p><strong>Table:</strong> {item.table_id}</p>
                <p><strong>Seat:</strong> {item.seat_number}</p>
                <p><strong>Date:</strong> {item.booking_date?.slice(0, 10)}</p>
                <p><strong>Time:</strong> {item.start_time} - {item.end_time}</p>
                <p><strong>Status:</strong> {item.status}</p>
                <p><strong>Student marked arrived at:</strong> {item.student_confirmed_at}</p>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-success"
                    onClick={() => handleConfirm(item.booking_id)}
                  >
                    Confirm Present
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => handleNoShow(item.booking_id)}
                  >
                    Mark No Show
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <hr className="my-5" />

      <h2>Fine Management</h2>
      <p>Pending fine payments to be confirmed by admin</p>

      {unpaidFines.length === 0 ? (
        <p>No unpaid fines right now.</p>
      ) : (
        <div className="row">
          {unpaidFines.map((fine) => (
            <div key={fine.fine_id} className="col-md-6 mb-3">
              <div className="card p-3 shadow-sm border-warning">
                <h5 className="text-warning">Unpaid Fine - Rs. {fine.amount}</h5>
                <p><strong>Student:</strong> {fine.student_name}</p>
                <p><strong>Email:</strong> {fine.student_email}</p>
                <p><strong>Reason:</strong> {fine.reason}</p>

                <div className="mt-2">
                  <button
                    className="btn btn-outline-success w-100 fw-bold"
                    onClick={() => handleConfirmPayment(fine.fine_id)}
                  >
                    Confirm Payment Received
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;