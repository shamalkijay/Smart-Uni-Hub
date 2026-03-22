import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StudyArea from "./pages/StudyArea";
import Canteen from "./pages/Canteen";
import Transport from "./pages/Transport";
import Events from "./pages/Events";
import Payments from "./pages/Payments";

function AppContent() {
  const location = useLocation();
  // Hide Navbar strictly on the Home page
  const showNav = location.pathname !== "/";

  return (
    <>
      {showNav && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/study-area" element={<StudyArea />} />
        <Route path="/canteen" element={<Canteen />} />
        <Route path="/transport" element={<Transport />} />
        <Route path="/events" element={<Events />} />
        <Route path="/payments" element={<Payments />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
