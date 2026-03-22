import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", formData);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      if (user.role === "admin") navigate("/admin-dashboard");
      else navigate("/student-dashboard");
    } catch (error) {
      alert("Login failed");
      console.log(error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh", background: "#f8f9fa" }}>
      <div className="card shadow-lg border-0" style={{ width: "400px", borderRadius: "16px" }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-dark">Welcome Back</h2>
            <p className="text-muted">Sign in to your Hub Account</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-muted fw-bold">Email Address</label>
              <input 
                type="email" name="email" className="form-control form-control-lg bg-light border-0" 
                placeholder="student@uni.edu" onChange={handleChange} required 
              />
            </div>
            <div className="mb-4">
              <label className="form-label text-muted fw-bold">Password</label>
              <input 
                type="password" name="password" className="form-control form-control-lg bg-light border-0" 
                placeholder="••••••••" onChange={handleChange} required 
              />
            </div>
            <button className="btn btn-primary btn-lg w-100 rounded-pill fw-bold shadow-sm" type="submit">
              Login
            </button>
          </form>
          <div className="text-center mt-4">
            <span className="text-muted">Don't have an account? </span>
            <Link to="/register" className="text-primary text-decoration-none fw-bold">Register here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;