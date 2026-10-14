"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { MapContainer, TileLayer, CircleMarker, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L, { type LatLngTuple } from "leaflet";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Crosshair,
  Move,
  Search,
  MousePointer,
} from "lucide-react";
import { type Issue, type Severity } from "@/lib/types";
import { cn } from "@/lib/utils";

// ─── Proximity Deduplication ──────────────────────────────────────────────────
// Groups issues of the same category within DEDUP_RADIUS_KM of each other.
// The issue with the most upvotes becomes the "primary" (shown on map);
// all others are suppressed. The primary gets duplicateCount stamped on it.
const DEDUP_RADIUS_KM = 0.08; // 80 metres

function deduplicateIssues(issues: Issue[]): Issue[] {
  const visited = new Set<string>();
  const result: Issue[] = [];

  for (let i = 0; i < issues.length; i++) {
    if (visited.has(issues[i].id)) continue;

    const group: Issue[] = [issues[i]];
    visited.add(issues[i].id);

    for (let j = i + 1; j < issues.length; j++) {
      if (visited.has(issues[j].id)) continue;
      if (issues[j].category !== issues[i].category) continue;

      const distKm = turf.distance(
        turf.point([issues[i].lng, issues[i].lat]),
        turf.point([issues[j].lng, issues[j].lat]),
        { units: "kilometers" }
      );

      if (distKm <= DEDUP_RADIUS_KM) {
        group.push(issues[j]);
        visited.add(issues[j].id);
      }
    }

    // Pick the primary: highest upvotes (or pre-set priorityScore)
    const primary = group.reduce((best, cur) =>
      (cur.upvotes ?? 0) > (best.upvotes ?? 0) ? cur : best
    );

    result.push({
      ...primary,
      duplicateCount: group.length,
    });
  }

  return result;
}

import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";
import * as turf from "@turf/turf";

// ─── Municipal GIS Config ──────────────────────────────────────────────────────
const MAP_CENTER: LatLngTuple = [19.09, 72.865];
const MAP_ZOOM = 13;
// Free OpenStreetMap standard tile layer (no API key required)
const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// ─── Restrained Status Colors ──────────────────────────────────────────────────
const SEV_COLOR: Record<Severity, string> = {
  critical: "#B83A3A",
  moderate: "#C58B32",
  resolved: "#5E8061",
};

// ─── Custom Teardrop Marker ───────────────────────────────────────────────────
function makeIcon(severity: Severity, selected: boolean, duplicateCount?: number) {
  const color = SEV_COLOR[severity];
  const size = selected ? 32 : 24;
  const showBadge = (duplicateCount ?? 1) > 1;
  const badgeSize = 14;

  const badge = showBadge
    ? `<div style="
        position:absolute;
        top:${-badgeSize / 2}px;
        right:${-badgeSize / 2 - 2}px;
        width:${badgeSize + 4}px;
        height:${badgeSize}px;
        background:#242222;
        color:#FFFFFF;
        border-radius:99px;
        font-size:9px;
        font-weight:800;
        font-family:sans-serif;
        display:flex;
        align-items:center;
        justify-content:center;
        border:1.5px solid #FFFFFF;
        box-shadow:0 1px 4px rgba(0,0,0,0.3);
        letter-spacing:-0.3px;
        z-index:10;
        transform:rotate(45deg);
      ">${duplicateCount}x</div>`
    : "";

  return L.divIcon({
    html: `<div style="
        position:relative;
        width:${size}px;height:${size}px;">
        <div style="
          width:${size}px;height:${size}px;
          background:${color};
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          border:${selected ? "3px solid #242222" : "2px solid #FFFFFF"};
          box-shadow:${selected ? `0 4px 14px rgba(36,34,34,0.35)` : `0 2px 8px rgba(36,34,34,0.2)`};
          transition:all 0.2s;">
          <div style="
            width:${size * 0.38}px;height:${size * 0.38}px;
            background:#FFFFFF;
            border-radius:50%;
            position:absolute;
            top:${size * 0.17}px;left:${size * 0.17}px;">
          </div>
        </div>
        ${badge}
      </div>`,
    className: "",
    iconSize: [size + (showBadge ? 8 : 0), size],
    iconAnchor: [size / 2, size],
  });
}

