import { useEffect, useState } from "react";
import API from "../services/api";

function StudentDashboard() {
  const localUser = JSON.parse(localStorage.getItem("user"));
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (localUser) {
      API.get(`/users/${localUser.id}`)
        .then((res) => {
          setUserProfile(res.data);
        })
        .catch((err) => {
          console.error("Failed to fetch user profile", err);
          setUserProfile(localUser); // fallback
        });
    }
  }, []);

  const displayUser = userProfile || localUser;

  return (
    <div className="container mt-5">
      <h2>Student Dashboard</h2>

      {displayUser ? (
        <>
          <div className="card p-4 mt-3 shadow-sm border-0 bg-light">
            <h4 className="mb-3">Welcome, <span className="text-primary">{displayUser.name}</span></h4>
            <p className="mb-1"><strong>User ID:</strong> {displayUser.id}</p>
            <p className="mb-1"><strong>Email:</strong> {displayUser.email}</p>
            <p className="mb-1"><strong>Role:</strong> <span className="badge bg-secondary">{displayUser.role}</span></p>
            
            {displayUser.fine_balance !== undefined && Number(displayUser.fine_balance) >= 0 && (
              <div className="alert alert-warning mt-3 mb-0 border-warning">
                <strong>Current Fine Balance:</strong> Rs. {displayUser.fine_balance}
              </div>
            )}
          </div>

          {displayUser.fines && displayUser.fines.length > 0 && (
            <div className="mt-5 card shadow-sm p-4 border-0">
              <h4 className="mb-3 text-danger">Fine History</h4>
              <ul className="list-group list-group-flush">
                {displayUser.fines.map((f, i) => (
                  <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong className="d-block">{f.reason}</strong>
                      <small className="text-muted">
                        Status: <span className={f.status === 'paid' ? 'text-success' : 'text-danger fw-bold'}>{f.status.toUpperCase()}</span>
                      </small>
                    </div>
                    <span className="badge bg-danger rounded-pill fs-6 px-3 py-2">Rs. {f.amount}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <p>No user details found. Please login first.</p>
      )}
    </div>
  );
}

export default StudentDashboard;