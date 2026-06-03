"use client";

import { DrinkCard } from "./components/DrinkCard";
import { RevealSection } from "./components/RevealSection";

export default function Home() {
  return (
    <div className="scroll-container">
      <RevealSection className="scroll-section flex flex-col justify-center items-center bg-[#1c1b19] text-[#cfc8c3] px-8">
        <h1 className="animate-fade-bottom delay-300 text-6xl font-bold text-center mb-6">
          30s Birthday Cocktail
        </h1>
        <p className="animate-fade-left delay-800 text-xl text-center max-w-2xl opacity-80">
          La soirée la plus convoitée de l&apos;année par la Jetset, dans un near-rooftop en plein milieu des beaux quartiers de Saint-Maur
        </p>
      </RevealSection>
      <RevealSection className="scroll-section flex flex-col justify-center items-start bg-[#d0c9c3] text-[#1d1b19] px-16">
        <div className="flex flex-row gap-12">
          <div className="animate-fade-top delay-300 max-w-xs">
            <h2 className="text-2xl font-bold mb-2">Le cadre</h2>
            <p className="opacity-70 leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
          </div>
          <div className="animate-fade-bottom delay-600 max-w-xs">
            <h2 className="text-2xl font-bold mb-2">L&apos;ambiance</h2>
            <p className="opacity-70 leading-relaxed">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.</p>
          </div>
          <div className="animate-fade-top delay-1000 max-w-xs">
            <h2 className="text-2xl font-bold mb-2">Le dress code</h2>
            <p className="opacity-70 leading-relaxed">Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
          </div>
        </div>
      </RevealSection>
      <section className="scroll-section flex flex-col justify-center items-center bg-[#1c1b19] text-[#cfc8c3] px-8 overflow-y-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 py-12 px-12 w-full max-w-5xl">
          <DrinkCard name="Vodka" available={1.5} needed={3} icon="spirits" />
          <DrinkCard name="Gin" available={2} needed={3} icon="spirits" />
          <DrinkCard name="Rhum" available={0.5} needed={2} icon="spirits" />
          <DrinkCard name="Tequila" available={1} needed={2} icon="spirits" />
          <DrinkCard name="Whisky" available={3} needed={3} icon="whisky" />
          <DrinkCard name="Champagne" available={2} needed={4} icon="champagne" />
          <DrinkCard name="Prosecco" available={1} needed={3} icon="champagne" />
          <DrinkCard name="Vin rouge" available={2} needed={4} icon="wine" />
          <DrinkCard name="Vin blanc" available={1.5} needed={3} icon="wine" />
          <DrinkCard name="Bière" available={4} needed={5} icon="beer" />
          <DrinkCard name="Mojito mix" available={0} needed={2} icon="syrup" />
          <DrinkCard name="Jus orange" available={2} needed={3} icon="carton" />
          <DrinkCard name="Tonic" available={1} needed={2} icon="can" />
          <DrinkCard name="Sirop" available={0.5} needed={1} icon="syrup" />
          <DrinkCard name="Eau pétil." available={3} needed={4} icon="can" />
        </div>
      </section>
      <section className="scroll-section flex flex-col bg-[#d0c9c3] text-[#1d1b19]">
        <h1>Coucou 4</h1>
      </section>
    </div>
  );
}
