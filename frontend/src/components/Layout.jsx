import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          User Management
        </Link>

        <nav className="nav-links">
          <NavLink to="/">Dashboard</NavLink>
          {(user?.role === 'admin' || user?.role === 'manager') && <NavLink to="/users">Users</NavLink>}
          <NavLink to="/profile">My Profile</NavLink>
        </nav>

        <div className="user-chip">
          <span>
            {user?.name} ({user?.role})
          </span>
          <button type="button" onClick={logout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </header>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
