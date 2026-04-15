import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { setUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/users/me')
      .then((res) => {
        setProfile(res.data);
        setForm((s) => ({ ...s, name: res.data.name }));
      })
      .catch((err) => setError(err.message));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const payload = { name: form.name };
      if (form.password) payload.password = form.password;

      const res = await api.patch('/users/me', payload);
      setProfile(res.data);
      setUser((prev) => ({ ...prev, name: res.data.name }));
      const currentStored = JSON.parse(localStorage.getItem('auth_user') || '{}');
      localStorage.setItem(
        'auth_user',
        JSON.stringify({ ...currentStored, name: res.data.name })
      );
      setForm((s) => ({ ...s, password: '' }));
      setMessage('Profile updated successfully');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="grid two-col">
      <section className="card">
        <h2>My Profile</h2>
        {error && <p className="error-text">{error}</p>}
        {profile && (
          <ul className="details">
            <li>
              <strong>Name:</strong> {profile.name}
            </li>
            <li>
              <strong>Email:</strong> {profile.email}
            </li>
            <li>
              <strong>Role:</strong> {profile.role}
            </li>
            <li>
              <strong>Status:</strong> {profile.status}
            </li>
            <li>
              <strong>Created At:</strong> {new Date(profile.createdAt).toLocaleString()}
            </li>
            <li>
              <strong>Updated At:</strong> {new Date(profile.updatedAt).toLocaleString()}
            </li>
          </ul>
        )}
      </section>

      <section className="card">
        <h3>Update Profile</h3>
        {message && <p className="success-text">{message}</p>}
        <form onSubmit={submit} className="stack">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            required
          />

          <label htmlFor="password">New Password (optional)</label>
          <input
            id="password"
            type="password"
            minLength={8}
            value={form.password}
            onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
          />

          <button type="submit" className="btn">
            Save Changes
          </button>
        </form>
      </section>
    </div>
  );
}