// ─── Custom Cluster Icon ──────────────────────────────────────────────────────
function clusterIcon(cluster: { getChildCount: () => number }) {
  const n = cluster.getChildCount();
  const size = n > 20 ? 46 : n > 10 ? 40 : 34;
  return L.divIcon({
    html: `<div class="cp-cluster" style="width:${size}px;height:${size}px;">${n}</div>`,
    className: "",
    iconSize: L.point(size, size, true),
    iconAnchor: [size / 2, size / 2],
  });
}

interface PinProps {
  issue: Issue;
  selected: boolean;
  onClick: () => void;
}

function Pin({ issue, selected, onClick }: PinProps) {
  const map = useMap();

  useEffect(() => {
    const m = L.marker([issue.lat, issue.lng], {
      icon: makeIcon(issue.severity, selected, issue.duplicateCount),
      zIndexOffset: selected ? 1000 : 0,
    }).addTo(map);
    m.on("click", onClick);
    return () => {
      m.remove();
    };
  // duplicateCount intentionally included so badge re-renders on change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issue.id, issue.severity, issue.duplicateCount, selected, map, onClick]);

  return null;
}

function FlyToIssue({ issue }: { issue: Issue | null }) {
  const map = useMap();
  useEffect(() => {
    if (!issue) return;
    const currentZoom = map.getZoom();
    map.flyTo([issue.lat, issue.lng], Math.max(currentZoom, 15), { duration: 0.8 });
  }, [issue, map]);
  return null;
}

function PinCluster({
  issues,
  selectedIssue,
  onSelectIssue,
}: {
  issues: Issue[];
  selectedIssue: Issue | null;
  onSelectIssue: (issue: Issue | null) => void;
}) {
  return (
    <MarkerClusterGroup
      chunkedLoading
      iconCreateFunction={clusterIcon as never}
      maxClusterRadius={55}
      showCoverageOnHover={false}
      spiderfyOnMaxZoom
    >
      {issues.map((issue) => (
        <Pin
          key={`${issue.id}-${selectedIssue?.id === issue.id}`}
          issue={issue}
          selected={selectedIssue?.id === issue.id}
          onClick={() => onSelectIssue(selectedIssue?.id === issue.id ? null : issue)}
        />
      ))}
    </MarkerClusterGroup>
  );
}

// ─── Interactive Map Navigation Controller (Mouse Wheel 2D + Middle Drag + Keys) ──
function MapNavigationController({
  wheelMode,
}: {
  wheelMode: "pan" | "zoom";
}) {
  const map = useMap();

  // 1. Mouse wheel handling: Pan laterally (X) and vertically (Y) vs Zoom
  useEffect(() => {
    const container = map.getContainer();
    if (!container) return;

    if (wheelMode === "zoom") {
      map.scrollWheelZoom.enable();
      return;
    }

    // When in "pan" mode, disable Leaflet's built-in wheel zoom
    map.scrollWheelZoom.disable();

    const handleWheel = (e: WheelEvent) => {
      // If user holds Ctrl or Meta (or trackpad pinch), zoom in/out smoothly
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          map.zoomIn(1, { animate: true });
        } else if (e.deltaY > 0) {
          map.zoomOut(1, { animate: true });
        }
        return;
      }

      // Standard mouse wheel or trackpad scroll: navigate laterally (X) & vertically (Y)
      e.preventDefault();
      e.stopPropagation();

      let dx = e.deltaX;
      let dy = e.deltaY;

      // Shift key rotates standard vertical wheel scroll into lateral (horizontal) pan
      if (e.shiftKey && Math.abs(dy) > 0 && Math.abs(dx) === 0) {
        dx = dy;
        dy = 0;
      }

      // Normalize delta across mice / touchpads
      const multiplier = e.deltaMode === 1 ? 28 : e.deltaMode === 2 ? 100 : 1;
      const panX = dx * multiplier;
      const panY = dy * multiplier;

      map.panBy([panX, panY], { animate: false });
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [map, wheelMode]);

  // 2. Middle-mouse drag pan support (CAD / GIS style)
  useEffect(() => {
    const container = map.getContainer();
    if (!container) return;

    let isMiddleDragging = false;
    let startX = 0;
    let startY = 0;

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 1) {
        // Middle button click
        e.preventDefault();
        isMiddleDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        container.style.cursor = "grabbing";
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isMiddleDragging) return;
      e.preventDefault();
      const dx = startX - e.clientX;
      const dy = startY - e.clientY;
      startX = e.clientX;
      startY = e.clientY;
      map.panBy([dx, dy], { animate: false });
    };

    const onMouseUp = (e: MouseEvent) => {
      if (e.button === 1 && isMiddleDragging) {
        isMiddleDragging = false;
        container.style.cursor = "";
      }
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [map]);

  // 3. Smooth Keyboard Arrow Navigation (Lateral & Vertical)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not intercept if user is typing inside an input or textarea
      const target = e.target as HTMLElement | null;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      const step = 140;
      if (e.key === "ArrowUp") {
        e.preventDefault();
        map.panBy([0, -step], { animate: true, duration: 0.2 });
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        map.panBy([0, step], { animate: true, duration: 0.2 });
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        map.panBy([-step, 0], { animate: true, duration: 0.2 });
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        map.panBy([step, 0], { animate: true, duration: 0.2 });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [map]);

  return null;
}

// ─── Unified GIS Navigation Dock (D-Pad, Pan Buttons, Zoom, Mode Switcher) ─────
interface NavigationDockProps {
  wheelMode: "pan" | "zoom";
  setWheelMode: (mode: "pan" | "zoom") => void;
  isSidePanelOpen: boolean;
}

function NavigationDock({
  wheelMode,
  setWheelMode,
  isSidePanelOpen,
}: NavigationDockProps) {
  const map = useMap();
  const panTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth single-click or press-and-hold continuous pan
  const handlePan = useCallback(
    (dx: number, dy: number) => {
      map.panBy([dx, dy], { animate: true, duration: 0.22 });
    },
    [map]
  );

  const startContinuousPan = useCallback(
    (dx: number, dy: number) => {
      handlePan(dx, dy);
      if (panTimerRef.current) clearInterval(panTimerRef.current);
      panTimerRef.current = setInterval(() => {
        map.panBy([dx * 0.7, dy * 0.7], { animate: false });
      }, 55);
    },
    [handlePan, map]
  );

  const stopContinuousPan = useCallback(() => {
    if (panTimerRef.current) {
      clearInterval(panTimerRef.current);
      panTimerRef.current = null;
    }
  }, []);

  const handleRecenter = useCallback(() => {
    map.flyTo(MAP_CENTER, MAP_ZOOM, { duration: 0.9 });
  }, [map]);

  const handleZoomIn = useCallback(() => {
    map.zoomIn(1, { animate: true });
  }, [map]);

  const handleZoomOut = useCallback(() => {
    map.zoomOut(1, { animate: true });
  }, [map]);

  return (
    <div
      className={cn(
        "absolute bottom-6 transition-all duration-300 z-[1000] flex flex-col items-end gap-2.5 pointer-events-auto select-none",
        isSidePanelOpen ? "right-4 sm:right-[430px]" : "right-4 sm:right-6"
      )}
    >
      {/* Main Control Cluster */}
      <div className="bg-white/95 backdrop-blur-md border border-[#DED8CD] rounded-2xl p-2 shadow-[0_12px_36px_rgba(36,34,34,0.12)] flex flex-col items-center gap-2">
        {/* Directional Navigation D-Pad */}
        <div className="relative w-24 h-24 bg-[#F7F4ED] rounded-xl border border-[#DED8CD] flex items-center justify-center p-1 shadow-inner">
          {/* North / Up */}
          <button
            type="button"
            onPointerDown={() => startContinuousPan(0, -140)}
            onPointerUp={stopContinuousPan}
            onPointerLeave={stopContinuousPan}
            title="Pan Up / North (ArrowUp)"
            aria-label="Pan Up"
            className="absolute top-1 left-1/2 -translate-x-1/2 w-7 h-7 rounded-lg bg-white border border-[#DED8CD] hover:bg-[#F0E5D8] hover:border-[#8B2635] hover:text-[#8B2635] text-[#242222] flex items-center justify-center transition-all active:scale-90 shadow-xs cursor-pointer"
          >
            <ChevronUp className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* West / Lateral Left */}
          <button
            type="button"
            onPointerDown={() => startContinuousPan(-140, 0)}
            onPointerUp={stopContinuousPan}
            onPointerLeave={stopContinuousPan}
            title="Pan Left / Lateral West (ArrowLeft)"
            aria-label="Pan Left"
            className="absolute left-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-white border border-[#DED8CD] hover:bg-[#F0E5D8] hover:border-[#8B2635] hover:text-[#8B2635] text-[#242222] flex items-center justify-center transition-all active:scale-90 shadow-xs cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Center / Recenter to Mumbai */}
          <button
            type="button"
            onClick={handleRecenter}
            title="Recenter City (Mumbai)"
            aria-label="Recenter map"
            className="w-7 h-7 rounded-lg bg-[#8B2635] text-white hover:bg-[#641B27] flex items-center justify-center transition-all active:scale-90 shadow-xs cursor-pointer"
          >
            <Crosshair className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>

          {/* East / Lateral Right */}
          <button
            type="button"
            onPointerDown={() => startContinuousPan(140, 0)}
            onPointerUp={stopContinuousPan}
            onPointerLeave={stopContinuousPan}
            title="Pan Right / Lateral East (ArrowRight)"
            aria-label="Pan Right"
            className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-white border border-[#DED8CD] hover:bg-[#F0E5D8] hover:border-[#8B2635] hover:text-[#8B2635] text-[#242222] flex items-center justify-center transition-all active:scale-90 shadow-xs cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* South / Down */}
          <button
            type="button"
            onPointerDown={() => startContinuousPan(0, 140)}
            onPointerUp={stopContinuousPan}
            onPointerLeave={stopContinuousPan}
            title="Pan Down / South (ArrowDown)"
            aria-label="Pan Down"
            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-7 h-7 rounded-lg bg-white border border-[#DED8CD] hover:bg-[#F0E5D8] hover:border-[#8B2635] hover:text-[#8B2635] text-[#242222] flex items-center justify-center transition-all active:scale-90 shadow-xs cursor-pointer"
          >
            <ChevronDown className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Zoom In & Out Row */}
        <div className="flex items-center gap-1.5 w-full justify-between">
          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In"
            aria-label="Zoom In"
            className="flex-1 py-1 px-2 rounded-lg bg-white border border-[#DED8CD] hover:bg-[#F0E5D8] hover:border-[#8B2635] hover:text-[#8B2635] text-[#242222] flex items-center justify-center transition-all active:scale-95 shadow-xs cursor-pointer font-bold text-xs"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom Out"
            aria-label="Zoom Out"
            className="flex-1 py-1 px-2 rounded-lg bg-white border border-[#DED8CD] hover:bg-[#F0E5D8] hover:border-[#8B2635] hover:text-[#8B2635] text-[#242222] flex items-center justify-center transition-all active:scale-95 shadow-xs cursor-pointer font-bold text-xs"
          >
            <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Mouse Wheel Mode Switcher */}
        <div className="w-full pt-1 border-t border-[#DED8CD]/80">
          <div className="flex rounded-lg bg-[#F7F4ED] p-0.5 border border-[#DED8CD]">
            <button
              type="button"
              onClick={() => setWheelMode("pan")}
              title="Mouse scroll pans map laterally & vertically (Ctrl+Scroll zooms)"
              className={cn(
                "flex-1 py-1 px-1 rounded-md text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer",
                wheelMode === "pan"
                  ? "bg-[#8B2635] text-white shadow-xs"
                  : "text-[#625E59] hover:text-[#242222]"
              )}
            >
              <Move className="w-3 h-3" />
              <span>Pan</span>
            </button>
            <button
              type="button"
              onClick={() => setWheelMode("zoom")}
              title="Mouse scroll zooms map directly"
              className={cn(
                "flex-1 py-1 px-1 rounded-md text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer",
                wheelMode === "zoom"
                  ? "bg-[#8B2635] text-white shadow-xs"
                  : "text-[#625E59] hover:text-[#242222]"
              )}
            >
              <Search className="w-3 h-3" />
              <span>Zoom</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Leaflet Map Export ──────────────────────────────────────────────────
interface LeafletMapProps {
  issues: Issue[];
  selectedIssue: Issue | null;
  onSelectIssue: (issue: Issue | null) => void;
  showHeatmap: boolean;
}

export default function LeafletMap({
  issues,
  selectedIssue,
  onSelectIssue,
  showHeatmap,
}: LeafletMapProps) {
  // Wheel navigation mode: default is "pan" (allows lateral + vertical mouse navigation)
  const [wheelMode, setWheelMode] = useState<"pan" | "zoom">("pan");

  // ── Proximity deduplication ──────────────────────────────────────────────
  // Merges same-category issues within 80m into a single primary pin.
  // The primary gets duplicateCount set; duplicates are removed from rendering.
  const dedupedIssues = useMemo(() => deduplicateIssues(issues), [issues]);

  // Dynamically cluster points with Turf.js (uses FULL issue list for density)
  const hotspots = useMemo(() => {
    if (!issues || issues.length === 0) return [];

    // Create GeoJSON features
    const points = turf.featureCollection(
      issues.map((i) => turf.point([i.lng, i.lat], { severity: i.severity }))
    );

    // Cluster points within a 1.5km radius
    const clustered = turf.clustersDbscan(points, 1.5, { minPoints: 1 });

    const groups: Record<string, any[]> = {};
    clustered.features.forEach((f: any, idx) => {
      const clusterId =
        f.properties.cluster !== undefined ? f.properties.cluster : `solo-${idx}`;
      if (!groups[clusterId]) groups[clusterId] = [];
      groups[clusterId].push(f);
    });

    const computedHotspots = [];
    for (const group of Object.values(groups)) {
      if (group.length > 0) {
        // Calculate center of mass for the cluster
        const center = turf.centerOfMass(turf.featureCollection(group));

        let intensity = group.length * 2.5;
        group.forEach((p) => {
          if (p.properties.severity === "critical") intensity += 2.5;
          if (p.properties.severity === "moderate") intensity += 1;
        });

        computedHotspots.push({
          lng: center.geometry.coordinates[0],
          lat: center.geometry.coordinates[1],
          intensity: Math.min(intensity, 15),
        });
      }
    }
    return computedHotspots;
  }, [issues]);

  return (
    <>
      <style>{`
        /* Municipal GIS Cluster Bubble */
        .cp-cluster {
          background: #F0E5D8;
          border: 2px solid #8B2635;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 12px;
          color: #8B2635;
          font-family: 'Sora', sans-serif;
          box-shadow: 0 4px 12px rgba(36,34,34,0.15);
        }
        .marker-cluster { background: transparent !important; }
        .marker-cluster div { background: transparent !important; }
        
        /* Smooth, authoritative grab cursors across map surface */
        .leaflet-container {
          background: #EFE9DE !important;
          cursor: grab !important;
          user-select: none;
          -webkit-user-select: none;
        }
        .leaflet-container:active,
        .leaflet-container.leaflet-drag-target,
        .leaflet-dragging .leaflet-container {
          cursor: grabbing !important;
        }

        .leaflet-control-attribution {
          background: rgba(247,244,237,0.88) !important;
          color: #88827A !important;
          font-size: 10px !important;
          border-radius: 6px 0 0 0 !important;
        }
        .leaflet-control-attribution a { color: #8B2635 !important; }
      `}</style>

      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        zoomControl={false}
        dragging={true}
        inertia={true}
        inertiaDeceleration={3000}
        inertiaMaxSpeed={2500}
        easeLinearity={0.2}
        className="w-full h-full"
        style={{ zIndex: 0 }}
      >
        <TileLayer
          url={TILE_URL}
          attribution={ATTRIBUTION}
          maxZoom={19}
        />

        <FlyToIssue issue={selectedIssue} />

        {/* Custom Navigation controller handling mouse wheel 2D pan, middle drag & keyboard */}
        <MapNavigationController wheelMode={wheelMode} />

        {/* Directional D-Pad & Control Cluster Dock */}
        <NavigationDock
          wheelMode={wheelMode}
          setWheelMode={setWheelMode}
          isSidePanelOpen={Boolean(selectedIssue)}
        />

        {/* Heatmap overlay with restrained status colors */}
        {showHeatmap &&
          hotspots.map((pt, i) => (
            <CircleMarker
              key={`hs-${i}`}
              center={[pt.lat, pt.lng]}
              radius={50 + pt.intensity * 4}
              pathOptions={{
                fillColor:
                  pt.intensity > 7 ? "#B83A3A" : pt.intensity > 5 ? "#C58B32" : "#5E8061",
                fillOpacity: 0.15,
                stroke: false,
              }}
            />
          ))}
        {showHeatmap &&
          issues.map((issue) => (
            <CircleMarker
              key={`heat-${issue.id}`}
              center={[issue.lat, issue.lng]}
              radius={30}
              pathOptions={{
                fillColor: SEV_COLOR[issue.severity],
                fillOpacity: 0.12,
                stroke: false,
              }}
            />
          ))}

        {/* Clustered pins — uses deduped list so only primary pins render */}
        <PinCluster
          issues={dedupedIssues}
          selectedIssue={selectedIssue}
          onSelectIssue={onSelectIssue}
        />
      </MapContainer>
    </>
  );
}
