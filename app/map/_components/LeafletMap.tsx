"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L, { type LatLngTuple } from "leaflet";
import { type Issue, type Severity } from "@/lib/types";

import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";

import { HOTSPOT_DATA } from "./mockData";

// ─── Municipal GIS Config ──────────────────────────────────────────────────────
const MAP_CENTER: LatLngTuple = [19.09, 72.865];
const MAP_ZOOM = 13;
// Clean, light municipal Carto Positron map
const TILE_URL = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

// ─── Restrained Status Colors ──────────────────────────────────────────────────
const SEV_COLOR: Record<Severity, string> = {
  critical: "#B83A3A",
  moderate: "#C58B32",
  resolved: "#5E8061",
};

// ─── Custom Teardrop Marker ───────────────────────────────────────────────────
function makeIcon(severity: Severity, selected: boolean) {
  const color = SEV_COLOR[severity];
  const size = selected ? 32 : 24;
  return L.divIcon({
    html: `<div style="
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
      </div>`,
    className: "",
    iconSize: [size, size],
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
      icon: makeIcon(issue.severity, selected),
      zIndexOffset: selected ? 1000 : 0,
    }).addTo(map);
    m.on("click", onClick);
    return () => {
      m.remove();
    };
  }, [issue.id, issue.severity, selected, map, onClick]);

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
        .leaflet-container { background: #EFE9DE !important; }
        .leaflet-control-zoom a {
          background: #FFFFFF !important;
          color: #242222 !important;
          border: 1px solid #DED8CD !important;
          box-shadow: 0 2px 8px rgba(36,34,34,0.08) !important;
          transition: all 0.2s;
        }
        .leaflet-control-zoom a:hover {
          background: #F0E5D8 !important;
          color: #8B2635 !important;
        }
        .leaflet-control-attribution {
          background: rgba(247,244,237,0.85) !important;
          color: #88827A !important;
          font-size: 10px !important;
          border-radius: 6px 0 0 0 !important;
        }
        .leaflet-control-attribution a { color: #8B2635 !important; }
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

        <FlyToIssue issue={selectedIssue} />

        {/* Heatmap overlay with restrained status colors */}
        {showHeatmap &&
          HOTSPOT_DATA.map((pt, i) => (
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

        {/* Clustered pins */}
        <PinCluster
          issues={issues}
          selectedIssue={selectedIssue}
          onSelectIssue={onSelectIssue}
        />
      </MapContainer>
    </>
  );
}
