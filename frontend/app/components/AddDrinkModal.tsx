"use client";

import { useEffect, useRef, useState } from "react";
import { addParticipation } from "../lib/api";

interface AddDrinkModalProps {
  existingDrinkIds: string[];
  onClose: () => void;
  onContributed: () => void;
}

const LS_KEY = "connected_user_id";

export function AddDrinkModal({ existingDrinkIds, onClose, onContributed }: AddDrinkModalProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [drinkName, setDrinkName] = useState("");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState<"liquid" | "unit">("liquid");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUserId(localStorage.getItem(LS_KEY));
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const drinkId = drinkName.trim().toLowerCase().replace(/\s+/g, "_");
  const alreadyExists = existingDrinkIds.includes(drinkId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return setError("Connecte-toi d'abord.");
    if (!drinkName.trim()) return setError("Nom du drink requis.");
    if (alreadyExists) return setError("Ce drink est déjà dans la liste.");
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) return setError("Quantité invalide.");
    setLoading(true);
    setError(null);
    try {
      await addParticipation(userId, drinkId, parsed, unit);
      setSuccess(true);
      onContributed();
    } catch {
      setError("Erreur lors de l'envoi. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="bg-[#1c1b19] text-[#cfc8c3] rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#2e2c2a]">
          <h2 className="text-lg font-semibold">Ajouter un drink</h2>
          <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-opacity" aria-label="Fermer">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5">
          {!userId ? (
            <p className="text-sm opacity-60 py-2">
              Connecte-toi via l&apos;icône utilisateur pour pouvoir participer.
            </p>
          ) : success ? (
            <div className="text-center py-4">
              <p className="text-lg font-semibold mb-1">Ajouté ! 🎉</p>
              <p className="text-sm opacity-60">Le drink a bien été enregistré.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs opacity-50 uppercase tracking-widest mb-2">Nom du drink</label>
                <input
                  type="text"
                  value={drinkName}
                  onChange={(e) => {
                    setDrinkName(e.target.value);
                    setError(null);
                  }}
                  placeholder="ex: Aperol Spritz"
                  className="w-full bg-[#2e2c2a] rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#cfc8c3]/40 placeholder:opacity-30"
                  required
                />
                {alreadyExists && drinkName.trim() && (
                  <p className="text-xs text-amber-400 mt-1">Ce drink est déjà dans la liste.</p>
                )}
              </div>

              <div>
                <label className="block text-xs opacity-50 uppercase tracking-widest mb-2">
                  Quantité que tu ramènes
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="ex: 1.5"
                    className="flex-1 bg-[#2e2c2a] rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#cfc8c3]/40 placeholder:opacity-30"
                    required
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as "liquid" | "unit")}
                    className="bg-[#2e2c2a] rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#cfc8c3]/40"
                  >
                    <option value="liquid">Litres</option>
                    <option value="unit">Unités</option>
                  </select>
                </div>
              </div>

              {error && <p className="text-xs text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={loading || alreadyExists}
                className="w-full bg-[#cfc8c3] text-[#1c1b19] font-semibold rounded-lg py-2.5 text-sm transition-opacity disabled:opacity-50 hover:opacity-90"
              >
                {loading ? "Envoi…" : "Je ramène ça 🍾"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
