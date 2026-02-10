"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { RouteScenario } from "@/lib/route-scenarios";

interface RouteMapProps {
  scenario: RouteScenario;
  cityColors: Record<string, string>;
}

export default function RouteMap({ scenario, cityColors }: RouteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [35.5, -78],
      zoom: 5,
      zoomControl: true,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 18,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      }
    ).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Draw scenario routes and markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear previous route layers
    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
    }

    const routeLayer = L.layerGroup().addTo(map);
    routeLayerRef.current = routeLayer;

    // Collect unique cities for markers
    const cities = new Map<
      string,
      { lat: number; lng: number; color: string }
    >();

    for (const leg of scenario.legs) {
      const fromColor = cityColors[leg.from.name] || "#3b82f6";
      const toColor = cityColors[leg.to.name] || "#3b82f6";

      // Register cities
      if (!cities.has(leg.from.name)) {
        cities.set(leg.from.name, {
          lat: leg.from.lat,
          lng: leg.from.lng,
          color: fromColor,
        });
      }
      if (!cities.has(leg.to.name)) {
        cities.set(leg.to.name, {
          lat: leg.to.lat,
          lng: leg.to.lng,
          color: toColor,
        });
      }

      // Draw route line
      const coords: L.LatLngExpression[] = [
        [leg.from.lat, leg.from.lng],
        [leg.to.lat, leg.to.lng],
      ];

      if (leg.type === "drive") {
        L.polyline(coords, {
          color: fromColor,
          weight: 3,
          opacity: 0.8,
        }).addTo(routeLayer);
      } else if (leg.type === "train") {
        L.polyline(coords, {
          color: "#a78bfa",
          weight: 3,
          opacity: 0.7,
          dashArray: "4, 6",
        }).addTo(routeLayer);
      } else {
        L.polyline(coords, {
          color: "#f59e0b",
          weight: 2,
          opacity: 0.6,
          dashArray: "8, 12",
        }).addTo(routeLayer);
      }
    }

    // Add city markers
    const markerPositions: L.LatLngExpression[] = [];

    for (const [name, { lat, lng, color }] of cities) {
      markerPositions.push([lat, lng]);

      const icon = L.divIcon({
        className: "",
        iconSize: [14, 14],
        iconAnchor: [7, 7],
        html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid rgba(0,0,0,0.15);box-shadow:0 0 6px ${color}40;"></div>`,
      });

      L.marker([lat, lng], { icon })
        .bindPopup(name, {
          className: "leaflet-dark-popup",
          closeButton: false,
        })
        .addTo(routeLayer);
    }

    // Fit bounds to all markers
    if (markerPositions.length > 1) {
      map.fitBounds(L.latLngBounds(markerPositions), { padding: [40, 40] });
    } else if (markerPositions.length === 1) {
      map.setView(markerPositions[0], 8);
    }
  }, [scenario, cityColors]);

  return <div ref={containerRef} className="h-[400px] w-full rounded-lg" />;
}
