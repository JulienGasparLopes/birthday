"use client";

import { useCallback, useEffect, useState } from "react";
import { AddDrinkModal } from "./components/AddDrinkModal";
import { DrinkCard } from "./components/DrinkCard";
import { DrinkModal } from "./components/DrinkModal";
import { EventSchedule } from "./components/EventSchedule";
import { RevealSection } from "./components/RevealSection";
import { fetchStocks, fetchUserParticipations, Stock } from "./lib/api";

const LS_KEY = "connected_user_id";

export default function Home() {
  const [modal, setModal] = useState<string | null>(null);
  const [addDrinkOpen, setAddDrinkOpen] = useState(false);
  const [stocks, setStocks] = useState<Record<string, Stock>>({});
  const [userDrinkIds, setUserDrinkIds] = useState<Set<string>>(new Set());

  const loadData = useCallback(async () => {
    const userId = localStorage.getItem(LS_KEY);
    const [stocksData, userParticipations] = await Promise.all([
      fetchStocks().catch(() => ({}) as Record<string, Stock>),
      userId ? fetchUserParticipations(userId).catch(() => []) : Promise.resolve([]),
    ]);
    setStocks(stocksData);
    setUserDrinkIds(new Set(userParticipations.map((p) => p.participation_type)));
  }, []);

  useEffect(() => {
    loadData();
    window.addEventListener("user-changed", loadData);
    return () => window.removeEventListener("user-changed", loadData);
  }, [loadData]);

  return (
    <>
      <div className="scroll-container">
        <RevealSection className="scroll-section flex flex-col justify-center items-center bg-[#1c1b19] text-[#cfc8c3] px-8">
          <h1 className="animate-fade-bottom delay-300 text-6xl font-bold text-center mb-6">30s Birthday Cocktail</h1>
          <p className="animate-fade-left delay-800 text-xl text-center max-w-2xl opacity-80">
            La soirée la plus convoitée de l&apos;année par la Jetset, dans un near-rooftop en plein milieu des beaux
            quartiers de Saint-Maur
          </p>
        </RevealSection>
        <RevealSection className="scroll-section flex flex-col justify-center items-start bg-[#d0c9c3] text-[#1d1b19] px-16">
          <div className="flex flex-row gap-12">
            <div className="animate-fade-top delay-300 max-w-xs">
              <h2 className="text-2xl font-bold mb-2">Le cadre</h2>
              <p className="opacity-70 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </p>
            </div>
            <div className="animate-fade-bottom delay-600 max-w-xs">
              <h2 className="text-2xl font-bold mb-2">L&apos;ambiance</h2>
              <p className="opacity-70 leading-relaxed">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.
              </p>
            </div>
            <div className="animate-fade-top delay-1000 max-w-xs">
              <h2 className="text-2xl font-bold mb-2">Le dress code</h2>
              <p className="opacity-70 leading-relaxed">
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni
                dolores eos qui ratione voluptatem sequi nesciunt.
              </p>
            </div>
          </div>
        </RevealSection>
        <section className="scroll-section relative flex flex-col items-center bg-[#1c1b19] text-[#cfc8c3] px-8 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 pt-12 px-12 pb-20 w-full max-w-5xl">
            {Object.entries(stocks).map(([drinkId, stock]) => (
              <DrinkCard
                key={drinkId}
                name={stock.participation_type}
                drinkId={drinkId}
                available={stock.participation_amount.amount ?? 0}
                needed={stock.goal_amount.amount ?? 0}
                icon={"spirits"}
                highlighted={userDrinkIds.has(drinkId)}
                onClick={() => setModal(stock.participation_type)}
              />
            ))}
          </div>
          {/* Add drink button — pinned to bottom */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center">
            <button
              onClick={() => setAddDrinkOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#cfc8c3]/20 text-[#cfc8c3] opacity-50 hover:opacity-100 hover:border-[#cfc8c3]/60 transition-all text-sm"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Ajouter un drink
            </button>
          </div>
        </section>
        <EventSchedule />
      </div>

      {modal && <DrinkModal drinkName={modal} onClose={() => setModal(null)} onContributed={loadData} />}
      {addDrinkOpen && (
        <AddDrinkModal
          existingDrinkIds={Object.keys(stocks)}
          onClose={() => setAddDrinkOpen(false)}
          onContributed={() => { loadData(); setAddDrinkOpen(false); }}
        />
      )}
    </>
  );
}
