"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L, { type LatLngTuple } from "leaflet";

import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";

import { type Issue, type Severity, HOTSPOT_DATA } from "./mockData";

// ─── Config ───────────────────────────────────────────────────────────────────
const MAP_CENTER: LatLngTuple = [19.09, 72.865];
const MAP_ZOOM   = 13;
const TILE_URL   = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

// ─── Severity colours ─────────────────────────────────────────────────────────
const SEV_COLOR: Record<Severity, string> = {
  critical: "#ef4444",
  moderate: "#F59E0B",
  resolved: "#22C55E",
};

// ─── Custom teardrop DivIcon ──────────────────────────────────────────────────
function makeIcon(severity: Severity, selected: boolean) {
  const color = SEV_COLOR[severity];
  const size  = selected ? 34 : 26;
  return L.divIcon({
    html: `<div style="
        width:${size}px;height:${size}px;
        background:${color};
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        border:${selected ? "3px" : "2px"} solid rgba(255,255,255,0.75);
        box-shadow:${selected ? `0 0 20px ${color}` : `0 0 8px ${color}80`};
        transition:all 0.2s;">
        <div style="
          width:${size * 0.38}px;height:${size * 0.38}px;
          background:rgba(255,255,255,0.85);
          border-radius:50%;
          position:absolute;
          top:${size * 0.17}px;left:${size * 0.17}px;">
        </div>
      </div>`,
    className:   "",
    iconSize:    [size, size],
    iconAnchor:  [size / 2, size],
  });
}

// ─── Custom cluster icon ──────────────────────────────────────────────────────
function clusterIcon(cluster: { getChildCount: () => number }) {
  const n    = cluster.getChildCount();
  const size = n > 20 ? 50 : n > 10 ? 44 : 36;
  return L.divIcon({
    html: `<div class="cp-cluster" style="width:${size}px;height:${size}px;">${n}</div>`,
    className:  "",
    iconSize:   L.point(size, size, true),
    iconAnchor: [size / 2, size / 2],
  });
}

// ─── Sub-component: individual pin using vanilla Leaflet marker ───────────────
interface PinProps {
  issue:    Issue;
  selected: boolean;
  onClick:  () => void;
}

function Pin({ issue, selected, onClick }: PinProps) {
  const map = useMap();

  useEffect(() => {
    const m = L.marker([issue.lat, issue.lng], {
      icon:          makeIcon(issue.severity, selected),
      zIndexOffset:  selected ? 1000 : 0,
    }).addTo(map);
    m.on("click", onClick);
    return () => { m.remove(); };
  // Intentional: re-create marker when selection or severity changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issue.id, issue.severity, selected]);

  return null;
}

// ─── Sub-component: fly to selected issue ────────────────────────────────────
function FlyToIssue({ issue }: { issue: Issue | null }) {
  const map = useMap();
  useEffect(() => {
    if (!issue) return;
    const currentZoom = map.getZoom();
    map.flyTo([issue.lat, issue.lng], Math.max(currentZoom, 15), { duration: 0.9 });
  }, [issue, map]);
  return null;
}

// ─── Cluster wrapper — re-mounts on issues change ────────────────────────────
function PinCluster({
  issues,
  selectedIssue,
  onSelectIssue,
}: {
  issues:        Issue[];
  selectedIssue: Issue | null;
  onSelectIssue: (issue: Issue | null) => void;
}) {
  return (
    <MarkerClusterGroup
      chunkedLoading
      iconCreateFunction={clusterIcon as never}
      maxClusterRadius={60}
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

// ─── Main export ──────────────────────────────────────────────────────────────
interface LeafletMapProps {
  issues:        Issue[];
  selectedIssue: Issue | null;
  onSelectIssue: (issue: Issue | null) => void;
  showHeatmap:   boolean;
}

export default function LeafletMap({
  issues,
  selectedIssue,
  onSelectIssue,
  showHeatmap,
}: LeafletMapProps) {
  return (
    <>
      <style>{`
        /* Cluster bubble */
        .cp-cluster {
          background: rgba(20,184,166,0.18);
          border: 2px solid rgba(20,184,166,0.55);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13px;
          color: #14B8A6;
          font-family: 'Sora', sans-serif;
          backdrop-filter: blur(6px);
          box-shadow: 0 0 16px rgba(20,184,166,0.3);
        }
        /* Override react-leaflet-cluster defaults */
        .marker-cluster { background: transparent !important; }
        .marker-cluster div { background: transparent !important; }
        /* Map tile brightness */
        .leaflet-container { background: #0d1829 !important; }
        /* Dark controls */
        .leaflet-control-zoom a {
          background: rgba(15,23,42,0.88) !important;
          color: #94A3B8 !important;
          border-color: rgba(255,255,255,0.08) !important;
          backdrop-filter: blur(8px);
          transition: all 0.2s;
        }
        .leaflet-control-zoom a:hover {
          background: rgba(20,184,166,0.15) !important;
          color: #14B8A6 !important;
        }
        .leaflet-control-attribution {
          background: rgba(11,17,32,0.7) !important;
          color: #475569 !important;
          font-size: 10px !important;
          border-radius: 6px 0 0 0 !important;
        }
        .leaflet-control-attribution a { color: #14B8A6 !important; }
      `}</style>

      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        zoomControl
        className="w-full h-full"
        style={{ zIndex: 0 }}
      >
        <TileLayer
          url={TILE_URL}
          attribution={ATTRIBUTION}
          maxZoom={19}
          subdomains="abcd"
        />

        {/* Fly to selected marker */}
        <FlyToIssue issue={selectedIssue} />

        {/* Simulated heatmap overlay */}
        {showHeatmap && HOTSPOT_DATA.map((pt, i) => (
          <CircleMarker
            key={`hs-${i}`}
            center={[pt.lat, pt.lng]}
            radius={60 + pt.intensity * 5}
            pathOptions={{
              fillColor:   pt.intensity > 7 ? "#ef4444" : pt.intensity > 5 ? "#F59E0B" : "#22C55E",
              fillOpacity: 0.11 + pt.intensity * 0.012,
              stroke:      false,
            }}
          />
        ))}
        {showHeatmap && issues.map((issue) => (
          <CircleMarker
            key={`heat-${issue.id}`}
            center={[issue.lat, issue.lng]}
            radius={36}
            pathOptions={{
              fillColor:   SEV_COLOR[issue.severity],
              fillOpacity: 0.08,
              stroke:      false,
            }}
          />
        ))}

        {/* Clustered markers */}
        <PinCluster
          issues={issues}
          selectedIssue={selectedIssue}
          onSelectIssue={onSelectIssue}
        />
      </MapContainer>
    </>
  );
}
