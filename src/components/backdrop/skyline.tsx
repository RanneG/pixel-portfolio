/**
 * Built-in backdrop artwork: a dusk skyline drawn as layered SVG silhouettes
 * that drift slowly, like a camera pan. It is shown until a background video
 * is added to `public/media`, and underneath the video while it loads.
 */

const TILE = 1600;
const HEIGHT = 900;
const HORIZON = 735;

function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Building = { x: number; w: number; h: number; roof: number };

type LayerSpec = {
  seed: number;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  gap: number;
};

function buildLayer(spec: LayerSpec): Building[] {
  const random = seededRandom(spec.seed);
  const buildings: Building[] = [];
  let x = 0;
  while (x < TILE) {
    const w = Math.round(
      spec.minWidth + random() * (spec.maxWidth - spec.minWidth),
    );
    const h = Math.round(
      spec.minHeight + random() ** 1.7 * (spec.maxHeight - spec.minHeight),
    );
    buildings.push({ x, w: Math.min(w, TILE - x), h, roof: random() });
    x += w + Math.round(random() * spec.gap);
  }
  return buildings;
}

function buildingPath({ x, w, h, roof }: Building): string {
  const top = HORIZON - h;
  let d = `M${x} ${HORIZON + 4}V${top}H${x + w}V${HORIZON + 4}Z`;
  if (roof < 0.22 && w > 40) {
    const cx = x + Math.round(w / 2);
    d += `M${cx - 2} ${top}V${top - Math.round(h * 0.28)}H${cx + 2}V${top}Z`;
  } else if (roof < 0.5 && w > 56) {
    const inset = Math.round(w * 0.22);
    const step = Math.round(Math.min(h * 0.14, 34));
    d += `M${x + inset} ${top}V${top - step}H${x + w - inset}V${top}Z`;
  }
  return d;
}

function windowRects(buildings: Building[], seed: number) {
  const random = seededRandom(seed);
  const rects: { x: number; y: number; o: number }[] = [];
  for (const { x, w, h } of buildings) {
    const columns = Math.floor((w - 14) / 15);
    const rows = Math.floor((h - 18) / 20);
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        if (random() < 0.13) {
          rects.push({
            x: x + 9 + column * 15,
            y: HORIZON - h + 12 + row * 20,
            o: 0.35 + random() * 0.55,
          });
        }
      }
    }
  }
  return rects;
}

function palmPath(x: number, height: number, lean: number): string {
  const crownX = x + lean;
  const crownY = HORIZON - height;
  let d = `M${x - 5} ${HORIZON + 4}Q${x + lean * 0.2} ${HORIZON - height * 0.55} ${crownX - 3} ${crownY}L${crownX + 3} ${crownY}Q${x + lean * 0.2 + 9} ${HORIZON - height * 0.55} ${x + 6} ${HORIZON + 4}Z`;
  const fronds = [-168, -140, -112, -84, -58, -30, -8];
  for (const angle of fronds) {
    const radians = (angle * Math.PI) / 180;
    const reach = height * 0.42;
    const tipX = crownX + Math.cos(radians) * reach;
    const tipY = crownY + Math.sin(radians) * reach * 0.55 + reach * 0.34;
    const midX = crownX + Math.cos(radians) * reach * 0.55;
    const midY = crownY + Math.sin(radians) * reach * 0.75 - reach * 0.12;
    d += `M${crownX} ${crownY}Q${midX.toFixed(1)} ${midY.toFixed(1)} ${tipX.toFixed(1)} ${tipY.toFixed(1)}Q${midX.toFixed(1)} ${(midY + reach * 0.2).toFixed(1)} ${crownX} ${crownY + 5}Z`;
  }
  return d;
}

const farBuildings = buildLayer({
  seed: 11,
  minWidth: 46,
  maxWidth: 120,
  minHeight: 70,
  maxHeight: 330,
  gap: 6,
});
const midBuildings = buildLayer({
  seed: 29,
  minWidth: 60,
  maxWidth: 150,
  minHeight: 60,
  maxHeight: 250,
  gap: 26,
});
const nearBuildings = buildLayer({
  seed: 53,
  minWidth: 90,
  maxWidth: 220,
  minHeight: 40,
  maxHeight: 150,
  gap: 70,
});

