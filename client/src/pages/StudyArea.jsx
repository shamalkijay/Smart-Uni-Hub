import { useEffect, useState } from "react";
import API from "../services/api";

function StudyArea() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [seats, setSeats] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  useEffect(() => {
    fetchSeats();
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

  const handleTableClick = (table) => {
    setSelectedTable(table);
  };

  const getSeatsForTable = () => {
    if (!selectedTable) return [];
    return seats.filter((s) => s.table_id === selectedTable.table_id);
  };

  const getTableStatus = (tableId) => {
    const tableSeats = seats.filter((seat) => seat.table_id === tableId);

    if (tableSeats.length === 0) return "available";

    const bookedCount = tableSeats.filter((seat) => seat.status === "booked").length;

    if (bookedCount === 0) return "available";
    if (bookedCount === tableSeats.length) return "fully-booked";

    return "partially-booked";
  };

  const handleBooking = async (seat) => {
    if (seat.status === "booked") {
      alert("This seat is already booked.");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const bookingDetails = {
        seat_id: seat.id,
        user_id: user.id,
        date,
        start_time: startTime,
        end_time: endTime,
      };

      await API.post("/bookings", bookingDetails);
      alert("Booking successful!");
      fetchSeats();
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert(error.response.data.message);
      } else {
        console.error("Booking failed:", error);
        alert("Booking failed. Please try again.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>Study Area Map</h2>

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

      <div className="mt-4 d-flex justify-content-center gap-4 mb-4">
        <div><span style={{ color: "green", fontWeight: "bold" }}>●</span> Available</div>
        <div><span style={{ color: "gold", fontWeight: "bold" }}>●</span> Partially Booked</div>
        <div><span style={{ color: "red", fontWeight: "bold" }}>●</span> Fully Booked</div>
        <div><span style={{ color: "orange", fontWeight: "bold" }}>●</span> Selected</div>
      </div>

      <div className="mt-4">
        {[1, 2, 3, 4, 5, 6, 7].map((row) => (
          <div key={row} className="d-flex justify-content-center mb-3">
            {tables
              .filter((t) => t.row === row)
              .map((table) => (
                <div
                  key={table.table_id}
                  className="m-2"
                  onClick={() => handleTableClick(table)}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    backgroundColor:
                      selectedTable?.table_id === table.table_id
                        ? "orange"
                        : getTableStatus(table.table_id) === "fully-booked"
                        ? "red"
                        : getTableStatus(table.table_id) === "partially-booked"
                        ? "gold"
                        : "green",
                    cursor: "pointer",
                  }}
                ></div>
              ))}
          </div>
        ))}
      </div>

      {selectedTable && (
        <div className="mt-5 text-center">
          <h4>Table {selectedTable.table_id} Seats</h4>

          <div className="d-flex justify-content-center gap-4 mt-3">
            {getSeatsForTable().map((seat) => (
              <div
                key={seat.id}
                onClick={() => handleBooking(seat)}
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: seat.status === "booked" ? "red" : "lightgreen",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                {seat.seat_number}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default StudyArea;
