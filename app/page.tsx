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

  const [searchAge, setSearchAge] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [addStatus, setAddStatus] = useState("");

  // --- NEW: State for inline editing ---
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
  });

  const searchPlayersByAge = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setHasSearched(true);
    setEditingId(null); // Close any open edits when searching

    try {
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

      setForm({ firstName: "", lastName: "", age: "" });
      setAddStatus("Player added successfully!");
      setTimeout(() => setAddStatus(""), 3000);

      // Optional: Automatically trigger a search to show the new player if age matches
      if (searchAge === form.age) {
        document.getElementById("searchBtn")?.click();
      }
    } catch (error) {
      console.error("Failed to create player:", error);
    }
  };

  // --- NEW: Delete functionality ---
  const deletePlayer = async (id: string) => {
    // Optional: Add a quick confirmation so users don't accidentally delete
    if (!confirm("Are you sure you want to delete this player?")) return;

    try {
      await fetch("/api/players", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      // Immediately remove the player from the UI
      setPlayers(players.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete player:", error);
    }
  };

  // --- NEW: Update functionality ---
  const startEditing = (player: Player) => {
    setEditingId(player.id);
    setEditForm({
      firstName: player.firstName,
      lastName: player.lastName,
      age: String(player.age),
    });
  };

  const saveUpdate = async (id: string) => {
    try {
      const res = await fetch("/api/players", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editForm }),
      });
      const updatedPlayer = await res.json();

      // Update the specific player in our UI state
      setPlayers(players.map((p) => (p.id === id ? updatedPlayer : p)));
      setEditingId(null); // Close the edit view
    } catch (error) {
      console.error("Failed to update player:", error);
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
              placeholder="Enter age to search (leave blank for all)..."
              value={searchAge}
              onChange={(e) => setSearchAge(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 text-white placeholder-slate-400 px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              id="searchBtn"
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* --- LIST SECTION --- */}
        <div className="bg-slate-800 rounded-lg shadow-md overflow-hidden min-h-[100px]">
          {isLoading ? (
            <div className="p-6 text-center text-slate-400">Searching...</div>
          ) : !hasSearched ? (
            <div className="p-6 text-center text-slate-500">
              Enter an age above to see results.
            </div>
          ) : players.length === 0 ? (
            <div className="p-6 text-center text-slate-400">
              No players found.
            </div>
          ) : (
            <ul className="divide-y divide-slate-700">
              {players.map((p) => (
                <li
                  key={p.id}
                  className="p-4 hover:bg-slate-700/30 transition-colors"
                >
                  {/* --- CONDITIONAL RENDERING: Edit Mode vs View Mode --- */}
                  {editingId === p.id ? (
                    // EDIT MODE UI
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                      <input
                        value={editForm.firstName}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            firstName: e.target.value,
                          })
                        }
                        className="flex-1 bg-slate-600 text-white px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        value={editForm.lastName}
                        onChange={(e) =>
                          setEditForm({ ...editForm, lastName: e.target.value })
                        }
                        className="flex-1 bg-slate-600 text-white px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        value={editForm.age}
                        onChange={(e) =>
                          setEditForm({ ...editForm, age: e.target.value })
                        }
                        className="w-20 bg-slate-600 text-white px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveUpdate(p.id)}
                          className="bg-green-600 hover:bg-green-500 px-4 py-1 rounded text-sm font-semibold"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-slate-600 hover:bg-slate-500 px-4 py-1 rounded text-sm font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // VIEW MODE UI
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center gap-4">
                        <span className="font-medium text-lg">
                          {p.firstName} {p.lastName}
                        </span>
                        <span className="bg-slate-700 text-slate-300 py-1 px-3 rounded-full text-sm font-semibold">
                          Age {p.age}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 opacity-80 hover:opacity-100">
                        <button
                          onClick={() => startEditing(p)}
                          className="bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deletePlayer(p.id)}
                          className="bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
