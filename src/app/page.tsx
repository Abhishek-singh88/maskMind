export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10">
        <header className="flex items-center justify-between">
          <a className="flex items-center gap-2 text-lg font-semibold" href="/">
            <img src="/maskmind.png" alt="MaskMind logo" className="h-7 w-7" />
            MaskMind
          </a>
          <nav className="flex items-center gap-3 text-sm text-stone-600">
            <a className="rounded-full border border-stone-300 px-4 py-2" href="/sign-in">
              Sign in
            </a>
          </nav>
        </header>

        <section className="relative mt-10 grid flex-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="absolute -left-24 top-10 h-56 w-56 rounded-full bg-[#f0dfc2] blur-3xl" />
          <div className="absolute -right-20 bottom-10 h-64 w-64 rounded-full bg-[#efe1cf] blur-3xl" />

          <div className="relative fade-up">
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
              Quiet confidence for honest feedback
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
              Anonymous messages, curated for clarity.
            </h1>
            <p className="mt-4 text-base text-stone-600">
              Give people a safe channel to speak up while you keep the experience
              clean, focused, and respectful.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                className="rounded-full bg-black px-7 py-3.5 text-base font-extrabold !text-white shadow-[0_14px_28px_rgba(15,12,8,0.28)] ring-1 ring-white/20"
                href="/sign-up"
              >
                Start your inbox
              </a>
              <a
                className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold"
                href="/sign-in"
              >
                Sign in
              </a>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { title: 'Private inbox', text: 'Only you see the messages.' },
                { title: 'Spam control', text: 'Block words and patterns.' },
                { title: 'Instant share', text: 'Your public link in one click.' },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-stone-200 bg-white/80 p-4">
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="mt-2 text-xs text-stone-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="float-slow rounded-3xl border border-stone-200 bg-white/80 p-6 shadow-[0_22px_60px_rgba(15,12,8,0.12)]">
              <div className="rounded-2xl border border-stone-200 bg-[var(--bg-accent)] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-600">
                  Your public link
                </p>
                <p className="mt-2 text-lg font-semibold">maskmind.app/u/you</p>
              </div>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-stone-200 bg-white p-4">
                  <p className="text-sm font-medium">Anonymous</p>
                  <p className="mt-2 text-xs text-stone-600">
                    “Your projects are sharp. Share more behind-the-scenes!”
                  </p>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-white p-4">
                  <p className="text-sm font-medium">Anonymous</p>
                  <p className="mt-2 text-xs text-stone-600">
                    “I love the new branding. The tone feels confident.”
                  </p>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-white p-4">
                  <p className="text-sm font-medium">Anonymous</p>
                  <p className="mt-2 text-xs text-stone-600">
                    “Shorter captions would make the feed feel calmer.”
                  </p>
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-4 text-xs text-stone-600">
                Filters on • Accepting messages
              </div>
            </div>
            <div className="absolute -right-6 -top-6 hidden rounded-2xl border border-stone-200 bg-white/90 px-4 py-3 text-xs text-stone-600 shadow-[0_18px_40px_rgba(15,12,8,0.12)] lg:block">
              38 messages this week
            </div>
            <div className="absolute -left-6 -bottom-6 hidden rounded-2xl border border-stone-200 bg-white/90 px-4 py-3 text-xs text-stone-600 shadow-[0_18px_40px_rgba(15,12,8,0.12)] lg:block">
              3 blocked phrases
            </div>
          </div>
        </section>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { title: 'Quiet brand', text: 'Neutral palette built for focus.' },
            { title: 'Soft contrast', text: 'Readable, calm, and easy on the eyes.' },
            { title: 'Respectful by design', text: 'Set boundaries with filters.' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-stone-200 bg-white/80 p-4">
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="mt-2 text-xs text-stone-600">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