const farPath = farBuildings.map(buildingPath).join("");
const midPath = midBuildings.map(buildingPath).join("");
const nearPath = nearBuildings.map(buildingPath).join("");
const midWindows = windowRects(midBuildings, 7);
const nearWindows = windowRects(nearBuildings, 19);
const palms = [
  palmPath(150, 250, 26),
  palmPath(232, 190, -18),
  palmPath(1010, 215, 20),
  palmPath(1420, 265, -24),
].join("");

type LayerProps = {
  duration: string;
  children: React.ReactNode;
};

/** Two copies of a tile side by side, sliding left by one tile, loop seamlessly. */
function DriftingLayer({ duration, children }: LayerProps) {
  return (
    <div
      className="skyline-layer absolute inset-y-0 left-0 w-[200%] will-change-transform"
      style={{ "--drift": duration } as React.CSSProperties}
    >
      <svg
        className="size-full"
        viewBox={`0 0 ${TILE * 2} ${HEIGHT}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g>{children}</g>
        <g transform={`translate(${TILE} 0)`}>{children}</g>
      </svg>
    </div>
  );
}

export function Skyline() {
  return (
    <div
      className="absolute inset-0 overflow-hidden bg-[#0c0716]"
      style={{ containerType: "size" }}
      aria-hidden="true"
    >
      {/* A 16:9 stage that always covers the viewport, anchored to the bottom. */}
      <div className="absolute bottom-0 left-1/2 aspect-video w-[max(100cqw,177.78cqh)] -translate-x-1/2 overflow-hidden">
        <svg
          className="absolute inset-0 size-full"
          viewBox={`0 0 ${TILE} ${HEIGHT}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#140b2e" />
              <stop offset="0.34" stopColor="#3f1859" />
              <stop offset="0.58" stopColor="#9c2f6c" />
              <stop offset="0.76" stopColor="#ee6f4b" />
              <stop offset="0.86" stopColor="#ffb866" />
            </linearGradient>
            <radialGradient id="sun-glow">
              <stop offset="0" stopColor="#ffd9a0" stopOpacity="0.75" />
              <stop offset="0.45" stopColor="#ff8a5c" stopOpacity="0.28" />
              <stop offset="1" stopColor="#ff8a5c" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="sun" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff4cf" />
              <stop offset="1" stopColor="#ffb561" />
            </linearGradient>
            <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1b0d27" />
              <stop offset="1" stopColor="#060309" />
            </linearGradient>
            <filter id="soften" x="-20%" y="-200%" width="140%" height="500%">
              <feGaussianBlur stdDeviation="14" />
            </filter>
          </defs>
          <rect width={TILE} height={HEIGHT} fill="url(#sky)" />
          <circle cx="1010" cy={HORIZON - 60} r="470" fill="url(#sun-glow)" />
          <circle cx="1010" cy={HORIZON - 60} r="138" fill="url(#sun)" />
          <g filter="url(#soften)">
            <ellipse cx="380" cy="250" rx="330" ry="14" fill="#f58f6c" opacity="0.32" />
            <ellipse cx="1250" cy="170" rx="380" ry="12" fill="#c75a8c" opacity="0.3" />
            <ellipse cx="820" cy="390" rx="460" ry="13" fill="#ffb07a" opacity="0.3" />
            <ellipse cx="1380" cy="480" rx="300" ry="10" fill="#2a1146" opacity="0.5" />
            <ellipse cx="200" cy="520" rx="320" ry="11" fill="#2a1146" opacity="0.42" />
          </g>
          <rect y={HORIZON} width={TILE} height={HEIGHT - HORIZON} fill="url(#ground)" />
        </svg>

        <DriftingLayer duration="420s">
          <path d={farPath} fill="#7a3a78" opacity="0.72" />
        </DriftingLayer>
        <DriftingLayer duration="300s">
          <path d={midPath} fill="#32153f" />
          {midWindows.map((rect) => (
            <rect
              key={`${rect.x}-${rect.y}`}
              x={rect.x}
              y={rect.y}
              width="5"
              height="8"
              fill="#ffc37a"
              opacity={(rect.o * 0.6).toFixed(2)}
            />
          ))}
        </DriftingLayer>
        <DriftingLayer duration="200s">
          <path d={nearPath + palms} fill="#0d0716" />
          {nearWindows.map((rect) => (
            <rect
              key={`${rect.x}-${rect.y}`}
              x={rect.x}
              y={rect.y}
              width="6"
              height="9"
              fill="#ffcf8a"
              opacity={rect.o.toFixed(2)}
            />
          ))}
        </DriftingLayer>
      </div>
    </div>
  );
}
