// src/App.jsx
import React, { useState } from "react";
import MovieList from "./components/MovieList";
import SearchBar from "./components/SearchBar";
import Auth from "./components/Auth";

export default function App() {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex flex-col sm:flex-row items-center justify-between py-6 px-6 gap-4">
        <h1 className="text-3xl font-bold text-blue-600">Hello, CineScope</h1>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <SearchBar query={query} setQuery={setQuery} searching={searching} />
          <Auth />
        </div>
      </header>

      <main>
        <MovieList query={query} setSearching={setSearching} />
      </main>
    </div>
  );
}
