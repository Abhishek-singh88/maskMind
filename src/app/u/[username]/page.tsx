'use client'

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
    <div className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-semibold">Send an anonymous message</h1>
      <p className="mt-2 text-sm text-gray-600">
        To: <span className="font-medium">@{username}</span>
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium">Your message</label>
          <textarea
            className="mt-1 w-full rounded border px-3 py-2"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        {message ? <p className="text-sm text-gray-700">{message}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send message'}
        </button>
      </form>
    </div>
  );
}
