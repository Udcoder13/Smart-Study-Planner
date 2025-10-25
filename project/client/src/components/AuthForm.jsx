import React, { useState } from 'react';
import api from '../api';

export default function AuthForm({ mode, onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = mode === 'login' ? '/auth/login' : '/auth/register';
      const { data } = await api.post(url, form);
      localStorage.setItem('token', data.token);
      onSuccess(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">{mode === 'login' ? 'Login' : 'Register'}</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === 'register' && (
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded p-2"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border rounded p-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border rounded p-2"
        />
        <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded">
          {mode === 'login' ? 'Login' : 'Register'}
        </button>
      </form>
    </div>
  );
}
