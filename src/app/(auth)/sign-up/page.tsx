'use client'

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignUpPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/signUp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data?.message || 'Failed to sign up');
        return;
      }

      setMessage('Sign up successful. Check your email for the verification code.');
      router.push(`/verify?username=${encodeURIComponent(username)}`);
    } catch (error) {
      console.error('Sign up error:', error);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold">Create your account</h1>
      <p className="mt-2 text-sm text-gray-600">Sign up to receive anonymous messages.</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            className="mt-1 w-full rounded border px-3 py-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="mt-1 w-full rounded border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            className="mt-1 w-full rounded border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {message ? <p className="text-sm text-gray-700">{message}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{' '}
        <a className="text-black underline" href="/sign-in">
          Sign in
        </a>
      </p>
    </div>
  );
}
