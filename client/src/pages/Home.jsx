import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container mt-5 text-center">
      <h1>Smart Uni Hub</h1>
      <p>Welcome to the university platform</p>

      <Link to="/login" className="btn btn-primary me-3">
        Login
      </Link>
      <Link to="/register" className="btn btn-outline-dark">
        Register
      </Link>
    </div>
  );
}

export default Home;