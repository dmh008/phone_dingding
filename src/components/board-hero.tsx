"use client";

export function BoardHero() {
  return (
    <div className="board-hero relative h-full min-h-[420px] w-full overflow-hidden" aria-hidden>
      <svg viewBox="0 0 720 560" className="absolute inset-0 h-full w-full object-cover">
        <defs>
          <linearGradient id="pcb" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0f766e" />
            <stop offset="55%" stopColor="#115e59" />
            <stop offset="100%" stopColor="#134e4a" />
          </linearGradient>
          <linearGradient id="copper" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fdba74" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
          <filter id="soft">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        {/* Atmosphere glow */}
        <ellipse cx="520" cy="120" rx="180" ry="100" fill="#5eead4" opacity="0.18" filter="url(#soft)">
          <animate attributeName="opacity" values="0.12;0.22;0.12" dur="4s" repeatCount="indefinite" />
        </ellipse>

        {/* PCB body */}
        <g className="board-float">
          <rect x="90" y="70" width="520" height="380" rx="18" fill="url(#pcb)" />
          <rect x="110" y="90" width="480" height="340" rx="10" fill="none" stroke="#99f6e4" strokeOpacity="0.25" strokeWidth="1" />

          {/* Traces */}
          <g stroke="url(#copper)" strokeWidth="3" fill="none" strokeLinecap="round">
            <path d="M140 160 H260 V240 H340" className="trace-draw" />
            <path d="M160 320 H280 V380 H420" className="trace-draw" style={{ animationDelay: "0.4s" }} />
            <path d="M480 140 V220 H560" className="trace-draw" style={{ animationDelay: "0.8s" }} />
            <path d="M440 300 H540 V360" className="trace-draw" style={{ animationDelay: "1.1s" }} />
          </g>

          {/* Pads */}
          <g fill="#fdba74">
            <circle cx="140" cy="160" r="5" />
            <circle cx="340" cy="240" r="5" />
            <circle cx="160" cy="320" r="5" />
            <circle cx="420" cy="380" r="5" />
            <circle cx="480" cy="140" r="5" />
            <circle cx="560" cy="220" r="5" />
            <circle cx="440" cy="300" r="5" />
            <circle cx="540" cy="360" r="5" />
          </g>

          {/* MCU chip */}
          <g transform="translate(250, 180)">
            <rect width="140" height="140" rx="8" fill="#042f2e" stroke="#5eead4" strokeWidth="1.5" />
            <text x="70" y="72" textAnchor="middle" fill="#99f6e4" fontSize="14" fontFamily="monospace" fontWeight="700">
              ESP32-C3
            </text>
            <text x="70" y="94" textAnchor="middle" fill="#5eead4" fontSize="10" fontFamily="monospace">
              BLE · LinkGuard
            </text>
            {Array.from({ length: 6 }).map((_, i) => (
              <rect key={`l${i}`} x={-8} y={18 + i * 18} width="8" height="6" fill="#fdba74" />
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
              <rect key={`r${i}`} x={140} y={18 + i * 18} width="8" height="6" fill="#fdba74" />
            ))}
          </g>

          {/* Buzzer */}
          <g transform="translate(470, 250)">
            <circle cx="40" cy="40" r="34" fill="#042f2e" stroke="#fb923c" strokeWidth="2" />
            <circle cx="40" cy="40" r="16" fill="none" stroke="#fdba74" strokeWidth="2" />
            <circle cx="40" cy="40" r="6" fill="#fb923c" className="pulse-dot" />
          </g>

          {/* Antenna mark */}
          <g transform="translate(500, 110)" stroke="#5eead4" fill="none" strokeWidth="2">
            <path d="M0 40 Q20 20 40 20">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="1.6s" repeatCount="indefinite" />
            </path>
            <path d="M0 40 Q28 8 56 8">
              <animate attributeName="opacity" values="1;0.4;1" dur="1.6s" repeatCount="indefinite" />
            </path>
          </g>

          {/* Silkscreen brand */}
          <text x="130" y="430" fill="#99f6e4" fontSize="13" fontFamily="monospace" letterSpacing="2">
            LINKGUARD
          </text>
        </g>
      </svg>
    </div>
  );
}
