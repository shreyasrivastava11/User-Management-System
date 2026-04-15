import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

function formatAuditActor(actor) {
  if (!actor) return 'N/A';
  if (typeof actor === 'string') return `User ID: ${actor}`;
  if (actor.id && !actor.name && !actor.email) return `User ID: ${actor.id}`;
  return `${actor.name || 'Unknown'} (${actor.email || actor.id || '-'})`;
}

export default function UserDetailPage() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'user', status: 'active', password: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = async () => {
    setError('');
    try {
      const res = await api.get(`/users/${id}`);
      setUser(res.data);
      setForm({
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
        status: res.data.status,
        password: ''
      });
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const payload = {
        name: form.name,
        email: form.email
      };

      if (currentUser.role === 'admin') {
        payload.role = form.role;
        payload.status = form.status;
      }

      if (form.password) payload.password = form.password;

      const res = await api.patch(`/users/${id}`, payload);
      setUser(res.data);
      setMessage('User updated successfully');
      setForm((s) => ({ ...s, password: '' }));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="grid two-col">
      <section className="card stack">
        <h2>User Detail</h2>
        {error && <p className="error-text">{error}</p>}
        {message && <p className="success-text">{message}</p>}
        {!user ? (
          <p>Loading...</p>
        ) : (
          <ul className="details">
            <li>
              <strong>Name:</strong> {user.name}
            </li>
            <li>
              <strong>Email:</strong> {user.email}
            </li>
            <li>
              <strong>Role:</strong> {user.role}
            </li>
            <li>
              <strong>Status:</strong> {user.status}
            </li>
            <li>
              <strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}
            </li>
            <li>
              <strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}
            </li>
            <li>
              <strong>Created By:</strong> {formatAuditActor(user.createdBy)}
            </li>
            <li>
              <strong>Updated By:</strong> {formatAuditActor(user.updatedBy)}
            </li>
          </ul>
        )}
        <div className="actions-row">
          <Link className="btn btn-secondary" to="/users">
            Back to Users
          </Link>
        </div>
      </section>

      {user && (
        <section className="card">
          <h3>Edit User</h3>
          <form onSubmit={onSubmit} className="stack">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              required
            />

            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
              required
            />

            {currentUser.role === 'admin' && (
              <>
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  value={form.role}
                  onChange={(e) => setForm((s) => ({ ...s, role: e.target.value }))}
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>

                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </>
            )}

            <label htmlFor="password">Reset Password (optional)</label>
            <input
              id="password"
              type="password"
              minLength={8}
              value={form.password}
              onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
            />

            <button type="submit" className="btn">
              Save User
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
