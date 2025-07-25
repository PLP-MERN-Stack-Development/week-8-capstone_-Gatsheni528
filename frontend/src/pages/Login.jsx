import { useState } from 'react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-bold">Login to SkillHub</h2>

      <div>
        <label htmlFor="email" className="block mb-1">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          required
          placeholder="Email"
          onChange={handleChange}
          className="input w-full"
        />
      </div>

      <div>
        <label htmlFor="password" className="block mb-1">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          required
          placeholder="Password"
          onChange={handleChange}
          className="input w-full"
        />
      </div>

      <button type="submit" className="btn-primary w-full">Login</button>
    </form>
  );
}
