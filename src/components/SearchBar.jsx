// src/components/SearchBar.jsx
import React, { useState, useRef, useEffect } from "react";

export default function SearchBar({ query, setQuery, searching }) {
  const searchInputRef = useRef(null);

  // Focus shortcut: press "/" to focus search
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const active = document.activeElement;
      const tag = active && active.tagName && active.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || active.isContentEditable) return;

      if (e.key === "/") {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          searchInputRef.current.select();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const onClear = () => setQuery("");

  return (
    <div className="flex-1 max-w-md relative">
      <input
        ref={searchInputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies (press / to focus)"
        className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        aria-label="Search movies"
      />
      {query && (
        <button
          onClick={onClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 hover:bg-gray-100"
          title="Clear"
        >
          ✕
        </button>
      )}
      {searching && <p className="text-sm text-gray-500 mt-1">Searching for "{query}"…</p>}
    </div>
  );
}
