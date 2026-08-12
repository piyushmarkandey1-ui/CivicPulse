export function BridgeSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 60 1200 460"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="glow-maroon" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-critical" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Floating Water Ripples — Transparent & Delicate (No Solid Block) */}
      <g id="bg-water">
        <path
          d="M 0 455 Q 300 448 600 455 T 1200 455"
          stroke="#D6C2A3"
          strokeWidth="1.5"
          strokeOpacity="0.6"
          fill="none"
        />
        <path
          d="M 0 472 Q 300 465 600 472 T 1200 472"
          stroke="#DED8CD"
          strokeWidth="1.2"
          strokeOpacity="0.5"
          fill="none"
        />
        <path
          d="M 0 490 Q 300 482 600 490 T 1200 490"
          stroke="#DED8CD"
          strokeWidth="1"
          strokeOpacity="0.3"
          fill="none"
        />
      </g>

      {/* Left Tower & Pylon */}
      <g id="left-bridge" className="bridge-piece">
        <path
          d="M 100 480 L 150 250 L 250 250 L 300 480 Z"
          fill="#EFE9DE"
          stroke="#C9C0B3"
          strokeWidth="1.5"
        />
        <path
          d="M 150 250 L 200 100 L 250 250 Z"
          fill="#EFE9DE"
          stroke="#C9C0B3"
          strokeWidth="1.5"
        />
        <rect x="0" y="240" width="350" height="18" fill="#E8DFD3" stroke="#D6C2A3" strokeWidth="1" />
        <path
          d="M 0 240 L 200 100 M 100 240 L 200 100 M 200 240 L 200 100 M 300 240 L 200 100 M 350 240 L 200 100"
          stroke="#88827A"
          strokeWidth="1.2"
          opacity="0.55"
        />
      </g>

      {/* Right Tower & Pylon */}
      <g id="right-bridge" className="bridge-piece">
        <path
          d="M 900 480 L 950 250 L 1050 250 L 1100 480 Z"
          fill="#EFE9DE"
          stroke="#C9C0B3"
          strokeWidth="1.5"
        />
        <path
          d="M 950 250 L 1000 100 L 1050 250 Z"
          fill="#EFE9DE"
          stroke="#C9C0B3"
          strokeWidth="1.5"
        />
        <rect x="850" y="240" width="350" height="18" fill="#E8DFD3" stroke="#D6C2A3" strokeWidth="1" />
        <path
          d="M 850 240 L 1000 100 M 900 240 L 1000 100 M 1000 240 L 1000 100 M 1100 240 L 1000 100 M 1200 240 L 1000 100"
          stroke="#88827A"
          strokeWidth="1.2"
          opacity="0.55"
        />
      </g>

      {/* Animated Center Bridge Pieces (GSAP Controlled) */}
      <g id="center-pieces">
        <g className="center-piece piece-1">
          <rect x="350" y="240" width="100" height="18" fill="#E8DFD3" stroke="#D6C2A3" strokeWidth="1" />
          <path d="M 350 240 L 200 100" stroke="#88827A" strokeWidth="1.2" opacity="0.55" className="cable" />
        </g>
        <g className="center-piece piece-2">
          <rect x="450" y="240" width="100" height="18" fill="#E8DFD3" stroke="#D6C2A3" strokeWidth="1" />
          <path d="M 450 240 L 200 100" stroke="#88827A" strokeWidth="1.2" opacity="0.55" className="cable" />
        </g>
        <g className="center-piece piece-3">
          <rect x="550" y="240" width="100" height="22" fill="#D6C2A3" stroke="#C9C0B3" strokeWidth="1" />
        </g>
        <g className="center-piece piece-4">
          <rect x="650" y="240" width="100" height="18" fill="#E8DFD3" stroke="#D6C2A3" strokeWidth="1" />
          <path d="M 750 240 L 1000 100" stroke="#88827A" strokeWidth="1.2" opacity="0.55" className="cable" />
        </g>
        <g className="center-piece piece-5">
          <rect x="750" y="240" width="100" height="18" fill="#E8DFD3" stroke="#D6C2A3" strokeWidth="1" />
          <path d="M 850 240 L 1000 100" stroke="#88827A" strokeWidth="1.2" opacity="0.55" className="cable" />
        </g>
      </g>

      {/* Railings */}
      <g id="railings" stroke="#88827A" strokeWidth="1.2">
        <line x1="0" y1="230" x2="350" y2="230" className="railing-left" />
        <line x1="350" y1="230" x2="850" y2="230" className="railing-center" />
        <line x1="850" y1="230" x2="1200" y2="230" className="railing-right" />
        {[...Array(24)].map((_, i) => (
          <line key={i} x1={i * 50} y1="230" x2={i * 50} y2="240" className="railing-post" />
        ))}
      </g>

      {/* Road Deck */}
      <g id="road-deck">
        <rect x="0" y="238" width="1200" height="2.5" fill="#8B2635" className="deck-line" opacity="0.8" />
      </g>

      {/* Bridge Street Lights */}
      <g id="bridge-lights">
        {[...Array(12)].map((_, i) => (
          <g key={i} className={`light light-${i}`}>
            <line x1={50 + i * 100} y1="240" x2={50 + i * 100} y2="185" stroke="#C9C0B3" strokeWidth="1.2" />
            <circle
              cx={50 + i * 100}
              cy="185"
              r="4"
              fill="#8B2635"
              filter="url(#glow-maroon)"
              className="light-bulb"
            />
          </g>
        ))}
      </g>

      {/* Incident Reports & Hazard Rings */}
      <g id="reports">
        <circle cx="580" cy="240" r="7" fill="#B83A3A" filter="url(#glow-critical)" className="report report-1" />
        <circle cx="480" cy="245" r="5" fill="#C58B32" filter="url(#glow-critical)" className="report report-2" />
        <circle cx="680" cy="235" r="6" fill="#5E8061" filter="url(#glow-critical)" className="report report-3" />
        <circle
          cx="600"
          cy="240"
          r="65"
          fill="none"
          stroke="#B83A3A"
          strokeWidth="1.5"
          opacity="0.3"
          className="hotspot-ring"
        />
      </g>
    </svg>
  );
}
