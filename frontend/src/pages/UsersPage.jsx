import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

function generateRandomPassword(length = 12) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export default function UsersPage() {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [filters, setFilters] = useState({ q: '', role: '', status: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    role: 'user',
    status: 'active',
    password: generateRandomPassword()
  });
  const [useAutoPassword, setUseAutoPassword] = useState(true);
  const [createMessage, setCreateMessage] = useState('');

  const loadUsers = async (page = 1) => {
    setLoading(true);
    setError('');

    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(meta.limit));
    if (filters.q) params.set('q', filters.q);
    if (filters.role) params.set('role', filters.role);
    if (filters.status) params.set('status', filters.status);

    try {
      const res = await api.get(`/users?${params.toString()}`);
      setUsers(res.data);
      setMeta(res.meta);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(1);
  }, []);

  const createUser = async (e) => {
    e.preventDefault();
    setCreateMessage('');
    setError('');

    try {
      const payload = {
        name: createForm.name,
        email: createForm.email,
        role: createForm.role,
        status: createForm.status
      };

      if (useAutoPassword || createForm.password) {
        payload.password = createForm.password;
      }

      const res = await api.post('/users', payload);
      if (res.generatedPassword) {
        setCreateMessage(`User created. Auto-generated password: ${res.generatedPassword}`);
      } else {
        setCreateMessage(`User created. Password: ${payload.password}`);
      }
      setCreateForm({
        name: '',
        email: '',
        role: 'user',
        status: 'active',
        password: generateRandomPassword()
      });
      setUseAutoPassword(true);
      await loadUsers(meta.page);
    } catch (err) {
      setError(err.message);
    }
  };

  const deactivateUser = async (id) => {
    const ok = window.confirm('Deactivate this user?');
    if (!ok) return;

    try {
      await api.delete(`/users/${id}`);
      await loadUsers(meta.page);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="stack">
      <section className="card">
        <h2>User Management</h2>
        <p className="muted">Search, filter, and manage users.</p>

        {error && <p className="error-text">{error}</p>}

        <div className="inline-grid">
          <input
            placeholder="Search by name/email"
            value={filters.q}
            onChange={(e) => setFilters((s) => ({ ...s, q: e.target.value }))}
          />

          <select value={filters.role} onChange={(e) => setFilters((s) => ({ ...s, role: e.target.value }))}>
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters((s) => ({ ...s, status: e.target.value }))}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button type="button" className="btn" onClick={() => loadUsers(1)}>
            Apply
          </button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5}>Loading...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5}>No users found</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.status}</td>
                    <td className="actions-cell">
                      {(user.role === 'admin' || (user.role === 'manager' && u.role !== 'admin')) ? (
                        <Link className="btn btn-small" to={`/users/${u.id}`}>
                          View
                        </Link>
                      ) : (
                        <span className="muted">No actions</span>
                      )}
                      {user.role === 'admin' && u.status !== 'inactive' && (
                        <button type="button" className="btn btn-small btn-danger" onClick={() => deactivateUser(u.id)}>
                          Deactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination-row">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => loadUsers(Math.max(1, meta.page - 1))}
            disabled={meta.page <= 1}
          >
            Previous
          </button>
          <span>
            Page {meta.page} of {meta.totalPages} ({meta.total} users)
          </span>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => loadUsers(Math.min(meta.totalPages || 1, meta.page + 1))}
            disabled={meta.page >= meta.totalPages}
          >
            Next
          </button>
        </div>
      </section>

      {user.role === 'admin' && (
        <section className="card">
          <h3>Create User</h3>
          {createMessage && <p className="success-text">{createMessage}</p>}
          <form onSubmit={createUser} className="inline-grid create-grid">
            <input
              placeholder="Name"
              value={createForm.name}
              onChange={(e) => setCreateForm((s) => ({ ...s, name: e.target.value }))}
              required
            />
            <input
              placeholder="Email"
              type="email"
              value={createForm.email}
              onChange={(e) => setCreateForm((s) => ({ ...s, email: e.target.value }))}
              required
            />
            <select
              value={createForm.role}
              onChange={(e) => setCreateForm((s) => ({ ...s, role: e.target.value }))}
            >
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
            <select
              value={createForm.status}
              onChange={(e) => setCreateForm((s) => ({ ...s, status: e.target.value }))}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={useAutoPassword ? 'auto' : 'custom'}
              onChange={(e) => setUseAutoPassword(e.target.value === 'auto')}
            >
              <option value="auto">Use Random Password</option>
              <option value="custom">Use Custom Password</option>
            </select>
            <input
              placeholder={useAutoPassword ? 'Auto-generated password' : 'Custom password'}
              value={createForm.password}
              onChange={(e) => setCreateForm((s) => ({ ...s, password: e.target.value }))}
              minLength={8}
              disabled={useAutoPassword}
            />
            {useAutoPassword && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setCreateForm((s) => ({ ...s, password: generateRandomPassword() }))}
              >
                Regenerate Password
              </button>
            )}
            <button className="btn" type="submit">
              Create User
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
