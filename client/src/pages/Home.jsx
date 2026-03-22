import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      setUser(JSON.parse(localUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (user) {
    return (
      <div className="container mt-5">
        <style>{`
          .launchpad-card {
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            border: none;
            border-radius: 12px;
            overflow: hidden;
            background: linear-gradient(145deg, #ffffff, #f0f0f0);
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            text-decoration: none;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 30px 20px;
            min-height: 180px;
            color: #333;
          }
          .launchpad-card:hover {
            transform: translateY(-5px) scale(1.02);
            box-shadow: 0 12px 20px rgba(0,0,0,0.1);
            color: #0d6efd;
          }
          .launchpad-icon {
            font-size: 3rem;
            margin-bottom: 15px;
            opacity: 0.9;
          }
          .launchpad-title {
            font-size: 1.25rem;
            font-weight: 700;
            margin-bottom: 8px;
          }
          .launchpad-desc {
            font-size: 0.9rem;
            color: #6c757d;
            text-align: center;
          }
          .hero-section {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 16px;
            padding: 40px;
            margin-bottom: 40px;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
          }
        `}</style>

        <div className="hero-section text-center position-relative">
          <button 
            onClick={handleLogout} 
            className="btn btn-outline-danger btn-sm position-absolute" 
            style={{ top: "20px", right: "20px", borderRadius: "20px", padding: "5px 15px" }}
          >
            Logout
          </button>
          
          <h1 className="display-5 fw-bold text-dark mb-3">
            Welcome back, <span className="text-primary">{user.name}</span>!
          </h1>
          <p className="lead text-muted mb-0">
            What would you like to do today? Select a module to get started.
          </p>
        </div>

        <div className="row g-4">
          {user.role === "admin" ? (
            <div className="col-md-4 col-sm-6">
              <Link to="/admin-dashboard" className="launchpad-card">
                <div className="launchpad-title">Admin Dashboard</div>
                <div className="launchpad-desc">Manage student arrivals and monitor fine payments.</div>
              </Link>
            </div>
          ) : (
            <div className="col-md-4 col-sm-6">
              <Link to="/student-dashboard" className="launchpad-card">
                <div className="launchpad-title">My Dashboard</div>
                <div className="launchpad-desc">View your profile, current fine balance, and history.</div>
              </Link>
            </div>
          )}

          <div className="col-md-4 col-sm-6">
            <Link to="/study-area" className="launchpad-card">
              <div className="launchpad-title">Study Area</div>
              <div className="launchpad-desc">Book your favorite table and secure your study session safely.</div>
            </Link>
          </div>

          <div className="col-md-4 col-sm-6">
            <Link to="/canteen" className="launchpad-card">
              <div className="launchpad-title">Canteen</div>
              <div className="launchpad-desc">Check out today's menu or pre-order your meals.</div>
            </Link>
          </div>

          <div className="col-md-4 col-sm-6">
            <Link to="/events" className="launchpad-card">
              <div className="launchpad-title">University Events</div>
              <div className="launchpad-desc">Stay updated with the latest happenings and campus events.</div>
            </Link>
          </div>

          <div className="col-md-4 col-sm-6">
            <Link to="/transport" className="launchpad-card">
              <div className="launchpad-title">Transport</div>
              <div className="launchpad-desc">Find bus schedules and real-time university transit info.</div>
            </Link>
          </div>

          <div className="col-md-4 col-sm-6">
            <Link to="/payments" className="launchpad-card">
              <div className="launchpad-title">Payments</div>
              <div className="launchpad-desc">Pay your fines or handle other university fees securely.</div>
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // Generic Unauthenticated Home
  return (
    <div className="container mt-5 text-center">
      <style>{`
        .landing-wrapper {
          padding: 80px 20px;
          background: linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%);
          border-radius: 20px;
          color: white;
          box-shadow: 0 10px 20px rgba(13, 110, 253, 0.2);
        }
        .app-title {
          font-size: 4rem;
          font-weight: 800;
          letter-spacing: -1px;
        }
      `}</style>
      <div className="landing-wrapper">
        <h1 className="app-title mb-4">Smart Uni Hub</h1>
        <p className="lead mb-5 opacity-75">Your unified digital campus experience. Access study areas, canteen, transport, and more instantly.</p>

        <Link to="/login" className="btn btn-light btn-lg me-3 fw-bold px-5 rounded-pill shadow">
          Login
        </Link>
        <Link to="/register" className="btn btn-outline-light btn-lg fw-bold px-5 rounded-pill">
          Register
        </Link>
      </div>
    </div>
  );
}

export default Home;