import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", role: "student",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", formData);
      alert("Registration successful. Please login.");
      navigate("/login");
    } catch (error) {
      alert("Registration failed");
      console.log(error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "85vh", background: "#f8f9fa" }}>
      <div className="card shadow-lg border-0" style={{ width: "450px", borderRadius: "16px" }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-dark">Join the Hub</h2>
            <p className="text-muted">Create your university account</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-muted fw-bold">Full Name</label>
              <input type="text" name="name" className="form-control form-control-lg bg-light border-0" placeholder="John Doe" onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label text-muted fw-bold">Email Address</label>
              <input type="email" name="email" className="form-control form-control-lg bg-light border-0" placeholder="john@uni.edu" onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label text-muted fw-bold">Password</label>
              <input type="password" name="password" className="form-control form-control-lg bg-light border-0" placeholder="••••••••" onChange={handleChange} required />
            </div>
            <div className="mb-4">
              <label className="form-label text-muted fw-bold">Account Role</label>
              <select name="role" className="form-select form-select-lg bg-light border-0" value={formData.role} onChange={handleChange}>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button className="btn btn-primary btn-lg w-100 rounded-pill fw-bold shadow-sm" type="submit">
              Register Account
            </button>
          </form>
          <div className="text-center mt-4">
            <span className="text-muted">Already have an account? </span>
            <Link to="/login" className="text-primary text-decoration-none fw-bold">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;