"use client";

import { useState } from "react";

interface Player {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
}

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [form, setForm] = useState({ firstName: "", lastName: "", age: "" });

  // New states for the search feature
  const [searchAge, setSearchAge] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [addStatus, setAddStatus] = useState("");

  const searchPlayersByAge = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setHasSearched(true);

    try {
      // Append the age as a query parameter to the URL
      const url = searchAge ? `/api/players?age=${searchAge}` : "/api/players";
      const res = await fetch(url);
      const data = await res.json();
      setPlayers(data);
    } catch (error) {
      console.error("Failed to fetch players:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.age) return;

    try {
      await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      // Clear the form and show a temporary success message
      setForm({ firstName: "", lastName: "", age: "" });
      setAddStatus("Player added successfully!");
      setTimeout(() => setAddStatus(""), 3000);
    } catch (error) {
      console.error("Failed to create player:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-white">🔥 DB Test</h1>

        {/* --- ADD PLAYER SECTION --- */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-slate-300">
            Add a New Player
          </h2>
          <form
            onSubmit={createPlayer}
            className="bg-slate-800 p-6 rounded-lg shadow-md flex flex-col sm:flex-row gap-4"
          >
            <input
              placeholder="First name"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="flex-1 bg-slate-700 text-white placeholder-slate-400 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              placeholder="Last name"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="flex-1 bg-slate-700 text-white placeholder-slate-400 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="number"
              placeholder="Age"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              className="w-24 bg-slate-700 text-white placeholder-slate-400 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-2 rounded transition-colors"
            >
              Add
            </button>
          </form>
          {addStatus && (
            <p className="text-green-400 mt-2 ml-1 text-sm">{addStatus}</p>
          )}
        </div>

        <hr className="border-slate-700 mb-8" />

        {/* --- SEARCH PLAYERS SECTION --- */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-slate-300">
            Find Players by Age
          </h2>
          <form onSubmit={searchPlayersByAge} className="flex gap-4">
            <input
              type="number"
              placeholder="Enter age to search..."
              value={searchAge}
              onChange={(e) => setSearchAge(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 text-white placeholder-slate-400 px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* List Section */}
        <div className="bg-slate-800 rounded-lg shadow-md overflow-hidden min-h-[100px]">
          {isLoading ? (
            <div className="p-6 text-center text-slate-400">Searching...</div>
          ) : !hasSearched ? (
            <div className="p-6 text-center text-slate-500">
              Enter an age above to see results.
            </div>
          ) : players.length === 0 ? (
            <div className="p-6 text-center text-slate-400">
              No players found with that age.
            </div>
          ) : (
            <ul className="divide-y divide-slate-700">
              {players.map((p) => (
                <li
                  key={p.id}
                  className="p-4 flex justify-between items-center hover:bg-slate-700/50 transition-colors"
                >
                  <span className="font-medium text-lg">
                    {p.firstName} {p.lastName}
                  </span>
                  <span className="bg-slate-700 text-slate-300 py-1 px-3 rounded-full text-sm font-semibold">
                    Age {p.age}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
