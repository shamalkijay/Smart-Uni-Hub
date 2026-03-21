function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>

      {user ? (
        <div className="card p-4 mt-3 shadow-sm">
          <h4>Welcome, {user.name}</h4>
          <p><strong>User ID:</strong> {user.id}</p>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      ) : (
        <p>No user details found. Please login first.</p>
      )}
    </div>
  );
}

export default AdminDashboard;