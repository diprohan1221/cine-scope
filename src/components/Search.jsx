// src/components/Search.jsx
import React, { useEffect, useRef } from 'react';

export default function Search({ value = '', onChange = () => {} }) {
  const ref = useRef(null);

  // keyboard shortcut "/" focuses the field
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const active = document.activeElement;
        const tag = active && active.tagName && active.tagName.toLowerCase();
        const editing = active && (tag === 'input' || tag === 'textarea' || active.isContentEditable);
        if (editing) return;
        e.preventDefault();
        ref.current?.focus();
        ref.current?.select();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="relative">
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search movies (press / to focus)"
        className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        aria-label="Search movies"
      />
      {value && (
        <button
          aria-label="Clear search"
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 hover:bg-gray-100"
        >
          ✕
        </button>
      )}
    </div>
  );
}
