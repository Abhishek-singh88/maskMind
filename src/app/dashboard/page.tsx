'use client'

import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

type Message = {
  _id?: string;
  content: string;
  createAt: string | Date;
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const username = session?.user?.username;
  const [messages, setMessages] = useState<Message[]>([]);
  const [accepting, setAccepting] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toggleLoading, setToggleLoading] = useState(false);
  const [blockedWords, setBlockedWords] = useState<string[]>([]);
  const [blockedInput, setBlockedInput] = useState('');
  const [blockingLoading, setBlockingLoading] = useState(false);

  async function fetchMessages() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || 'Failed to fetch messages');
        return;
      }
      setMessages(data.messages || []);
      setAccepting(Boolean(data.isAcceptingMessages));
    } catch (err) {
      console.error('Fetch messages error:', err);
      setError('Something went wrong while loading messages.');
    } finally {
      setLoading(false);
    }
  }

  async function fetchBlockedWords() {
    try {
      const res = await fetch('/api/block-words');
      const data = await res.json();
      if (res.ok) {
        setBlockedWords(data.blockedWords || []);
        setBlockedInput((data.blockedWords || []).join(', '));
      }
    } catch (err) {
      console.error('Fetch blocked words error:', err);
    }
  }

  async function updateAccepting(nextValue: boolean) {
    setToggleLoading(true);
    setError('');
    try {
      const res = await fetch('/api/accept-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acceptMessages: nextValue }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || 'Failed to update status');
        return;
      }
      setAccepting(Boolean(data.isAcceptingMessages));
    } catch (err) {
      console.error('Update accepting error:', err);
      setError('Something went wrong while updating status.');
    } finally {
      setToggleLoading(false);
    }
  }

  useEffect(() => {
    fetchMessages();
    fetchBlockedWords();
  }, []);

  async function saveBlockedWords() {
    setBlockingLoading(true);
    setError('');
    try {
      const words = blockedInput
        .split(',')
        .map((w) => w.trim())
        .filter(Boolean);
      const res = await fetch('/api/block-words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockedWords: words }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || 'Failed to update blocked words');
        return;
      }
      setBlockedWords(data.blockedWords || []);
    } catch (err) {
      console.error('Save blocked words error:', err);
      setError('Something went wrong while updating blocked words.');
    } finally {
      setBlockingLoading(false);
    }
  }

  async function deleteMessage(messageId?: string) {
    if (!messageId) return;
    try {
      const res = await fetch('/api/delete-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId }),
      });
      if (res.ok) {
        fetchMessages();
      }
    } catch (err) {
      console.error('Delete message error:', err);
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your anonymous inbox.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded border px-3 py-2 text-sm"
            onClick={() => {
              fetchMessages();
              fetchBlockedWords();
            }}
            disabled={loading}
            aria-label="Refresh"
            title="Refresh"
          >
            <span className="inline-flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                <path d="M21 3v6h-6" />
              </svg>
              Refresh
            </span>
          </button>
          <button
            className="rounded border px-4 py-2"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <label className="text-sm font-medium">Accept messages</label>
        <button
          className={`rounded px-3 py-1 text-sm ${
            accepting ? 'bg-black text-white' : 'border'
          }`}
          onClick={() => updateAccepting(!accepting)}
          disabled={toggleLoading}
        >
          {accepting ? 'On' : 'Off'}
        </button>
      </div>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      {username ? (
        <div className="mt-4 rounded border p-3 text-sm">
          <p className="font-medium">Your public link</p>
          <p className="mt-1 break-all">/u/{username}</p>
        </div>
      ) : null}

      <div className="mt-6">
        <h2 className="text-lg font-semibold">Messages</h2>
        {loading ? (
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        ) : messages.length === 0 ? (
          <p className="mt-2 text-sm text-gray-600">
            No messages yet. Share your link to receive anonymous messages.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {messages.map((msg) => (
              <li key={msg._id || msg.createAt.toString()} className="rounded border p-3">
                <p className="text-sm">{msg.content}</p>
                <p className="mt-2 text-xs text-gray-500">
                  {new Date(msg.createAt).toLocaleString()}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    className="rounded border px-2 py-1 text-xs"
                    onClick={() => deleteMessage(msg._id)}
                  >
                    <span className="inline-flex items-center gap-1">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M3 6h18" />
                        <path d="M8 6V4h8v2" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                      </svg>
                      Delete
                    </span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold">Blocked Words</h2>
        <p className="mt-1 text-sm text-gray-600">
          Messages containing any of these words will be blocked.
        </p>
        <textarea
          className="mt-3 w-full rounded border px-3 py-2"
          rows={3}
          value={blockedInput}
          onChange={(e) => setBlockedInput(e.target.value)}
          placeholder="spam, scam, abuse"
        />
        <button
          className="mt-3 rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          onClick={saveBlockedWords}
          disabled={blockingLoading}
        >
          {blockingLoading ? 'Saving...' : 'Save blocked words'}
        </button>
        {blockedWords.length ? (
          <p className="mt-2 text-xs text-gray-600">
            Active: {blockedWords.join(', ')}
          </p>
        ) : null}
      </div>
    </div>
  );
}
