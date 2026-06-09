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
        <RevealSection className="scroll-section flex flex-col justify-center items-center bg-[#1c1b19] text-[#cfc8c3] px-6 sm:px-8">
          <h1 className="animate-fade-bottom delay-300 text-4xl sm:text-8xl font-bold text-center mb-6 sm:mb-12">30s Birthday Cocktail</h1>
          <p className="animate-fade-bottom delay-1200 text-base sm:text-xl text-center max-w-2xl opacity-80">
            La soirée la plus convoitée de l&apos;année par la Jetset, dans un near-rooftop en plein milieu des beaux
            quartiers de Saint-Maur
          </p>
        </RevealSection>
        <RevealSection className="scroll-section scroll-section-auto flex flex-col justify-center items-start bg-[#d0c9c3] text-[#1d1b19] px-8 sm:px-32 overflow-y-auto">
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 w-full justify-between py-12 sm:py-0">
            <div className="animate-fade-top delay-300 sm:max-w-xs flex flex-col gap-2">
              <h2 className="text-2xl font-bold mb-2">Le cadre</h2>
              <p className="opacity-70 leading-relaxed">
                Décoration minimaliste, épurée et recherchée dans un esprit loft-newyorkais des années 30. Un rooftop
                situé au 1er étage, ni roof ni top, bien au contraire !
              </p>
              <p className="opacity-70 leading-relaxed">
                Le <strong>98 BIS</strong>, comme le surnomme les habitués, se trouve étonamment au{" "}
                <strong>98B boulevard de Champigny, à Saint-Maur des Fossées</strong>. Son propriétaire ouvre les portes
                de l'établissement afin d'accueillir la crème de la crème de la haute société !
              </p>
              <p className="opacity-70 leading-relaxed">
                Soirée sur invitation seulement, <strong>RER A</strong> (arrêt Champigny) avec wagons publics privatisés
                pour l'occasion, aucun parking privé, vestiaire payant.
              </p>
            </div>
            <div className="animate-fade-bottom delay-600 sm:max-w-xs flex flex-col gap-2">
              <h2 className="text-2xl font-bold mb-2">L&apos;ambiance</h2>
              <p className="opacity-70 leading-relaxed">
                Une <strong>après-midi détente</strong> au sein de l'un des nombreux salons privées de l'établissement
                (au nombre de 1).
              </p>
              <p className="opacity-70 leading-relaxed">
                Musique, jeux de société, débats politiques, combats de coqs, opération à cœur ouvert, atelier de
                poterie sans glaise, fumoir d'opium... Les activités les plus extravagantes ont été organisées dans le
                seul but de combler votre insatiable soif de divertissements !
              </p>
              <p className="opacity-70 leading-relaxed">
                <strong>Soirée dansante et chic</strong> avec DJ set et open-bar à cocktails. Laissez libre cours à
                votre imagination afin de composer le cocktail qui réchaufera les coeurs et les esprits !
              </p>
              <p className="opacity-70 leading-relaxed">
                Enfin, <strong>brunch</strong> le lendemain matin pour les personnes logées dans le gîte ainsi que ceux
                désirant profiter encore quelques heures de la magie de cette soirée d'exception !
              </p>
            </div>
            <div className="animate-fade-top delay-1000 sm:max-w-xs">
              <h2 className="text-2xl font-bold mb-2">Bar à Cocktails</h2>
              <p className="opacity-70 leading-relaxed">
                Le thème de la soirée étant les cocktails, <strong>une tenue chic et élégante</strong> est fortement
                conseillée (bien que non obligatoire, le combo short/veste de costume étant le summum du chic
                décontracté).
              </p>
              <p className="opacity-70 leading-relaxed">
                Chaque invité peut contribuer à la soirée en amenant des <strong>victuailles</strong> mais surtout des{" "}
                <strong>ingrédients</strong> pour le bar à cocktails ! La section suivante vous permettra de voir les
                ingrédients déjà prévus et d&apos;indiquer votre contribution afin d&apos;éviter les doublons.
                Privilégiez les ingrédients originaux.
              </p>
              <p className="opacity-70 leading-relaxed">
                De plus, il est fortement encouragé de ramener des <strong>"fonds de tiroir"</strong> (bouteilles
                entamées, invendues ou jugées trop exotiques) afin de réduire le gaspillage et pourquoi pas pimenter les
                choses !
              </p>
            </div>
          </div>
        </RevealSection>
        <section className="scroll-section relative flex flex-col items-center bg-[#1c1b19] text-[#cfc8c3] px-8 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-12 pt-12 px-4 sm:px-12 pb-20 w-full max-w-5xl">
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
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
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
          onContributed={() => {
            loadData();
            setAddDrinkOpen(false);
          }}
        />
      )}
    </>
  );
}
