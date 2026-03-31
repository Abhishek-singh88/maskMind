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
  const [copied, setCopied] = useState(false);

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
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src="/maskmind.png" alt="MaskMind logo" className="h-9 w-9" />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
              MaskMind
            </p>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="mt-1 text-sm text-stone-600">
              Manage your anonymous inbox.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="cursor-pointer rounded-full border border-stone-300 px-4 py-2 text-sm transition-colors hover:bg-[#ff3b30] hover:text-white"
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
            className="cursor-pointer rounded-full border border-stone-300 px-4 py-2 text-sm transition-colors hover:bg-[#ff3b30] hover:text-white"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-stone-200 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,12,8,0.08)]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Inbox</h2>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-stone-600">Accepting</span>
              <button
                className={`cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  accepting ? 'bg-black text-white' : 'border border-stone-300'
                }`}
                onClick={() => updateAccepting(!accepting)}
                disabled={toggleLoading}
              >
                {accepting ? 'On' : 'Off'}
              </button>
            </div>
          </div>

          {error ? <p className="mt-3 text-sm text-[var(--warning)]">{error}</p> : null}

          {loading ? (
            <p className="mt-4 text-sm text-stone-600">Loading...</p>
          ) : messages.length === 0 ? (
            <p className="mt-4 text-sm text-stone-600">
              No messages yet. Share your link to receive anonymous messages.
            </p>
          ) : (
            <div className="mt-4 rounded-2xl border border-stone-200 bg-white">
              <ul className="max-h-[420px] space-y-3 overflow-y-auto p-4">
                {messages.slice(0, 40).map((msg) => (
                  <li
                    key={msg._id || msg.createAt.toString()}
                    className="rounded-2xl border border-stone-200 bg-white p-4 transition-shadow hover:shadow-[0_12px_30px_rgba(15,12,8,0.12)]"
                  >
                    <p className="text-sm">{msg.content}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-stone-500">
                      <span>{new Date(msg.createAt).toLocaleString()}</span>
                      <button
                        className="cursor-pointer rounded-full border border-stone-300 px-3 py-1 text-xs transition-colors hover:bg-[#ff3b30] hover:text-white"
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
            </div>
          )}
        </div>

        <div className="space-y-4">
          {username ? (
            <div className="rounded-3xl border border-stone-200 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,12,8,0.08)]">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Your public link
              </p>
              <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-[var(--bg-accent)] px-3 py-2 text-sm font-semibold">
                <span className="truncate">/u/{username}</span>
                <button
                  className="cursor-pointer rounded-full border border-stone-300 bg-white px-3 py-1 text-xs transition-colors hover:bg-[#ff3b30] hover:text-white"
                  onClick={async () => {
                    const url = `${window.location.origin}/u/${username}`;
                    await navigator.clipboard.writeText(url);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                >
                  <span className="inline-flex items-center gap-1">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    {copied ? 'Copied' : 'Copy'}
                  </span>
                </button>
              </div>
            </div>
          ) : null}

          <div className="rounded-3xl border border-stone-200 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,12,8,0.08)]">
            <h2 className="text-lg font-semibold">Blocked words</h2>
            <p className="mt-1 text-sm text-stone-600">
              Messages containing any of these words will be blocked.
            </p>
            <textarea
              className="mt-3 w-full rounded-2xl border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-stone-500"
              rows={3}
              value={blockedInput}
              onChange={(e) => setBlockedInput(e.target.value)}
              placeholder="spam, scam, abuse"
            />
            <button
              className="mt-3 cursor-pointer rounded-full bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              onClick={saveBlockedWords}
              disabled={blockingLoading}
            >
              {blockingLoading ? 'Saving...' : 'Save blocked words'}
            </button>
            {blockedWords.length ? (
              <p className="mt-2 text-xs text-stone-600">
                Active: {blockedWords.join(', ')}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
