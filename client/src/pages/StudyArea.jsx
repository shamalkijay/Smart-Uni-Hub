import { useEffect, useState } from "react";
import API from "../services/api";

function StudyArea() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [seats, setSeats] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [activeBooking, setActiveBooking] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchSeats();
    fetchActiveBooking();
  }, [date, startTime, endTime]);

  const fetchSeats = async () => {
    try {
      const res = await API.get("/seats", {
        params: { date, startTime, endTime },
      });

      setSeats(res.data);

      const tableSet = [...new Set(res.data.map((s) => s.table_id))];
      const formattedTables = tableSet.map((id) => ({
        table_id: id,
        row: Math.floor((id - 1) / 10) + 1,
      }));

      setTables(formattedTables);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchActiveBooking = async () => {
    try {
      if (!user) return;
      const res = await API.get(`/bookings/active/${user.id}`);
      setActiveBooking(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleTableClick = (table) => {
    setSelectedTable(table);
  };

  const getSeatsForTable = (tableId) => {
    return seats.filter((seat) => seat.table_id === tableId);
  };

  const handleBooking = async (seat) => {
    if (seat.status === "booked") {
      alert("This seat is already booked.");
      return;
    }

    if (activeBooking) {
      alert("You already have an active booking. Complete or cancel it first.");
      return;
    }

    const confirmBooking = window.confirm(
      `Are you sure you want to book Table ${seat.table_id}, Seat ${seat.seat_number} from ${startTime} to ${endTime}?`
    );

    if (!confirmBooking) {
      return;
    }

    try {
      const bookingDetails = {
        seat_id: seat.id,
        user_id: user.id,
        date,
        start_time: startTime,
        end_time: endTime,
      };

      const res = await API.post("/bookings", bookingDetails);
      alert(res.data.message);

      await fetchSeats();
      await fetchActiveBooking();
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Booking failed");
      }
    }
  };

  const handleCompleteBooking = async () => {
    try {
      await API.put(`/bookings/complete/${activeBooking.id}`);
      alert("Booking completed");
      setActiveBooking(null);
      fetchSeats();
    } catch (err) {
      console.log(err);
      alert("Failed to complete booking");
    }
  };

  const handleCancelBooking = async () => {
    try {
      await API.put(`/bookings/cancel/${activeBooking.id}`);
      alert("Booking cancelled");
      setActiveBooking(null);
      fetchSeats();
    } catch (err) {
      console.log(err);
      alert("Failed to cancel booking");
    }
  };

  const handleArrived = async () => {
    if (!activeBooking) return;
    try {
      const res = await API.put(`/bookings/arrive/${activeBooking.id}`);
      alert(res.data.message);
      fetchActiveBooking();
    } catch (err) {
      console.log(err);
      alert("Failed to mark arrival");
    }
  };

  const renderQuarterTable = (table) => {
    const tableSeats = getSeatsForTable(table.table_id);

    return (
      <div key={table.table_id} className="d-flex flex-column align-items-center m-2">
        <div
          className="table-container"
          onClick={() => handleTableClick(table)}
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            border: selectedTable?.table_id === table.table_id ? "4px solid orange" : "2px solid #ddd",
            cursor: "pointer",
            position: "relative",
          }}
          title={`Table ${table.table_id}`}
        >
        {[1, 2, 3, 4].map((seatNo) => {
          const seat = tableSeats.find((s) => s.seat_number === seatNo);
          const isBooked = seat?.status === "booked";

          return (
            <div
              key={seatNo}
              className={`seat-quarter ${isBooked ? "booked" : "available"}`}
              onClick={(e) => {
                e.stopPropagation();
                if (seat) handleBooking(seat);
              }}
              style={{
                backgroundColor: isBooked ? "#dc3545" : "#28a745",
                border: "1px solid white",
              }}
            ></div>
          );
        })}
      </div>
      <div style={{ marginTop: "6px", fontSize: "14px", fontWeight: "bold", color: "#333", backgroundColor: "rgba(255,255,255,0.8)", padding: "2px 6px", borderRadius: "10px" }}>
        Table {table.table_id}
      </div>
    </div>
  );
};

  return (
    <div className="container mt-4">
      <style>{`
        .table-container {
          transition: all 0.3s ease;
        }
        .table-container:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transform: translateY(-2px);
        }
        .seat-quarter {
          transition: all 0.2s ease-in-out;
        }
        .seat-quarter.available:hover {
          filter: brightness(1.2);
          transform: scale(1.05);
          z-index: 10;
          box-shadow: 0 0 8px rgba(40, 167, 69, 0.8);
        }
        .seat-quarter.booked {
          cursor: not-allowed;
          opacity: 0.8;
        }
      `}</style>
      <h1>Study Area Map</h1>

      <div className="row mb-4">
        <div className="col-md-4">
          <label>Date</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <label>Start Time</label>
          <input
            type="time"
            className="form-control"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <label>End Time</label>
          <input
            type="time"
            className="form-control"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-3 d-flex gap-4">
        <div><span style={{ color: "green" }}>■</span> Available Seat</div>
        <div><span style={{ color: "red" }}>■</span> Booked Seat</div>
        <div><span style={{ color: "orange" }}>■</span> Selected Table Border</div>
      </div>

      {activeBooking && (
        <div className="card p-3 mb-4 shadow-sm">
          <h5>Current Active Booking</h5>
          <p><strong>Status:</strong> <span className="badge bg-secondary">{activeBooking.status}</span></p>
          <p><strong>Table:</strong> {activeBooking.table_id}</p>
          <p><strong>Seat:</strong> {activeBooking.seat_number}</p>
          <p><strong>Date:</strong> {activeBooking.booking_date?.slice(0, 10)}</p>
          <p><strong>Time:</strong> {activeBooking.start_time} - {activeBooking.end_time}</p>

          <div className="d-flex gap-2">
            <button className="btn btn-warning" onClick={handleArrived}>
              I Arrived
            </button>
            <button className="btn btn-success" onClick={handleCompleteBooking}>
              Complete Session
            </button>
            <button className="btn btn-danger" onClick={handleCancelBooking}>
              Cancel Session
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 position-relative border rounded p-4 shadow-sm" style={{ backgroundColor: "#fdfdfd", minHeight: "600px" }}>
        {/* Door Icon at the entrance (top) */}
        <div className="text-center mb-4">
          <div style={{ fontSize: "2.5rem" }} title="Entrance">🚪</div>
          <div className="text-muted fw-bold" style={{ letterSpacing: "2px" }}>ENTRANCE</div>
        </div>

        {/* L and R side indicators */}
        <div 
          className="position-absolute d-flex align-items-center justify-content-center h-100" 
          style={{ top: 0, left: "30px", fontSize: "5rem", fontWeight: "bold", color: "#eee", zIndex: 0, pointerEvents: "none" }}
        >
          L
        </div>
        <div 
          className="position-absolute d-flex align-items-center justify-content-center h-100" 
          style={{ top: 0, right: "30px", fontSize: "5rem", fontWeight: "bold", color: "#eee", zIndex: 0, pointerEvents: "none" }}
        >
          R
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          {[1, 2, 3, 4, 5, 6, 7].map((row) => (
            <div key={row} className="d-flex justify-content-center mb-2">
              {tables
                .filter((t) => t.row === row)
                .map((table) => renderQuarterTable(table))}
            </div>
          ))}
        </div>
      </div>

      {selectedTable && (
        <div className="mt-5 text-center">
          <h3>Table {selectedTable.table_id}</h3>
          <p>
            Booked Seats:{" "}
            {getSeatsForTable(selectedTable.table_id).filter((seat) => seat.status === "booked").length}
            /4
          </p>
        </div>
      )}
    </div>
  );
}

export default StudyArea;
