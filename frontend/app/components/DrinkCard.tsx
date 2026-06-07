"use client";

type IconType = "spirits" | "whisky" | "champagne" | "wine" | "beer" | "can" | "carton" | "syrup";

interface DrinkCardProps {
  name: string;
  drinkId: string;
  available: number;
  needed: number;
  icon: IconType;
  highlighted?: boolean;
  onClick?: () => void;
}

const label = { fill: "#1c1b19", opacity: 0.35 };

function DrinkIcon({ type }: { type: IconType }) {
  return (
    <svg width="16" height="32" viewBox="0 0 28 56" fill="currentColor" aria-hidden="true">
      {type === "spirits" && (
        <>
          <rect x="10" y="0" width="8" height="5" rx="1.5" />
          <rect x="11" y="5" width="6" height="13" />
          <path d="M11,17 C4,22 3,28 3,33 L3,48 C3,53 8,56 14,56 C20,56 25,53 25,48 L25,33 C25,28 24,22 17,17 Z" />
          <rect x="6" y="35" width="16" height="1.5" rx="0.5" {...label} />
          <rect x="6" y="39" width="16" height="1.5" rx="0.5" {...label} />
        </>
      )}

      {type === "whisky" && (
        <>
          {/* Wide metal cap */}
          <rect x="8" y="0" width="12" height="5" rx="2" />
          {/* Short wide neck */}
          <rect x="10" y="5" width="8" height="7" />
          {/* Wide round decanter body */}
          <path d="M9,12 C3,16 2,22 2,30 L2,44 C2,51 7,56 14,56 C21,56 26,51 26,44 L26,30 C26,22 25,16 19,12 Z" />
          <rect x="5" y="30" width="18" height="1.5" rx="0.5" {...label} />
          <rect x="5" y="34" width="18" height="1.5" rx="0.5" {...label} />
          <rect x="5" y="38" width="18" height="1.5" rx="0.5" {...label} />
        </>
      )}

      {type === "champagne" && (
        <>
          {/* Tapered foil cage top */}
          <path d="M10,8 L12,0 L16,0 L18,8 Z" />
          {/* Thin neck */}
          <rect x="12" y="8" width="4" height="14" />
          {/* Wide bulbous body */}
          <path d="M12,22 C4,27 2,33 2,39 L2,47 C2,52 7,56 14,56 C21,56 26,52 26,47 L26,39 C26,33 24,27 16,22 Z" />
          <rect x="5" y="39" width="18" height="1.5" rx="0.5" {...label} />
          <rect x="5" y="43" width="18" height="1.5" rx="0.5" {...label} />
        </>
      )}

      {type === "wine" && (
        <>
          {/* Small rim */}
          <rect x="12" y="0" width="4" height="3" rx="1" />
          {/* Long thin neck */}
          <rect x="12" y="3" width="4" height="18" />
          {/* Cylindrical body with gentle shoulders */}
          <path d="M12,21 C9,24 8,28 8,32 L8,48 C8,52 10,56 14,56 C18,56 20,52 20,48 L20,32 C20,28 19,24 16,21 Z" />
          <rect x="9" y="37" width="10" height="1.5" rx="0.5" {...label} />
          <rect x="9" y="41" width="10" height="1.5" rx="0.5" {...label} />
        </>
      )}

      {type === "beer" && (
        <>
          {/* Wide crown cap */}
          <rect x="8" y="0" width="12" height="5" rx="1" />
          {/* Short neck */}
          <rect x="11" y="5" width="6" height="8" />
          {/* Wide body */}
          <path d="M10,13 C5,17 4,22 4,27 L4,47 C4,52 8,56 14,56 C20,56 24,52 24,47 L24,27 C24,22 23,17 18,13 Z" />
          <rect x="6" y="33" width="16" height="1.5" rx="0.5" {...label} />
          <rect x="6" y="37" width="16" height="1.5" rx="0.5" {...label} />
          <rect x="6" y="41" width="16" height="1.5" rx="0.5" {...label} />
        </>
      )}

      {type === "can" && (
        <>
          {/* Pull tab */}
          <rect x="13" y="0" width="3" height="4" rx="1" />
          {/* Top dome */}
          <path d="M8,4 C8,2 20,2 20,4 L20,9 L8,9 Z" />
          {/* Cylinder body */}
          <rect x="8" y="9" width="12" height="39" />
          {/* Bottom dome */}
          <path d="M8,48 L8,52 C8,55 20,55 20,52 L20,48 Z" />
          {/* Horizontal stripe */}
          <rect x="8" y="24" width="12" height="2" {...label} />
        </>
      )}

      {type === "carton" && (
        <>
          {/* Straw */}
          <rect x="18" y="0" width="2.5" height="12" rx="1" />
          {/* Gabled top */}
          <path d="M7,10 L14,5 L21,10 L21,16 L7,16 Z" />
          {/* Box body */}
          <rect x="7" y="16" width="14" height="40" rx="1" />
          {/* Label window */}
          <rect x="9" y="25" width="10" height="14" rx="0.5" {...label} />
        </>
      )}

      {type === "syrup" && (
        <>
          {/* Wide cap */}
          <rect x="8" y="0" width="12" height="5" rx="2" />
          {/* Short neck */}
          <rect x="11" y="5" width="6" height="6" />
          {/* Squat round body */}
          <path d="M9,11 C4,14 3,19 3,26 L3,44 C3,51 8,55 14,55 C20,55 25,51 25,44 L25,26 C25,19 24,14 19,11 Z" />
          <rect x="5" y="28" width="18" height="1.5" rx="0.5" {...label} />
          <rect x="5" y="32" width="18" height="1.5" rx="0.5" {...label} />
        </>
      )}
    </svg>
  );
}

export function DrinkCard({ name, available, needed, icon, highlighted, onClick }: DrinkCardProps) {
  const percentage = Math.min(available / needed, 1);

  const skew = 12;
  const totalW = 220;
  const contentW = totalW - skew;
  const h = 16;

  const fillTopRight = skew + contentW * percentage;
  const fillBottomRight = contentW * percentage;

  return (
    <button
      onClick={onClick}
      className={`flex flex-col text-left cursor-pointer transition-opacity hover:opacity-70 rounded-sm outline-none
        ${highlighted ? "ring-1 ring-[#cfc8c3]/40 p-1 -m-1" : ""}`}
      aria-label={`Modifier ma participation pour ${name}`}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <DrinkIcon type={icon} />
        <span className="text-xs opacity-50 font-mono">
          {available}/{needed}L
        </span>
        <span className={`text-sm font-semibold tracking-wide truncate ${highlighted ? "text-[#cfc8c3]" : ""}`}>
          {name}
        </span>
        {highlighted && <span className="ml-auto text-[10px] opacity-60">✓</span>}
      </div>

      <svg
        width="100%"
        height={h}
        viewBox={`0 0 ${totalW} ${h}`}
        preserveAspectRatio="none"
        aria-label={`${available}L sur ${needed}L`}
      >
        <polygon points={`${skew},0 ${totalW},0 ${contentW},${h} 0,${h}`} fill="#2e2c2a" />
        {percentage > 0 && (
          <polygon
            points={`${skew},0 ${fillTopRight},0 ${fillBottomRight},${h} 0,${h}`}
            fill={highlighted ? "#e8e0d8" : "#cfc8c3"}
          />
        )}
      </svg>
    </button>
  );
}
