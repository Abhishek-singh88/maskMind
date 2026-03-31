'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function PublicProfilePage() {
  const params = useParams<{ username: string }>();
  const username = params?.username;
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, content }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data?.message || 'Failed to send message');
        return;
      }

      setContent('');
      setMessage('Message sent anonymously');
    } catch (error) {
      console.error('Send message error:', error);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-5xl items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-stone-200 bg-white/90 p-8 shadow-[0_18px_50px_rgba(15,12,8,0.08)]">
        <div className="flex items-center gap-3">
          <Image src="/maskmind.png" alt="MaskMind logo" width={36} height={36} />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
              MaskMind
            </p>
            <h1 className="text-2xl font-semibold">Send an anonymous message</h1>
          </div>
        </div>
        <p className="mt-2 text-sm text-stone-600">
          To: <span className="font-medium">@{username}</span>
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium">Your message</label>
          <textarea
            className="mt-1 w-full rounded-2xl border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-stone-500"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        {message ? <p className="text-sm text-[var(--warning)]">{message}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer w-full rounded-full bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send message'}
        </button>
      </form>

        <div className="mt-6 space-y-1 text-center text-xs text-stone-500">
          <p>Want your own anonymous inbox?</p>
          <Link className="font-semibold text-black" href="/">
            Create yours on MaskMind
          </Link>
        </div>
      </div>
    </div>
  );
}
