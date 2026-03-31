'use client'

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function VerifyPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [expirySeconds, setExpirySeconds] = useState<number | null>(null);
  const [expiryAt, setExpiryAt] = useState<Date | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const presetUsername = params.get('username');
    if (presetUsername) setUsername(presetUsername);
  }, []);

  const fetchExpiry = useCallback(async () => {
    try {
      const res = await fetch('/api/verify-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (!res.ok) return;
      const exp = new Date(data.verifyCodeExpiry);
      setExpiryAt(exp);
    } catch (error) {
      console.error('Fetch expiry error:', error);
    }
  }, [username]);

  useEffect(() => {
    if (!username) return;
    const handle = setTimeout(() => {
      fetchExpiry();
    }, 500);
    return () => clearTimeout(handle);
  }, [username, fetchExpiry]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      if (expiryAt) {
        const remaining = Math.max(
          0,
          Math.floor((expiryAt.getTime() - Date.now()) / 1000)
        );
        setExpirySeconds(remaining);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [expiryAt]);

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

      setMessage('Email verified. Redirecting to sign in...');
      router.push('/sign-in?verified=1');
    } catch (error) {
      console.error('Verification error:', error);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!username) {
      setMessage('Enter your username first.');
      return;
    }
    if (cooldown > 0) return;
    setResending(true);
    setMessage('');
    try {
      const res = await fetch('/api/resend-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data?.message || 'Failed to resend code');
        return;
      }
      setMessage('Verification code resent. Check your email.');
      setCooldown(60);
      const nextExpiry = new Date(Date.now() + 60 * 60 * 1000);
      setExpiryAt(nextExpiry);
    } catch (error) {
      console.error('Resend error:', error);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setResending(false);
    }
  }


  return (
    <div className="mx-auto flex min-h-[80vh] max-w-5xl items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-stone-200 bg-white/90 p-8 shadow-[0_18px_50px_rgba(15,12,8,0.08)]">
        <div className="flex items-center gap-3">
          <Image src="/maskmind.png" alt="MaskMind logo" width={36} height={36} />
          <h1 className="text-2xl font-semibold">Verify your email</h1>
        </div>
        <p className="mt-2 text-sm text-stone-600">
          Enter the 6-digit code sent to your email.
        </p>
        <p className="mt-1 text-xs text-stone-500">
          Note: New senders can land in Spam/Junk. Please check there too.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleVerify}>
        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-stone-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Verification code</label>
          <input
            className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-stone-500"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            maxLength={6}
          />
        </div>

        {message ? <p className="text-sm text-[var(--warning)]">{message}</p> : null}

        {expirySeconds !== null ? (
          <p className="text-xs text-stone-500">
            Code expires in {Math.floor(expirySeconds / 60)}m {expirySeconds % 60}s
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer w-full rounded-full bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={resending || cooldown > 0}
          className="cursor-pointer w-full rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold transition-colors hover:bg-[#ff3b30] hover:text-white disabled:opacity-50"
        >
          {resending
            ? 'Resending...'
            : cooldown > 0
              ? `Resend in ${cooldown}s`
              : 'Resend code'}
        </button>
      </form>
      </div>
    </div>
  );
}
