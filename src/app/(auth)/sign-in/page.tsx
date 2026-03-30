'use client'

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignInPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-5xl items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-stone-200 bg-white/90 p-8 shadow-[0_18px_50px_rgba(15,12,8,0.08)]">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
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
          className="w-full rounded-full bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        </form>

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
