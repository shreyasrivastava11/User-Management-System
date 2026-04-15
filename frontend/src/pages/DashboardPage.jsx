import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="grid two-col">
      <section className="card">
        <h2>Dashboard</h2>
        <p>Welcome, {user?.name}.</p>
        <p>
          Your role: <strong>{user?.role}</strong>
        </p>
        <p>
          Your status: <strong>{user?.status}</strong>
        </p>
      </section>

      <section className="card">
        <h3>Quick Actions</h3>
        <div className="stack">
          <Link className="btn" to="/profile">
            View My Profile
          </Link>
          {(user?.role === 'admin' || user?.role === 'manager') && (
            <Link className="btn btn-secondary" to="/users">
              Manage Users
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
