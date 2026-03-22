function Canteen() {
  return (
    <div className="container mt-5">
      <div className="p-5 text-center bg-light rounded-4 shadow-sm border-0" style={{ background: "linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)" }}>
        <h1 className="display-4 fw-bold text-dark mb-3">Canteen Service</h1>
        <p className="lead text-muted mb-4">View today's menu and order hot meals ahead of time.</p>
        <button className="btn btn-primary btn-lg rounded-pill px-4" disabled>Coming Soon</button>
      </div>
    </div>
  );
}

export default Canteen;
