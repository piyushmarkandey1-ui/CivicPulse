export function BridgeSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 600"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="glow-maroon">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-critical">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="water-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F0E5D8" />
          <stop offset="100%" stopColor="#EFE9DE" />
        </linearGradient>
      </defs>

      <g id="bg-water">
        <rect x="0" y="450" width="1200" height="150" fill="url(#water-gradient)" />
        <path d="M 0 460 Q 300 455 600 460 T 1200 460" stroke="#DED8CD" fill="none" strokeWidth="2" opacity="0.7" />
        <path d="M 0 480 Q 300 475 600 480 T 1200 480" stroke="#DED8CD" fill="none" strokeWidth="2" opacity="0.5" />
      </g>

      <g id="left-bridge" className="bridge-piece">
        <path d="M 100 480 L 150 250 L 250 250 L 300 480 Z" fill="#EFE9DE" stroke="#C9C0B3" strokeWidth="2" />
        <path d="M 150 250 L 200 100 L 250 250 Z" fill="#EFE9DE" stroke="#C9C0B3" strokeWidth="2" />
        <rect x="0" y="240" width="350" height="20" fill="#DED8CD" />
        <path d="M 0 240 L 200 100 M 100 240 L 200 100 M 200 240 L 200 100 M 300 240 L 200 100 M 350 240 L 200 100" stroke="#88827A" strokeWidth="1.5" opacity="0.6" />
      </g>

      <g id="right-bridge" className="bridge-piece">
        <path d="M 900 480 L 950 250 L 1050 250 L 1100 480 Z" fill="#EFE9DE" stroke="#C9C0B3" strokeWidth="2" />
        <path d="M 950 250 L 1000 100 L 1050 250 Z" fill="#EFE9DE" stroke="#C9C0B3" strokeWidth="2" />
        <rect x="850" y="240" width="350" height="20" fill="#DED8CD" />
        <path d="M 850 240 L 1000 100 M 900 240 L 1000 100 M 1000 240 L 1000 100 M 1100 240 L 1000 100 M 1200 240 L 1000 100" stroke="#88827A" strokeWidth="1.5" opacity="0.6" />
      </g>

      <g id="center-pieces">
        <g className="center-piece piece-1">
          <rect x="350" y="240" width="100" height="20" fill="#DED8CD" />
          <path d="M 350 240 L 200 100" stroke="#88827A" strokeWidth="1.5" opacity="0.6" className="cable" />
        </g>
        <g className="center-piece piece-2">
          <rect x="450" y="240" width="100" height="20" fill="#DED8CD" />
          <path d="M 450 240 L 200 100" stroke="#88827A" strokeWidth="1.5" opacity="0.6" className="cable" />
        </g>
        <g className="center-piece piece-3">
          <rect x="550" y="240" width="100" height="25" fill="#C9C0B3" />
        </g>
        <g className="center-piece piece-4">
          <rect x="650" y="240" width="100" height="20" fill="#DED8CD" />
          <path d="M 750 240 L 1000 100" stroke="#88827A" strokeWidth="1.5" opacity="0.6" className="cable" />
        </g>
        <g className="center-piece piece-5">
          <rect x="750" y="240" width="100" height="20" fill="#DED8CD" />
          <path d="M 850 240 L 1000 100" stroke="#88827A" strokeWidth="1.5" opacity="0.6" className="cable" />
        </g>
      </g>

      <g id="railings" stroke="#88827A" strokeWidth="1.5">
        <line x1="0" y1="230" x2="350" y2="230" className="railing-left" />
        <line x1="350" y1="230" x2="850" y2="230" className="railing-center" />
        <line x1="850" y1="230" x2="1200" y2="230" className="railing-right" />
        {[...Array(24)].map((_, i) => (
          <line key={i} x1={i * 50} y1="230" x2={i * 50} y2="240" className="railing-post" />
        ))}
      </g>

      <g id="road-deck">
        <rect x="0" y="238" width="1200" height="2" fill="#625E59" className="deck-line" />
      </g>

      <g id="bridge-lights">
        {[...Array(12)].map((_, i) => (
          <g key={i} className={`light light-${i}`}>
            <line x1={50 + i * 100} y1="240" x2={50 + i * 100} y2="180" stroke="#C9C0B3" strokeWidth="1.5" />
            <circle cx={50 + i * 100} cy="180" r="4" fill="#8B2635" filter="url(#glow-maroon)" className="light-bulb" />
          </g>
        ))}
      </g>

      <g id="reports">
        <circle cx="580" cy="240" r="7" fill="#B83A3A" filter="url(#glow-critical)" className="report report-1" />
        <circle cx="480" cy="245" r="5" fill="#C58B32" filter="url(#glow-critical)" className="report report-2" />
        <circle cx="680" cy="235" r="6" fill="#5E8061" filter="url(#glow-critical)" className="report report-3" />
        <circle cx="600" cy="240" r="70" fill="none" stroke="#B83A3A" strokeWidth="1.5" opacity="0.3" className="hotspot-ring" />
      </g>
    </svg>
  );
}
