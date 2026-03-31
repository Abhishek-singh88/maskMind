'use client'

import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  async function handleSendCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data?.message || 'Failed to send code');
        return;
      }
      setMessage('Reset code sent to your email.');
    } catch (error) {
      console.error('Send code error:', error);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResetLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data?.message || 'Failed to reset password');
        return;
      }
      setMessage('Password reset successfully. Redirecting to sign in...');
      setTimeout(() => {
        window.location.href = '/sign-in?reset=1';
      }, 800);
    } catch (error) {
      console.error('Reset password error:', error);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-5xl items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-stone-200 bg-white/90 p-8 shadow-[0_18px_50px_rgba(15,12,8,0.08)]">
        <div className="flex items-center gap-3">
          <img src="/maskmind.png" alt="MaskMind logo" className="h-9 w-9" />
          <h1 className="text-2xl font-semibold">Reset your password</h1>
        </div>
        <p className="mt-2 text-sm text-stone-600">
          Enter your email to receive a reset code.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSendCode}>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-stone-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-full bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send code'}
          </button>
        </form>

        <div className="mt-6 h-px bg-stone-200" />

        <form className="mt-6 space-y-4" onSubmit={handleResetPassword}>
          <div>
            <label className="block text-sm font-medium">Reset code</label>
            <input
              className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-stone-500"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">New password</label>
            <input
              type="password"
              className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-stone-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {message ? <p className="text-sm text-[var(--warning)]">{message}</p> : null}
          <button
            type="submit"
            disabled={resetLoading}
            className="w-full cursor-pointer rounded-full bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {resetLoading ? 'Updating...' : 'Reset password'}
          </button>
        </form>

        <p className="mt-4 text-sm text-stone-600">
          Remembered your password?{' '}
          <a className="font-semibold text-black" href="/sign-in">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
