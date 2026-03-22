import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark px-4 shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
          <span>Smart Uni Hub</span>
        </Link>

        {/* Note: Keeping the navigation simple and horizontally constrained */}
        <div className="navbar-nav ms-auto d-flex flex-row gap-3 align-items-center">
          <Link className={`nav-link text-white ${location.pathname === '/' ? 'fw-bold' : ''}`} to="/">
            Home
          </Link>

          {!user ? (
            <>
              <Link className="btn btn-outline-light btn-sm px-3 rounded-pill" to="/login">
                Login
              </Link>
              <Link className="btn btn-primary btn-sm px-3 rounded-pill" to="/register">
                Register
              </Link>
            </>
          ) : (
            <>
              {user.role === "admin" ? (
                <Link className={`nav-link text-white ${location.pathname.includes('admin') ? 'fw-bold' : ''}`} to="/admin-dashboard">
                  Dashboard
                </Link>
              ) : (
                <Link className={`nav-link text-white ${location.pathname.includes('student') ? 'fw-bold' : ''}`} to="/student-dashboard">
                  Dashboard
                </Link>
              )}

              <Link className={`nav-link text-white ${location.pathname.includes('study-area') ? 'fw-bold' : ''}`} to="/study-area">Study Area</Link>
              <Link className={`nav-link text-white ${location.pathname.includes('canteen') ? 'fw-bold' : ''}`} to="/canteen">Canteen</Link>
              <Link className={`nav-link text-white ${location.pathname.includes('transport') ? 'fw-bold' : ''}`} to="/transport">Transport</Link>
              <Link className={`nav-link text-white ${location.pathname.includes('events') ? 'fw-bold' : ''}`} to="/events">Events</Link>
              <Link className={`nav-link text-white ${location.pathname.includes('payments') ? 'fw-bold' : ''}`} to="/payments">Payments</Link>

              <button className="btn btn-danger btn-sm rounded-pill px-3 ms-2 shadow-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;