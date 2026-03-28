export default function Home() {
  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-3xl font-bold">MaskMind</h1>
      <p className="mt-2 text-sm text-gray-600">
        Receive anonymous messages from anyone.
      </p>
      <div className="mt-6 flex gap-3">
        <a className="rounded bg-black px-4 py-2 text-white" href="/sign-up">
          Get started
        </a>
        <a className="rounded border px-4 py-2" href="/sign-in">
          Sign in
        </a>
      </div>
    </div>
  );
}
