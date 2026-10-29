import type { SVGProps } from "react";

type VehicleKind = "car" | "sedan" | "suv" | "motorcycle" | "electric_bicycle";

interface VehicleIconProps extends SVGProps<SVGSVGElement> {
  kind: string;
}

// Custom Green Parking vector silhouettes: consistent stroke, unmistakable
// vehicle proportions, currentColor so the site theme controls their color.
export function VehicleIcon({ kind, ...props }: VehicleIconProps) {
  const base = {
    viewBox: "0 0 96 64",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 3.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    role: "img" as const,
    "aria-label": ({
      car: "Utilitaria",
      sedan: "Berlina",
      suv: "SUV",
      motorcycle: "Motocicletta",
      electric_bicycle: "Bicicletta elettrica",
    } as Record<VehicleKind, string>)[kind as VehicleKind] || kind,
    ...props,
  };
  switch (kind) {
    case "car":
      return <svg {...base}>
        <path d="M18 39 25 25q3-6 11-6h20q7 0 11 6l8 14 7 4v10H14V43z" />
        <path d="M26 38h44M33 20l-5 18M60 20l8 18M18 45h13M65 45h13" />
        <circle cx="28" cy="52" r="6" fill="currentColor" stroke="none" />
        <circle cx="68" cy="52" r="6" fill="currentColor" stroke="none" />
      </svg>;
    case "sedan":
      return <svg {...base}>
        <path d="M7 42h9l10-11 10-8h26l12 12 15 5v13H7z" />
        <path d="m28 32 9-7h23l8 10H24M49 25l-1 12M10 45h11M76 45h10" />
        <circle cx="26" cy="52" r="6" fill="currentColor" stroke="none" />
        <circle cx="73" cy="52" r="6" fill="currentColor" stroke="none" />
      </svg>;
    case "suv":
      return <svg {...base}>
        <path d="M7 51V35l11-3 8-17h39l11 17 13 5v14H7z" />
        <path d="M26 18h37l9 17H18zM47 18v17M9 42h12M77 42h10M17 35h60" />
        <circle cx="26" cy="51" r="8" fill="currentColor" stroke="none" />
        <circle cx="74" cy="51" r="8" fill="currentColor" stroke="none" />
        <path d="M25 51h2M73 51h2" stroke="#ffffff" strokeWidth="2" />
      </svg>;
    case "motorcycle":
      return <svg {...base}>
        <circle cx="20" cy="47" r="11" />
        <circle cx="76" cy="47" r="11" />
        <path d="m20 47 19-18 13 18H20l11-18h8M52 47l14-23 10 23M61 22h11l6 6M27 26h15M45 18l8 1" />
        <path d="m37 28 8-11h9l5 8-8 5M35 17l-7-5" />
      </svg>;
    case "electric_bicycle":
      return <svg {...base}>
        <circle cx="20" cy="46" r="11" />
        <circle cx="76" cy="46" r="11" />
        <path d="m20 46 16-25 18 25H20l16-25h24l16 25M32 20h10M60 21l-5-8h-8M64 18h7M36 21l-4-7" />
        <path d="m47 32-7 9h7l-4 9 13-14h-8l6-9z" fill="currentColor" stroke="none" />
      </svg>;
    default:
      return <svg {...base}><path d="M14 40h68v13H14z" /></svg>;
  }
}
