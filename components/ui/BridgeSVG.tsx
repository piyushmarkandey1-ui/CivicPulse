export function BridgeSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 600"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="glow-blue">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-red">
          <feGaussianBlur stdDeviation="6" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="water-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8e8e8" />
          <stop offset="100%" stopColor="#d4d4d4" />
        </linearGradient>
      </defs>

      <g id="bg-water">
        <rect x="0" y="450" width="1200" height="150" fill="url(#water-gradient)" />
        <path d="M 0 460 Q 300 455 600 460 T 1200 460" stroke="#d4d4d4" fill="none" strokeWidth="2" opacity="0.6" />
        <path d="M 0 480 Q 300 475 600 480 T 1200 480" stroke="#d4d4d4" fill="none" strokeWidth="2" opacity="0.4" />
      </g>

      <g id="left-bridge" className="bridge-piece">
        <path d="M 100 480 L 150 250 L 250 250 L 300 480 Z" fill="#525252" stroke="#404040" strokeWidth="2" />
        <path d="M 150 250 L 200 100 L 250 250 Z" fill="#525252" stroke="#404040" strokeWidth="2" />
        <rect x="0" y="240" width="350" height="20" fill="#6b6b6b" />
        <path d="M 0 240 L 200 100 M 100 240 L 200 100 M 200 240 L 200 100 M 300 240 L 200 100 M 350 240 L 200 100" stroke="#a3a3a3" strokeWidth="2" opacity="0.6" />
      </g>

      <g id="right-bridge" className="bridge-piece">
        <path d="M 900 480 L 950 250 L 1050 250 L 1100 480 Z" fill="#525252" stroke="#404040" strokeWidth="2" />
        <path d="M 950 250 L 1000 100 L 1050 250 Z" fill="#525252" stroke="#404040" strokeWidth="2" />
        <rect x="850" y="240" width="350" height="20" fill="#6b6b6b" />
        <path d="M 850 240 L 1000 100 M 900 240 L 1000 100 M 1000 240 L 1000 100 M 1100 240 L 1000 100 M 1200 240 L 1000 100" stroke="#a3a3a3" strokeWidth="2" opacity="0.6" />
      </g>

      <g id="center-pieces">
        <g className="center-piece piece-1">
          <rect x="350" y="240" width="100" height="20" fill="#6b6b6b" />
          <path d="M 350 240 L 200 100" stroke="#a3a3a3" strokeWidth="2" opacity="0.6" className="cable" />
        </g>
        <g className="center-piece piece-2">
          <rect x="450" y="240" width="100" height="20" fill="#6b6b6b" />
          <path d="M 450 240 L 200 100" stroke="#a3a3a3" strokeWidth="2" opacity="0.6" className="cable" />
        </g>
        <g className="center-piece piece-3">
          <rect x="550" y="240" width="100" height="25" fill="#525252" />
        </g>
        <g className="center-piece piece-4">
          <rect x="650" y="240" width="100" height="20" fill="#6b6b6b" />
          <path d="M 750 240 L 1000 100" stroke="#a3a3a3" strokeWidth="2" opacity="0.6" className="cable" />
        </g>
        <g className="center-piece piece-5">
          <rect x="750" y="240" width="100" height="20" fill="#6b6b6b" />
          <path d="M 850 240 L 1000 100" stroke="#a3a3a3" strokeWidth="2" opacity="0.6" className="cable" />
        </g>
      </g>

      <g id="railings" stroke="#737373" strokeWidth="2">
        <line x1="0" y1="230" x2="350" y2="230" className="railing-left" />
        <line x1="350" y1="230" x2="850" y2="230" className="railing-center" />
        <line x1="850" y1="230" x2="1200" y2="230" className="railing-right" />
        {[...Array(24)].map((_, i) => (
          <line key={i} x1={i * 50} y1="230" x2={i * 50} y2="240" className="railing-post" />
        ))}
      </g>

      <g id="road-deck">
        <rect x="0" y="238" width="1200" height="2" fill="#a3a3a3" className="deck-line" />
      </g>

      <g id="bridge-lights">
        {[...Array(12)].map((_, i) => (
          <g key={i} className={`light light-${i}`}>
            <line x1={50 + i * 100} y1="240" x2={50 + i * 100} y2="180" stroke="#737373" strokeWidth="2" />
            <circle cx={50 + i * 100} cy="180" r="4" fill="#2563eb" filter="url(#glow-blue)" className="light-bulb" />
          </g>
        ))}
      </g>

      <g id="reports">
        <circle cx="580" cy="240" r="8" fill="#dc2626" filter="url(#glow-red)" className="report report-1" />
        <circle cx="480" cy="245" r="5" fill="#2563eb" filter="url(#glow-red)" className="report report-2" />
        <circle cx="680" cy="235" r="6" fill="#6b6b6b" filter="url(#glow-red)" className="report report-3" />
        <circle cx="600" cy="240" r="80" fill="none" stroke="#dc2626" strokeWidth="2" opacity="0.25" className="hotspot-ring" />
      </g>
    </svg>
  );
}
