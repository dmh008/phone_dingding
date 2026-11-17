"use client";

/**
 * LinkGuard 交互式原理图（示意级）
 * 对应 hardware/WIRING.md 与 firmware 引脚定义
 */
export function Schematic() {
  return (
    <svg
      viewBox="0 0 960 560"
      role="img"
      aria-label="LinkGuard 电路原理图"
      className="h-auto w-full"
    >
      <defs>
        <pattern
          id="grid"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="rgba(15, 55, 70, 0.06)"
            strokeWidth="1"
          />
        </pattern>
        <linearGradient id="boardFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0f766e" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#155e75" stopOpacity="0.22" />
        </linearGradient>
      </defs>

      <rect width="960" height="560" fill="url(#grid)" />
      <rect
        x="24"
        y="24"
        width="912"
        height="512"
        rx="8"
        fill="url(#boardFill)"
        stroke="#0f3d44"
        strokeWidth="1.5"
      />

      {/* Title block */}
      <text
        x="48"
        y="56"
        fill="#0f3d44"
        fontFamily="var(--font-display), sans-serif"
        fontSize="18"
        fontWeight="700"
      >
        LinkGuard — BLE Disconnect Alarm
      </text>
      <text
        x="48"
        y="78"
        fill="#3d6b73"
        fontFamily="var(--font-body), sans-serif"
        fontSize="12"
      >
        ESP32-C3 · Active Buzzer · Status LED · Mute Switch · Optional LiPo
      </text>

      {/* ESP32 block */}
      <g transform="translate(300, 140)">
        <rect
          width="220"
          height="280"
          rx="6"
          fill="#ecf8f6"
          stroke="#0f3d44"
          strokeWidth="2"
        />
        <text
          x="110"
          y="36"
          textAnchor="middle"
          fill="#0f3d44"
          fontFamily="var(--font-display), sans-serif"
          fontSize="16"
          fontWeight="700"
        >
          U1 ESP32-C3
        </text>
        <text
          x="110"
          y="58"
          textAnchor="middle"
          fill="#3d6b73"
          fontSize="11"
        >
          BLE Peripheral · LinkGuard
        </text>

        {/* Pins left */}
        <Pin y={100} label="3V3" side="left" />
        <Pin y={140} label="GND" side="left" />
        <Pin y={180} label="GPIO4" side="left" highlight />
        <Pin y={220} label="GPIO5" side="left" highlight />
        <Pin y={260} label="GPIO6" side="left" highlight />

        {/* Pins right */}
        <Pin y={100} label="5V / USB" side="right" />
        <Pin y={140} label="EN" side="right" />
        <circle cx="110" cy="120" r="28" fill="none" stroke="#0d9488" strokeWidth="2" strokeDasharray="4 3" />
        <text x="110" y="124" textAnchor="middle" fill="#0d9488" fontSize="10" fontWeight="600">
          BLE
        </text>
      </g>

      {/* Buzzer */}
      <g transform="translate(80, 280)">
        <circle cx="40" cy="40" r="36" fill="#fff7ed" stroke="#c2410c" strokeWidth="2" />
        <circle cx="40" cy="40" r="18" fill="none" stroke="#c2410c" strokeWidth="2" />
        <text x="40" y="96" textAnchor="middle" fill="#9a3412" fontSize="12" fontWeight="600">
          BZ1 有源蜂鸣器
        </text>
        <text x="40" y="112" textAnchor="middle" fill="#9a3412" fontSize="10">
          + ← GPIO4 · − ← GND
        </text>
      </g>

      {/* Wires buzzer */}
      <path
        d="M 152 320 H 280 V 320"
        fill="none"
        stroke="#c2410c"
        strokeWidth="2"
      />
      <path
        d="M 120 356 V 400 H 300"
        fill="none"
        stroke="#0f3d44"
        strokeWidth="2"
      />
      <text x="200" y="312" fill="#c2410c" fontSize="10">
        GPIO4
      </text>

      {/* LED */}
      <g transform="translate(80, 140)">
        <path d="M 20 50 L 50 20 L 50 80 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
        <line x1="50" y1="35" x2="70" y2="35" stroke="#ca8a04" strokeWidth="2" />
        <line x1="50" y1="65" x2="70" y2="65" stroke="#ca8a04" strokeWidth="2" />
        <text x="40" y="108" textAnchor="middle" fill="#a16207" fontSize="12" fontWeight="600">
          LED1 + R1 330Ω
        </text>
        <text x="40" y="124" textAnchor="middle" fill="#a16207" fontSize="10">
          GPIO5 → R1 → LED → GND
        </text>
      </g>
      <path
        d="M 150 190 H 280 V 360"
        fill="none"
        stroke="#ca8a04"
        strokeWidth="2"
      />

      {/* Switch */}
      <g transform="translate(700, 300)">
        <circle cx="20" cy="0" r="4" fill="#0f3d44" />
        <path d="M 24 0 H 48" stroke="#0f3d44" strokeWidth="2" />
        <path d="M 48 0 L 78 -18" stroke="#0f3d44" strokeWidth="2" />
        <circle cx="90" cy="0" r="4" fill="#0f3d44" />
        <path d="M 82 0 H 86" stroke="#0f3d44" strokeWidth="2" />
        <text x="55" y="36" textAnchor="middle" fill="#0f3d44" fontSize="12" fontWeight="600">
          SW1 静音键
        </text>
        <text x="55" y="52" textAnchor="middle" fill="#3d6b73" fontSize="10">
          GPIO6 ↔ GND
        </text>
      </g>
      <path
        d="M 520 400 H 700 V 300"
        fill="none"
        stroke="#0f3d44"
        strokeWidth="2"
      />
      <path
        d="M 790 300 H 840 V 440 H 300"
        fill="none"
        stroke="#0f3d44"
        strokeWidth="2"
        strokeDasharray="6 4"
      />

      {/* Phone */}
      <g transform="translate(700, 120)">
        <rect
          width="70"
          height="120"
          rx="12"
          fill="#f0fdfa"
          stroke="#0d9488"
          strokeWidth="2"
        />
        <rect x="18" y="18" width="34" height="60" rx="4" fill="#ccfbf1" />
        <circle cx="35" cy="98" r="6" fill="none" stroke="#0d9488" strokeWidth="1.5" />
        <text x="35" y="148" textAnchor="middle" fill="#0f766e" fontSize="12" fontWeight="600">
          iPhone
        </text>
        <text x="35" y="164" textAnchor="middle" fill="#3d6b73" fontSize="10">
          LightBlue / nRF Connect
        </text>
      </g>

      {/* BLE waves */}
      <g stroke="#0d9488" fill="none" strokeWidth="1.5">
        <path d="M 560 200 Q 620 180 680 180" strokeDasharray="3 3">
          <animate
            attributeName="opacity"
            values="0.3;1;0.3"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
        <path d="M 560 220 Q 620 210 680 200" strokeDasharray="3 3">
          <animate
            attributeName="opacity"
            values="1;0.3;1"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
      </g>
      <text x="620" y="168" fill="#0d9488" fontSize="11" fontWeight="600">
        BLE 连接
      </text>

      {/* Power note */}
      <g transform="translate(560, 460)">
        <text fill="#0f3d44" fontSize="11" fontWeight="600">
          电源：USB-C 直供，或 3.7V 锂电 + TP4056（可选）
        </text>
      </g>
    </svg>
  );
}

function Pin({
  y,
  label,
  side,
  highlight = false,
}: {
  y: number;
  label: string;
  side: "left" | "right";
  highlight?: boolean;
}) {
  const x = side === "left" ? 0 : 220;
  const textX = side === "left" ? 16 : 204;
  const anchor = side === "left" ? "start" : "end";
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={5}
        fill={highlight ? "#0d9488" : "#0f3d44"}
      />
      <text
        x={textX}
        y={y + 4}
        textAnchor={anchor}
        fill={highlight ? "#0f766e" : "#3d6b73"}
        fontSize="11"
        fontWeight={highlight ? 600 : 400}
      >
        {label}
      </text>
    </g>
  );
}
