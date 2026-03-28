'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const presetUsername = searchParams.get('username');
    if (presetUsername) setUsername(presetUsername);
  }, [searchParams]);

  async function handleVerify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, code }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data?.message || 'Verification failed');
        return;
      }

      setMessage('Email verified. You can now sign in.');
      router.push('/sign-in');
    } catch (error) {
      console.error('Verification error:', error);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold">Verify your email</h1>
      <p className="mt-2 text-sm text-gray-600">
        Enter the 6-digit code sent to your email.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleVerify}>
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
          <label className="block text-sm font-medium">Verification code</label>
          <input
            className="mt-1 w-full rounded border px-3 py-2"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            maxLength={6}
          />
        </div>

        {message ? <p className="text-sm text-gray-700">{message}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>
    </div>
  );
}
