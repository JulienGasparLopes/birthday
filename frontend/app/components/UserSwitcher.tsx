"use client";

import { useEffect, useRef, useState } from "react";
import { fetchUsers, ApiUser } from "../lib/api";

const LS_KEY = "connected_user_id";

export function UserSwitcher() {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveId(localStorage.getItem(LS_KEY));
    fetchUsers().then(setUsers).catch(console.error);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  function select(user: ApiUser) {
    localStorage.setItem(LS_KEY, user.id);
    setActiveId(user.id);
    setOpen(false);
    window.dispatchEvent(new Event("user-changed"));
  }

  const active = users.find((u) => u.id === activeId);

  return (
    <div className="fixed top-4 right-4 z-50" ref={modalRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-center w-9 h-9 rounded-full bg-[#2e2c2a] text-[#cfc8c3] hover:bg-[#3e3c3a] transition-colors"
        aria-label="Switch user"
        title={active ? active.name : "Select user"}
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

      {open && (
        <div className="absolute top-11 right-0 w-48 rounded-xl bg-[#2e2c2a] shadow-xl overflow-hidden">
          <p className="px-4 py-2 text-xs text-[#cfc8c3] opacity-50 uppercase tracking-widest">Connexion</p>
          {users.length === 0 && <p className="px-4 py-3 text-sm text-[#cfc8c3] opacity-50">Chargement</p>}
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => select(user)}
              className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left transition-colors
                ${user.id === activeId ? "bg-[#cfc8c3] text-[#1c1b19] font-semibold" : "text-[#cfc8c3] hover:bg-[#3e3c3a]"}`}
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1c1b19] text-[#cfc8c3] text-xs font-bold shrink-0">
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
      )}
    </div>
  );
}
