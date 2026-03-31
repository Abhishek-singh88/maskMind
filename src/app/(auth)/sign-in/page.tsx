'use client'

import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (searchParams.get('verified') === '1') {
      setToast('Email verified. Please sign in.');
      const t = setTimeout(() => setToast(''), 3000);
      return () => clearTimeout(t);
    }
    return;
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        identifier,
        password,
        callbackUrl: '/dashboard',
      });

      if (!res) {
        setMessage('Sign in failed. No response from server.');
        setLoading(false);
        return;
      }

      if (res.error) {
        const friendly =
          res.error === 'CredentialsSignin'
            ? 'Incorrect email/username or password.'
            : res.error;
        setMessage(friendly);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setMessage(`Sign in failed (status ${res.status}).`);
        setLoading(false);
        return;
      }

      setLoading(false);
      const target = res.url || '/dashboard';
      router.push(target);
    } catch (error) {
      console.error('Sign in error:', error);
      setMessage('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    setMessage('');
    await signIn('google', { callbackUrl: '/dashboard' });
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-5xl items-center justify-center px-6 py-12">
      {toast ? (
        <div className="fixed right-6 top-6 z-50 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm shadow-[0_12px_30px_rgba(15,12,8,0.18)]">
          {toast}
        </div>
      ) : null}
      <div className="w-full max-w-md rounded-3xl border border-stone-200 bg-white/90 p-8 shadow-[0_18px_50px_rgba(15,12,8,0.08)]">
        <div className="flex items-center gap-3">
          <img src="/maskmind.png" alt="MaskMind logo" className="h-9 w-9" />
          <h1 className="text-2xl font-semibold">Welcome back</h1>
        </div>
        <p className="mt-2 text-sm text-stone-600">Sign in to your account.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium">Email or Username</label>
          <input
            className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-stone-500"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
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
          disabled={loading}
          className="w-full cursor-pointer rounded-full bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        <a className="text-xs font-semibold text-black" href="/forgot-password">
          Forgot password?
        </a>
      </form>

        <div className="mt-6 flex items-center gap-3 text-xs text-stone-500">
          <span className="h-px flex-1 bg-stone-200" />
          OR
          <span className="h-px flex-1 bg-stone-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleLoading}
          className="mt-6 w-full cursor-pointer rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold transition-colors hover:bg-[#ff3b30] hover:text-white disabled:opacity-50"
        >
          {googleLoading ? 'Connecting to Google...' : 'Continue with Google'}
        </button>

        <p className="mt-4 text-sm text-stone-600">
          Don&apos;t have an account?{' '}
          <a className="font-semibold text-black" href="/sign-up">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
