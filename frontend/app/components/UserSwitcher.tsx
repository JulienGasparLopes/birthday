"use client";

import { useEffect, useRef, useState } from "react";
import { fetchUsers, ApiUser } from "../lib/api";

const LS_KEY = "connected_user_id";

export function UserSwitcher() {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveId(localStorage.getItem(LS_KEY));
    fetchUsers().then(setUsers).catch(console.error);
  }, []);

  useEffect(() => {
    if (open) {
      setSearch("");
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function select(user: ApiUser) {
    localStorage.setItem(LS_KEY, user.id);
    setActiveId(user.id);
    setOpen(false);
    window.dispatchEvent(new Event("user-changed"));
  }

  const active = users.find((u) => u.id === activeId);

  const filtered = users
    .filter((u) => u.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));

  return (
    <>
      {/* Trigger button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-[#2e2c2a] text-[#cfc8c3] hover:bg-[#3e3c3a] transition-colors"
          aria-label="Switch user"
          title={active ? active.name : "Se connecter"}
        >
          {active ? (
            <span className="text-sm font-semibold leading-none">{active.name[0].toUpperCase()}</span>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          )}
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === overlayRef.current) setOpen(false);
          }}
        >
          <div className="bg-[#2e2c2a] text-[#cfc8c3] rounded-2xl shadow-2xl w-full max-w-xs mx-4 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#1c1b19]/40">
              <div>
                <p className="text-xs uppercase tracking-widest opacity-50">Connexion</p>
                {active && (
                  <p className="text-xs mt-0.5 opacity-70">Connecté en tant que <span className="font-semibold text-[#cfc8c3] opacity-100">{active.name}</span></p>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="opacity-40 hover:opacity-100 transition-opacity"
                aria-label="Fermer"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Search */}
            <div className="px-4 pt-3 pb-2">
              <div className="flex items-center gap-2 bg-[#1c1b19] rounded-lg px-3 py-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-40 shrink-0"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:opacity-30"
                />
              </div>
            </div>

            {/* User list */}
            <div className="overflow-y-auto max-h-64 pb-2">
              {users.length === 0 && <p className="px-5 py-3 text-sm opacity-40">Aucun utilisateur.</p>}
              {filtered.length === 0 && users.length > 0 && (
                <p className="px-5 py-3 text-sm opacity-40">Aucun résultat.</p>
              )}
              {filtered.map((user) => (
                <button
                  key={user.id}
                  onClick={() => select(user)}
                  className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left transition-colors
                    ${user.id === activeId ? "bg-[#cfc8c3] text-[#1c1b19] font-semibold" : "hover:bg-[#3e3c3a]"}`}
                >
                  <span
                    className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0
                    ${user.id === activeId ? "bg-[#1c1b19] text-[#cfc8c3]" : "bg-[#1c1b19] text-[#cfc8c3]"}`}
                  >
                    {user.name[0].toUpperCase()}
                  </span>
                  {user.name}
                  {user.id === activeId && (
                    <svg
                      className="ml-auto"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
