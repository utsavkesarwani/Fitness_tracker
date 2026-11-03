import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setAuthSession } from '../services/api';

const initialForm = {
  name: '',
  email: '',
  password: '',
};

function AuthPage({ onAuthenticated }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response =
        mode === 'register'
          ? await api.register(form)
          : await api.login({ email: form.email, password: form.password });

      setAuthSession(response);
      onAuthenticated?.();
      navigate('/');
    } catch (submitError) {
      setError(submitError.message || 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      const response = await api.demoLogin();
      setAuthSession(response);
      onAuthenticated?.();
      navigate('/');
    } catch (submitError) {
      setError(submitError.message || 'Demo login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/40">
        <div className="mb-6 text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-teal-300">Gym Tracker</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">{mode === 'login' ? 'Welcome back' : 'Create account'}</h1>
        </div>

        <div className="mb-5 flex rounded-xl border border-slate-700 bg-slate-950/70 p-1">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
              mode === 'login' ? 'bg-teal-500 text-slate-950' : 'text-slate-300'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
              mode === 'register' ? 'bg-teal-500 text-slate-950' : 'text-slate-300'
            }`}
          >
            Register
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label className="block text-sm text-slate-300">
              Full name
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={updateField}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-teal-400"
                placeholder="Alex Morgan"
                required
              />
            </label>
          )}

          <label className="block text-sm text-slate-300">
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none placeholder:text-slate-500 focus:border-teal-400"
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="block text-sm text-slate-300">
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={updateField}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none placeholder:text-slate-500 focus:border-teal-400"
              placeholder="••••••••"
              minLength={6}
              required
            />
          </label>

          {error && <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-teal-500 px-4 py-3 font-medium text-slate-950 transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>

        <div className="mt-5 border-t border-slate-700 pt-4">
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isSubmitting}
            className="w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-teal-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            Continue with demo user
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
