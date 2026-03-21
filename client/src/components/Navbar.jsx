import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">
        Smart Uni Hub
      </Link>

      <div className="navbar-nav ms-auto d-flex flex-row gap-3 align-items-center">
        <Link className="nav-link text-white" to="/">
          Home
        </Link>

        {!user ? (
          <>
            <Link className="nav-link text-white" to="/login">
              Login
            </Link>
            <Link className="nav-link text-white" to="/register">
              Register
            </Link>
          </>
        ) : (
          <>
            {user.role === "admin" ? (
              <Link className="nav-link text-white" to="/admin-dashboard">
                Dashboard
              </Link>
            ) : (
              <Link className="nav-link text-white" to="/student-dashboard">
                Dashboard
              </Link>
            )}

            <Link className="nav-link text-white" to="/study-area">
              Study Area
            </Link>
            <Link className="nav-link text-white" to="/canteen">
              Canteen
            </Link>
            <Link className="nav-link text-white" to="/transport">
              Transport
            </Link>
            <Link className="nav-link text-white" to="/events">
              Events
            </Link>
            <Link className="nav-link text-white" to="/payments">
              Payments
            </Link>

            <button className="btn btn-danger btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;