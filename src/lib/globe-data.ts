/**
 * Globe data — real university cities and the "admission routes" that arc from a
 * student's home hub out to the world's best universities. Coordinates are real
 * lat/lng so the markers sit on the right part of the globe.
 */

export interface GlobePoint {
  id: string;
  label: string;
  lat: number;
  lng: number;
  /** Visual weight 0..1 — drives marker size/brightness. */
  weight?: number;
  /** Marks the student's origin hub (routes emanate from here). */
  hub?: boolean;
}

export const GLOBE_POINTS: GlobePoint[] = [
  { id: "home", label: "Tashkent", lat: 41.31, lng: 69.24, hub: true, weight: 1 },
  { id: "mit", label: "MIT · Cambridge", lat: 42.36, lng: -71.09, weight: 1 },
  { id: "stanford", label: "Stanford", lat: 37.43, lng: -122.17, weight: 0.95 },
  { id: "harvard", label: "Harvard", lat: 42.37, lng: -71.12, weight: 0.9 },
  { id: "oxford", label: "Oxford", lat: 51.75, lng: -1.26, weight: 0.95 },
  { id: "cambridge", label: "Cambridge", lat: 52.2, lng: 0.12, weight: 0.9 },
  { id: "eth", label: "ETH Zürich", lat: 47.38, lng: 8.55, weight: 0.85 },
  { id: "tum", label: "TU München", lat: 48.15, lng: 11.57, weight: 0.75 },
  { id: "nus", label: "NUS Singapore", lat: 1.3, lng: 103.77, weight: 0.85 },
  { id: "toronto", label: "Toronto", lat: 43.66, lng: -79.4, weight: 0.8 },
  { id: "tokyo", label: "U-Tokyo", lat: 35.71, lng: 139.76, weight: 0.8 },
  { id: "tsinghua", label: "Tsinghua", lat: 40.0, lng: 116.33, weight: 0.75 },
  { id: "hku", label: "HKU", lat: 22.28, lng: 114.14, weight: 0.7 },
  { id: "iit", label: "IIT Delhi", lat: 28.55, lng: 77.19, weight: 0.7 },
  { id: "sydney", label: "Sydney", lat: -33.87, lng: 151.21, weight: 0.75 },
  { id: "melbourne", label: "Melbourne", lat: -37.8, lng: 144.96, weight: 0.7 },
];

/** Routes arc from the home hub out to destinations (admission journeys). */
export const GLOBE_ROUTES: [string, string][] = [
  ["home", "mit"],
  ["home", "oxford"],
  ["home", "eth"],
  ["home", "nus"],
  ["home", "toronto"],
  ["home", "tokyo"],
  ["home", "sydney"],
  ["home", "tum"],
  ["home", "stanford"],
];
