"use client";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-purple-600 via-pink-500 to-orange-400 text-white font-sans">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-5xl font-bold drop-shadow-lg">
          🚀 Docker Test Zone Final
        </h1>

        <p className="text-lg opacity-90">
          If you see this running inside Docker… you’ve officially won.
        </p>

        <div className="flex flex-col items-center gap-3">
          <div className="px-6 py-3 bg-black/30 rounded-full">
            Next.js + Docker = 🔥
          </div>
          <div className="text-sm opacity-80">
            Build • Ship • Break • Fix • Repeat
          </div>
          npm
        </div>

        <button
          onClick={() => alert("Docker is alive 🐳")}
          className="mt-6 px-6 py-3 bg-white text-black rounded-full font-semibold hover:scale-105 transition"
        >
          Test Click
        </button>
      </div>
    </div>
  );
}
