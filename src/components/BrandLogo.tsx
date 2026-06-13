import { JSX } from "react";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  hideText?: boolean;
  lightLogo?: boolean;
}

export default function BrandLogo({
  className = "",
  size = "md",
  hideText = false,
  lightLogo = false,
}: BrandLogoProps): JSX.Element {
  const gold = "#C9A24B";
  const navy = lightLogo ? "#FFFFFF" : "#081B3A";
  const lightGold = "#E5C07B";

  const dimensionMap = {
    sm: { svg: "h-8 w-8", text: "text-xs tracking-[0.25em]" },
    md: { svg: "h-12 w-12", text: "text-base tracking-[0.3em]" },
    lg: { svg: "h-20 w-20", text: "text-xl tracking-[0.35em]" },
    xl: { svg: "h-32 w-32", text: "text-2xl tracking-[0.4em]" },
  };

  const dims = dimensionMap[size];

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      {/* Handcrafted precise vector matching the premium uploaded image */}
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${dims.svg} transition-all duration-300`}
      >
        {/* Sweeping Gold Crescent / Arch */}
        <path
          d="M 40 85 A 72 72 0 0 1 160 85"
          stroke={gold}
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Golden Left Serifs & V Body */}
        {/* V Left Stem */}
        <path
          d="M 40 70 L 48 70 M 44 70 L 78 140"
          stroke={gold}
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* V Right Stem (reaches up and intersects) */}
        <path
          d="M 78 140 L 98 90"
          stroke={gold}
          strokeWidth="6.5"
          strokeLinecap="round"
        />

        {/* Luxury Navy M Body / Buildings */}
        {/* Building 1 (Left Column) */}
        <rect x="102" y="55" width="8" height="45" fill={navy} />
        {/* Royal Gold Stripes inside Building */}
        <line x1="106" y1="58" x2="106" y2="95" stroke={gold} strokeWidth="1.5" />
        
        {/* Main M Diagonal Intersection & Building 2 */}
        <path
          d="M 98 90 L 115 125 L 140 65"
          stroke={navy}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* M Right Leg / Column */}
        <rect x="140" y="65" width="8" height="60" fill={navy} />
        {/* Serifs on bottom of M Leg */}
        <path d="M 134 125 L 154 125" stroke={navy} strokeWidth="3" strokeLinecap="round" />

        {/* Symmetric Gold Serifs on V top left */}
        <path d="M 37 70 L 51 70" stroke={gold} strokeWidth="3.5" strokeLinecap="round" />

        {/* Sophisticated Roofline House Underneath */}
        <path
          d="M 57 132 L 95 102 L 145 130"
          stroke={navy}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 54 135 L 95 105 L 148 133"
          stroke={gold}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* 4 Gold Windows in Center */}
        <rect x="91" y="118" width="4" height="4" fill={gold} />
        <rect x="97" y="118" width="4" height="4" fill={gold} />
        <rect x="91" y="124" width="4" height="4" fill={gold} />
        <rect x="97" y="124" width="4" height="4" fill={gold} />
      </svg>

      {/* Brand Text Header */}
      {!hideText && (
        <div className="text-center mt-2 font-serif">
          <span
            className={`${dims.text} block font-medium uppercase tracking-[0.25em]`}
            style={{ color: lightLogo ? "#FFFFFF" : "#081B3A" }}
          >
            VM PROPERTIES
          </span>
          <div className="flex items-center justify-center gap-1.5 mt-1.5 opacity-85">
            <span className="h-[1px] w-6 bg-[#C9A24B]"></span>
            <span className="text-[9px] uppercase tracking-[0.4em]" style={{ color: "#C9A24B" }}>
              ESTATE
            </span>
            <span className="h-[1px] w-6 bg-[#C9A24B]"></span>
          </div>
        </div>
      )}
    </div>
  );
}
