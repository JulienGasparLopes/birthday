"use client";

import { useCallback, useEffect, useState } from "react";
import { EventPart, Vote, VoteChoice, fetchUserVotes, fetchVoteCounts, setVote } from "../lib/api";

const LS_KEY = "connected_user_id";

const PARTS: { id: EventPart; title: string; time: string; description: string }[] = [
  {
    id: "apres-midi",
    title: "Après-midi",
    time: "14h – 19h",
    description:
      "Détente et pré-chauffe sur la terrasse. Cocktails de bienvenue, musique douce, et premiers verres entre amis avant que la fête ne commence vraiment.",
  },
  {
    id: "soiree",
    title: "Soirée",
    time: "19h – 00h",
    description:
      "Le cœur de la fête. Cocktails signatures, dîner sur le rooftop, ambiance musicale montant en puissance. La Jetset réunie pour une nuit inoubliable.",
  },
  {
    id: "nuit",
    title: "Nuit",
    time: "00h – 05h",
    description:
      "La nuit prend le relais. Dance floor, lumières tamisées, shots et confidences. Pour ceux qui ne comptent pas les heures.",
  },
  {
    id: "brunch",
    title: "Brunch",
    time: "11h – 14h",
    description:
      "Le lendemain matin, retour en douceur. Brunch généreux, jus frais, café et souvenirs de la veille partagés entre survivants.",
  },
];

const VOTE_OPTIONS: { choice: VoteChoice; icon: string; label: string; color: string; activeColor: string }[] = [
  {
    choice: "yes",
    icon: "✓",
    label: "Je viens",
    color: "opacity-30 hover:opacity-70",
    activeColor: "text-emerald-400 opacity-100",
  },
  {
    choice: "maybe",
    icon: "?",
    label: "Peut-être",
    color: "opacity-30 hover:opacity-70",
    activeColor: "text-amber-400 opacity-100",
  },
  {
    choice: "no",
    icon: "✕",
    label: "Je ne viens pas",
    color: "opacity-30 hover:opacity-70",
    activeColor: "text-red-400 opacity-100",
  },
];

export function EventSchedule() {
  const [userVotes, setUserVotes] = useState<Record<EventPart, VoteChoice>>({} as Record<EventPart, VoteChoice>);
  const [counts, setCounts] = useState<Record<string, Record<VoteChoice, number>>>({});
  const [loading, setLoading] = useState<EventPart | null>(null);

  const loadData = useCallback(async () => {
    const userId = localStorage.getItem(LS_KEY);
    const [voteCounts, myVotes] = await Promise.all([
      fetchVoteCounts().catch(() => ({})),
      userId ? fetchUserVotes(userId).catch(() => [] as Vote[]) : Promise.resolve([] as Vote[]),
    ]);
    setCounts(voteCounts);
    const map = {} as Record<EventPart, VoteChoice>;
    myVotes.forEach((v) => {
      map[v.event_part] = v.choice;
    });
    setUserVotes(map);
  }, []);

  useEffect(() => {
    loadData();
    window.addEventListener("user-changed", loadData);
    return () => window.removeEventListener("user-changed", loadData);
  }, [loadData]);

  async function handleVote(part: EventPart, choice: VoteChoice) {
    const userId = localStorage.getItem(LS_KEY);
    if (!userId || loading) return;
    setLoading(part);
    try {
      await setVote(userId, part, choice);
      setUserVotes((prev) => ({ ...prev, [part]: choice }));
      await loadData();
    } finally {
      setLoading(null);
    }
  }

  return (
    <section className="scroll-section flex flex-col bg-[#d0c9c3] text-[#1d1b19] px-8 py-12 overflow-y-auto">
      <div className="flex flex-col sm:flex-row gap-6 flex-1 max-w-5xl w-full mx-auto">
        {PARTS.map((part) => {
          const partCounts = counts[part.id] ?? { yes: 0, maybe: 0, no: 0 };
          const myChoice = userVotes[part.id];
          const total = partCounts.yes + partCounts.maybe + partCounts.no;

          return (
            <div key={part.id} className="flex flex-col flex-1 min-w-0">
              {/* Header */}
              <div className="mb-3">
                <p className="text-xs opacity-50 tracking-widest uppercase mb-1">{part.time}</p>
                <h2 className="text-xl font-bold">{part.title}</h2>
              </div>

              {/* Description */}
              <p className="text-sm opacity-70 leading-relaxed flex-1">{part.description}</p>

              {/* Vote buttons */}
              <div className="flex gap-3 mt-6">
                {VOTE_OPTIONS.map(({ choice, icon, label, color, activeColor }) => (
                  <button
                    key={choice}
                    onClick={() => handleVote(part.id, choice)}
                    title={label}
                    disabled={loading === part.id}
                    className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all text-sm font-bold
                      ${
                        myChoice === choice ? `border-current ${activeColor}` : `border-[#1d1b19]/20 ${color}`
                      } disabled:cursor-wait`}
                  >
                    {icon}
                  </button>
                ))}
              </div>

              {/* Counts */}
              <div className="mt-3 flex gap-3 text-xs">
                <span className="text-emerald-700 font-medium">{partCounts.yes} ✓</span>
                <span className="text-amber-700 font-medium">{partCounts.maybe} ?</span>
                <span className="text-red-700 font-medium">{partCounts.no} ✕</span>
                <span className="opacity-40 ml-auto">
                  {total} vote{total !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
