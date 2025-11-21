<<<<<<< HEAD
// app/page.tsx - KONUM TAKİBİ VE TÜRKÇE MANEVRA ENTEGRASYONU
"use client";
import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic'; // <-- YENİ SATIR
import 'mapbox-gl/dist/mapbox-gl.css';

import RouteForm from '@/components/RouteForm'; 
import GlassHUD from '@/components/GlassHUD';
import { geocodeAddress, getRoute } from '@/utils/apiService';
import { generateRouteData } from '@/utils/mockData';

const Map = dynamic(() => import('react-map-gl'), { ssr: false });
const Source = dynamic(() => import('react-map-gl').then(mod => mod.Source), { ssr: false });
const Layer = dynamic(() => import('react-map-gl').then(mod => mod.Layer), { ssr: false });

// =================================================================
// 🔑 ANAHTARLARINIZIN DOLU VE DOĞRU OLDUĞUNDAN EMİN OLUN!
// =================================================================
const MAPBOX_TOKEN = "pk.eyJ1IjoiY2Vta28iLCJhIjoiY21pN2htNDl5MDEyZzJqcXd6anl3aDltZCJ9._flKPCpVht87p1oM8HCfXA"; 
const WEATHER_API_KEY = "f9e1fe316176e34f5d6a2691e49980a5";
// =================================================================
=======
"use client";

 codex/review-current-repository-du94j2
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Locate, Search } from "lucide-react";

const MAP_STYLE = "https://demotiles.maplibre.org/style.json";
const MAPLIBRE_JS = "https://unpkg.com/maplibre-gl@3.7.0/dist/maplibre-gl.js";
const MAPLIBRE_CSS = "https://unpkg.com/maplibre-gl@3.7.0/dist/maplibre-gl.css";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { Locate, Search } from "lucide-react";

// Harita bileşenleri (SSG sırasında hata vermemesi için dinamik)
const Map = dynamic(() => import("react-map-gl"), { ssr: false });
const Source = dynamic(() => import("react-map-gl").then((mod) => mod.Source), { ssr: false });
const Layer = dynamic(() => import("react-map-gl").then((mod) => mod.Layer), { ssr: false });

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
main

interface Coordinate {
  lat: number;
  lon: number;
}

interface SearchResult {
  id: string;
  name: string;
  formatted_address: string;
  lat: number;
  lon: number;
}

interface Maneuver extends Coordinate {
  distance: number;
  instruction: string;
}

interface WeatherSegment {
  from_km: number;
  to_km: number;
  summary: string;
  details: {
    avg_precip_prob: number;
    avg_wind_speed: number;
    avg_visibility: number;
  };
}

interface BadSegment {
  from_km: number;
  to_km: number;
  reason: string;
}

interface RouteResponse {
  polyline: [number, number][]; // [lon, lat]
  maneuvers: Maneuver[];
  distance_km: number;
  duration_minutes: number;
  weather_segments?: WeatherSegment[];
  bad_segments?: BadSegment[];
}

interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

function haversineDistance(a: Coordinate, b: Coordinate) {
  const R = 6371; // km
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

function nearestPointIndex(polyline: [number, number][], pos: Coordinate) {
  let best = 0;
  let bestDist = Infinity;
  polyline.forEach(([lon, lat], idx) => {
    const d = haversineDistance({ lat, lon }, pos);
    if (d < bestDist) {
      bestDist = d;
      best = idx;
    }
  });
  return { index: best, distanceKm: bestDist };
}
>>>>>>> 98e77ed1cb3d5ff07516f269c336068e4ad371e7

// Kullanıcının gerçek GPS verilerini almak için hook
const useGeolocation = (onLocationFound: (coords: [number, number], speed: number, heading: number) => void) => {
    useEffect(() => {
        if (!navigator.geolocation) return;

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude, speed, heading } = position.coords;
                const speedKmH = speed !== null ? Math.round(speed * 3.6) : 0; 
                const bearing = heading !== null ? heading : 0; // Cihazın yönü (pusula)
                onLocationFound([longitude, latitude], speedKmH, bearing); 
            },
            (err) => {
                console.error("Konum Takip Hatasi:", err);
            },
            { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [onLocationFound]);
};


export default function Home() {
<<<<<<< HEAD
  const [viewState, setViewState] = useState({
    longitude: 29.0, 
=======
  const [viewState, setViewState] = useState<ViewState>({
    longitude: 29.0,
>>>>>>> 98e77ed1cb3d5ff07516f269c336068e4ad371e7
    latitude: 41.0,
    zoom: 10,
    pitch: 45,
    bearing: 0,
  });
<<<<<<< HEAD
  
  const [startCoords, setStartCoords] = useState<[number, number] | null>(null); 
  const [routeData, setRouteData] = useState<any>(null); 
  const [currentSpeed, setCurrentSpeed] = useState(0); 
  const [weatherData, setWeatherData] = useState<any>(null); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMapTracking, setIsMapTracking] = useState(true); // Harita takip ediyor mu?
  
  const routeColor = weatherData?.hazard ? '#ff0055' : '#00f3ff'; 

  // Konum Takibi ve Hız Güncelleme Callback'i
  const handleLocationUpdate = useCallback((coords: [number, number], speed: number, heading: number) => {
    setStartCoords(coords);
    setCurrentSpeed(speed);
    
    if (isMapTracking) { // Sadece takip açıksa haritayı güncelle
        setViewState(prev => ({ 
            ...prev, 
            longitude: coords[0], 
            latitude: coords[1], 
            bearing: heading, // Harita yönü cihazın yönüyle aynı olur
            zoom: prev.zoom < 14 ? 14 : prev.zoom // Yeterince zoom yap
        }));
    }
  }, [isMapTracking]);

  // Canlı Konum Takibi Hook'u çağır
  useGeolocation(handleLocationUpdate);


  // Rota hesaplama akışı
  const handleRouteSubmit = useCallback(async (address: string) => {
    if (!startCoords) {
        setError("Lütfen GPS konumunuzun belirlenmesini bekleyin.");
        return;
=======

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [selected, setSelected] = useState<SearchResult | null>(null);

  const [startCoords, setStartCoords] = useState<Coordinate | null>(null);
  const [route, setRoute] = useState<RouteResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [navInstruction, setNavInstruction] = useState<string>("");
  const [nextManeuverIndex, setNextManeuverIndex] = useState(0);
  const watchIdRef = useRef<number | null>(null);
  const [userMarker, setUserMarker] = useState<Coordinate | null>(null);
 codex/review-current-repository-du94j2
  const initialViewRef = useRef<ViewState>(viewState);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const mapLibRef = useRef<any>(null);
  const mapLoadPromiseRef = useRef<Promise<any> | null>(null);
  const weatherLayerIdsRef = useRef<string[]>([]);
  const badLayerIdsRef = useRef<string[]>([]);



 main
  const polylineGeoJson = useMemo(() => {
    if (!route?.polyline) return null;
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: route.polyline,
          },
          properties: {},
        },
      ],
    };
  }, [route]);

codex/review-current-repository-du94j2
  const loadMapLibre = useCallback(async () => {
    if (typeof window === "undefined") return null;
    if (mapLibRef.current) return mapLibRef.current;
    if (!mapLoadPromiseRef.current) {
      mapLoadPromiseRef.current = new Promise((resolve, reject) => {
        const existingScript = document.querySelector(`script[src="${MAPLIBRE_JS}"]`) as HTMLScriptElement | null;
        if (existingScript && (window as any).maplibregl) {
          mapLibRef.current = (window as any).maplibregl;
          resolve(mapLibRef.current);
          return;
        }

        const cssLink = document.createElement("link");
        cssLink.rel = "stylesheet";
        cssLink.href = MAPLIBRE_CSS;
        document.head.appendChild(cssLink);

        const script = document.createElement("script");
        script.src = MAPLIBRE_JS;
        script.async = true;
        script.onload = () => {
          mapLibRef.current = (window as any).maplibregl;
          if (mapLibRef.current) resolve(mapLibRef.current);
          else reject(new Error("MapLibre yüklenemedi"));
        };
        script.onerror = () => reject(new Error("MapLibre yüklenemedi"));
        document.head.appendChild(script);
      });
    }
    return mapLoadPromiseRef.current;
  }, []);

  const withMapReady = useCallback(
    (fn: (map: any) => void) => {
      const map = mapRef.current;
      if (!map) return;
      if (map.isStyleLoaded()) {
        fn(map);
      } else {
        map.once("load", () => fn(map));
      }
    },
    []
  );

  const upsertSourceAndLayer = useCallback(
    (
      map: any,
      sourceId: string,
      data: any,
      layer: { id: string; type: string; paint?: Record<string, any>; layout?: Record<string, any> }
    ) => {
      const existingSource = map.getSource(sourceId);
      if (existingSource) {
        existingSource.setData(data);
      } else {
        map.addSource(sourceId, {
          type: "geojson",
          data,
        });
      }

      if (!map.getLayer(layer.id)) {
        map.addLayer({
          source: sourceId,
          ...layer,
        });
      }
    },
    []
  );

  const removeLayerAndSource = useCallback((map: any, id: string) => {
    if (map.getLayer(id)) map.removeLayer(id);
    if (map.getSource(id)) map.removeSource(id);
  }, []);

  useEffect(() => {
    let cancelled = false;

    loadMapLibre()
      .then((lib) => {
        if (cancelled || !lib || !mapContainerRef.current) return;
        const initialView = initialViewRef.current;
        const map = new lib.Map({
          container: mapContainerRef.current,
          style: MAP_STYLE,
          center: [initialView.longitude, initialView.latitude],
          zoom: initialView.zoom,
          pitch: initialView.pitch,
          bearing: initialView.bearing,
        });

        mapRef.current = map;

        map.on("move", () => {
          const center = map.getCenter();
          setViewState({
            longitude: center.lng,
            latitude: center.lat,
            zoom: map.getZoom(),
            pitch: map.getPitch(),
            bearing: map.getBearing(),
          });
        });
      })
      .catch(() => setError("Harita yüklenemedi."));

    return () => {
      cancelled = true;
      if (watchIdRef.current && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [loadMapLibre]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const center = map.getCenter();
    const sameCenter = Math.abs(center.lng - viewState.longitude) < 1e-6 && Math.abs(center.lat - viewState.latitude) < 1e-6;
    if (sameCenter && Math.abs(map.getZoom() - viewState.zoom) < 1e-6) return;

    map.easeTo({
      center: [viewState.longitude, viewState.latitude],
      zoom: viewState.zoom,
      pitch: viewState.pitch,
      bearing: viewState.bearing,
      duration: 300,
    });
  }, [viewState.longitude, viewState.latitude, viewState.zoom, viewState.pitch, viewState.bearing]);

  const handleLocateClick = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Tarayıcınız konum servisini desteklemiyor.");
      return;
>>>>>>> 98e77ed1cb3d5ff07516f269c336068e4ad371e7
    }
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setStartCoords(coords);
        setUserMarker(coords);
        setViewState((prev) => ({ ...prev, latitude: coords.lat, longitude: coords.lon, zoom: 14 }));
        setIsLoading(false);
      },
      () => {
        setError("Konum izni alınamadı.");
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  }, []);

  // Arama için öneriler
  useEffect(() => {
    const controller = new AbortController();
    if (query.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal });
        if (!res.ok) throw new Error("Arama hatası");
        const data: SearchResult[] = await res.json();
        setSuggestions(data);
      } catch (err) {
        if (!(err instanceof DOMException)) setError("Arama sırasında sorun oluştu.");
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [query]);

  const handleRouteRequest = useCallback(async () => {
    if (!startCoords) {
      setError("Önce konumunuzu belirleyin.");
      return;
    }
    if (!selected) {
      setError("Hedef seçin.");
      return;
    }

    setIsLoading(true);
    setError(null);
<<<<<<< HEAD
    
    const endCoords = await geocodeAddress(address, MAPBOX_TOKEN); 
    if (!endCoords) {
        setError("Hedef adres bulunamadı.");
        setIsLoading(false);
        return;
=======
    try {
      const res = await fetch("/api/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from: startCoords, to: { lat: selected.lat, lon: selected.lon } }),
      });
      if (!res.ok) throw new Error("Rota hesaplanamadı");
      const data: RouteResponse = await res.json();
      setRoute(data);
      setNextManeuverIndex(0);
      setNavInstruction("");
      setViewState((prev) => ({ ...prev, zoom: 11 }));
    } catch (err) {
      setError("Rota hesaplanırken hata oluştu.");
    } finally {
      setIsLoading(false);
>>>>>>> 98e77ed1cb3d5ff07516f269c336068e4ad371e7
    }
  }, [selected, startCoords]);

<<<<<<< HEAD
    // Mapbox'tan TÜM rota objesini çek
    const fullRoute = await getRoute(startCoords, endCoords, MAPBOX_TOKEN); 
    
    if (fullRoute) {
        setRouteData(fullRoute); 
        setViewState(prev => ({ ...prev, zoom: 14, bearing: 0 })); // Rotayı bulunca takibi başlat (bearing sıfırla)
        setIsMapTracking(true); // Rota bulununca takibi tekrar aç
        
        // ... (Hava durumu analizi aynı kalır) ...
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${endCoords[1]}&lon=${endCoords[0]}&appid=${WEATHER_API_KEY}&units=metric`;
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();
        
        if (weatherData.main) {
             const isRain = weatherData.weather[0].main.toLowerCase().includes("rain");
             const isWindy = weatherData.wind.speed > 10;
             setWeatherData({
                temp: Math.round(weatherData.main.temp),
                hazard: isRain || isWindy,
                warning: isRain ? "ŞİDDETLİ YAĞIŞ VAR" : isWindy ? "KUVVETLİ RÜZGAR" : "TEMİZ YOL",
            });
        }
    } else {
        setError("Rota hesaplanamadı.");
        setRouteData(null);
    }
    
    setIsLoading(false);
  }, [startCoords]);


  // --- MANEVRA VE ETA HESAPLAMA ---
  const getRouteDetails = () => {
    if (!routeData) {
        return { 
            instruction: "ROTALAMA BEKLENİYOR", 
            distance: 0, 
            durationMinutes: 0 
        };
    }
    
    // İlk adım talimatını ve genel süreyi/mesafeyi al
    const firstLeg = routeData.legs[0];
    const firstManeuver = firstLeg.steps[0].maneuver.instruction;

    const totalDurationMinutes = Math.round(routeData.duration / 60);
    const totalDistanceKm = routeData.distance / 1000;
    
    return {
        instruction: firstManeuver,
        distance: totalDistanceKm,
        durationMinutes: totalDurationMinutes
    };
  };

  const routeDetails = getRouteDetails();
=======
  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "tr-TR";
    window.speechSynthesis.speak(utter);
  }, []);

  const handleNavigationStart = useCallback(() => {
    if (!route || !navigator.geolocation) return;
    if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setUserMarker(coords);
        setViewState((prev) => ({ ...prev, latitude: coords.lat, longitude: coords.lon }));

        const { distanceKm } = nearestPointIndex(route.polyline, coords);
        if (distanceKm > 0.1) {
          setNavInstruction("Rotadan çıktın, yeni rota hesaplanıyor...");
          handleRouteRequest();
          return;
        }


  const handleLocateClick = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Tarayıcınız konum servisini desteklemiyor.");
      return;
    }
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setStartCoords(coords);
        setUserMarker(coords);
        setViewState((prev) => ({ ...prev, latitude: coords.lat, longitude: coords.lon, zoom: 14 }));
        setIsLoading(false);
      },
      () => {
        setError("Konum izni alınamadı.");
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  }, []);

  // Arama için öneriler
  useEffect(() => {
    const controller = new AbortController();
    if (query.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal });
        if (!res.ok) throw new Error("Arama hatası");
        const data: SearchResult[] = await res.json();
        setSuggestions(data);
      } catch (err) {
        if (!(err instanceof DOMException)) setError("Arama sırasında sorun oluştu.");
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [query]);

  const handleRouteRequest = useCallback(async () => {
    if (!startCoords) {
      setError("Önce konumunuzu belirleyin.");
      return;
    }
    if (!selected) {
      setError("Hedef seçin.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from: startCoords, to: { lat: selected.lat, lon: selected.lon } }),
      });
      if (!res.ok) throw new Error("Rota hesaplanamadı");
      const data: RouteResponse = await res.json();
      setRoute(data);
      setNextManeuverIndex(0);
      setNavInstruction("");
      setViewState((prev) => ({ ...prev, zoom: 11 }));
    } catch (err) {
      setError("Rota hesaplanırken hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  }, [selected, startCoords]);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "tr-TR";
    window.speechSynthesis.speak(utter);
  }, []);

  const handleNavigationStart = useCallback(() => {
    if (!route || !navigator.geolocation) return;
    if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setUserMarker(coords);
        setViewState((prev) => ({ ...prev, latitude: coords.lat, longitude: coords.lon }));

        const { distanceKm } = nearestPointIndex(route.polyline, coords);
        if (distanceKm > 0.1) {
          setNavInstruction("Rotadan çıktın, yeni rota hesaplanıyor...");
          handleRouteRequest();
          return;
        }

 main
        const nextIdx = Math.min(nextManeuverIndex, route.maneuvers.length - 1);
        const nextMan = route.maneuvers[nextIdx];
        const distToMan = haversineDistance(coords, { lat: nextMan.lat, lon: nextMan.lon }) * 1000; // m
        if (distToMan < 50) {
          setNextManeuverIndex((prev) => Math.min(prev + 1, route.maneuvers.length - 1));
        }

        if (distToMan < 250) {
          const text = `${Math.round(distToMan)} metre sonra ${nextMan.instruction}`;
          if (text !== navInstruction) speak(text);
          setNavInstruction(text);
        } else {
          setNavInstruction("");
        }
      },
      () => {
        setError("Konum takibi durdu.");
      },
      { enableHighAccuracy: true, maximumAge: 1000 }
    );
  }, [route, nextManeuverIndex, navInstruction, speak, handleRouteRequest]);

  // Sayfa yüklendiğinde konumu iste
  useEffect(() => {
    handleLocateClick();
  }, [handleLocateClick]);
>>>>>>> 98e77ed1cb3d5ff07516f269c336068e4ad371e7

  useEffect(() => {
    return () => {
      if (watchIdRef.current && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

 codex/review-current-repository-du94j2
  const renderWeatherSegmentsOnMap = useCallback(
    (map: any) => {
      weatherLayerIdsRef.current.forEach((id) => removeLayerAndSource(map, id));
      weatherLayerIdsRef.current = [];

      if (!route?.weather_segments || !route.polyline) return;
      const points = route.polyline;
      const cumulative: number[] = [0];
      for (let i = 1; i < points.length; i++) {
        const prev = { lat: points[i - 1][1], lon: points[i - 1][0] };
        const curr = { lat: points[i][1], lon: points[i][0] };
        cumulative[i] = cumulative[i - 1] + haversineDistance(prev, curr);
      }

      route.weather_segments.forEach((seg, idx) => {
        const coords: [number, number][] = [];
        for (let i = 0; i < points.length; i++) {
          const km = cumulative[i];
          if (km >= seg.from_km - 0.01 && km <= seg.to_km + 0.01) {
            coords.push(points[i]);
          }
        }
        const color = seg.summary.includes("rain")
          ? "#f59e0b"
          : seg.summary.includes("wind")
          ? "#f43f5e"
          : "#22c55e";
        const sourceId = `weather-${idx}`;
        const layerId = `weather-layer-${idx}`;
        const data = { type: "Feature", geometry: { type: "LineString", coordinates: coords } };
        upsertSourceAndLayer(map, sourceId, data, {
          id: layerId,
          type: "line",
          paint: { "line-color": color, "line-width": 7, "line-opacity": 0.8 },
        });
        weatherLayerIdsRef.current.push(sourceId);
      });
    },
    [removeLayerAndSource, route, upsertSourceAndLayer]
  );

  const renderBadSegmentsOnMap = useCallback(
    (map: any) => {
      badLayerIdsRef.current.forEach((id) => removeLayerAndSource(map, id));
      badLayerIdsRef.current = [];

      if (!route?.bad_segments || !route.polyline) return;
      const points = route.polyline;
      const cumulative: number[] = [0];
      for (let i = 1; i < points.length; i++) {
        const prev = { lat: points[i - 1][1], lon: points[i - 1][0] };
        const curr = { lat: points[i][1], lon: points[i][0] };
        cumulative[i] = cumulative[i - 1] + haversineDistance(prev, curr);
      }

      route.bad_segments.forEach((seg, idx) => {
        const coords: [number, number][] = [];
        for (let i = 0; i < points.length; i++) {
          const km = cumulative[i];
          if (km >= seg.from_km - 0.01 && km <= seg.to_km + 0.01) {
            coords.push(points[i]);
          }
        }
        const sourceId = `bad-${idx}`;
        const layerId = `bad-layer-${idx}`;
        const data = { type: "Feature", geometry: { type: "LineString", coordinates: coords } };
        upsertSourceAndLayer(map, sourceId, data, {
          id: layerId,
          type: "line",
          paint: { "line-color": "#ef4444", "line-dasharray": [1, 1], "line-width": 6 },
        });
        badLayerIdsRef.current.push(sourceId);
      });
    },
    [removeLayerAndSource, route, upsertSourceAndLayer]
  );

  useEffect(() => {
    withMapReady((map) => {
      if (polylineGeoJson) {
        upsertSourceAndLayer(map, "route", polylineGeoJson, {
          id: "route-line",
          type: "line",
          paint: { "line-color": "#38bdf8", "line-width": 5, "line-opacity": 0.8 },
        });
      } else {
        removeLayerAndSource(map, "route-line");
        removeLayerAndSource(map, "route");
      }

      if (startCoords) {
        upsertSourceAndLayer(map, "start", { type: "Feature", geometry: { type: "Point", coordinates: [startCoords.lon, startCoords.lat] } }, {
          id: "start-point",
          type: "circle",
          paint: { "circle-color": "#22d3ee", "circle-radius": 8, "circle-stroke-width": 2, "circle-stroke-color": "#fff" },
        });
      } else {
        removeLayerAndSource(map, "start-point");
        removeLayerAndSource(map, "start");
      }

      if (selected) {
        upsertSourceAndLayer(map, "target", { type: "Feature", geometry: { type: "Point", coordinates: [selected.lon, selected.lat] } }, {
          id: "target-point",
          type: "circle",
          paint: { "circle-color": "#f97316", "circle-radius": 8 },
        });
      } else {
        removeLayerAndSource(map, "target-point");
        removeLayerAndSource(map, "target");
      }

      if (userMarker) {
        upsertSourceAndLayer(map, "user", { type: "Feature", geometry: { type: "Point", coordinates: [userMarker.lon, userMarker.lat] } }, {
          id: "user-point",
          type: "circle",
          paint: { "circle-color": "#22c55e", "circle-radius": 9, "circle-stroke-color": "#000", "circle-stroke-width": 2 },
        });
      } else {
        removeLayerAndSource(map, "user-point");
        removeLayerAndSource(map, "user");
      }

      renderWeatherSegmentsOnMap(map);
      renderBadSegmentsOnMap(map);
    });
  }, [polylineGeoJson, renderBadSegmentsOnMap, renderWeatherSegmentsOnMap, selected, startCoords, userMarker, withMapReady, upsertSourceAndLayer, removeLayerAndSource]);

  const renderWeatherLayers = () => {
    if (!route?.weather_segments || !route.polyline) return null;
    const points = route.polyline;
    const cumulative: number[] = [0];
    for (let i = 1; i < points.length; i++) {
      const prev = { lat: points[i - 1][1], lon: points[i - 1][0] };
      const curr = { lat: points[i][1], lon: points[i][0] };
      cumulative[i] = cumulative[i - 1] + haversineDistance(prev, curr);
    }

    return route.weather_segments.map((seg, idx) => {
      const coords: [number, number][] = [];
      for (let i = 0; i < points.length; i++) {
        const km = cumulative[i];
        if (km >= seg.from_km - 0.01 && km <= seg.to_km + 0.01) {
          coords.push(points[i]);
        }
      }
      const color = seg.summary.includes("rain") ? "#f59e0b" : seg.summary.includes("wind") ? "#f43f5e" : "#22c55e";
      return (
        <Source key={`weather-${idx}`} id={`weather-${idx}`} type="geojson" data={{ type: "Feature", geometry: { type: "LineString", coordinates: coords } }}>
          <Layer
            id={`weather-layer-${idx}`}
            type="line"
            paint={{ "line-color": color, "line-width": 7, "line-opacity": 0.8 }}
          />
        </Source>
      );
    });
  };

  const renderBadRoads = () => {
    if (!route?.bad_segments || !route.polyline) return null;
    const points = route.polyline;
    const cumulative: number[] = [0];
    for (let i = 1; i < points.length; i++) {
      const prev = { lat: points[i - 1][1], lon: points[i - 1][0] };
      const curr = { lat: points[i][1], lon: points[i][0] };
      cumulative[i] = cumulative[i - 1] + haversineDistance(prev, curr);
    }

    return route.bad_segments.map((seg, idx) => {
      const coords: [number, number][] = [];
      for (let i = 0; i < points.length; i++) {
        const km = cumulative[i];
        if (km >= seg.from_km - 0.01 && km <= seg.to_km + 0.01) {
          coords.push(points[i]);
        }
      }
      return (
        <Source key={`bad-${idx}`} id={`bad-${idx}`} type="geojson" data={{ type: "Feature", geometry: { type: "LineString", coordinates: coords } }}>
          <Layer id={`bad-layer-${idx}`} type="line" paint={{ "line-color": "#ef4444", "line-dasharray": [1, 1], "line-width": 6 }} />
        </Source>
      );
    });
  };
 main

  const activeInstruction = route?.maneuvers?.[nextManeuverIndex]?.instruction;

  return (
    <main className="relative w-full h-screen bg-black overflow-hidden">
<<<<<<< HEAD
      
      {/* 🧭 Rota Formu ve Konum Butonu */}
      <RouteForm 
        onRouteSubmit={handleRouteSubmit}
        onLocateClick={() => setIsMapTracking(true)} // Konum butonuna basınca takibi aç
        isLoading={isLoading}
      />

      {/* ⚠️ Hata Mesajı */}
      {error && (
          <div className="absolute bottom-40 left-1/2 -translate-x-1/2 z-[100] bg-red-600/90 p-3 rounded-lg text-white font-bold shadow-xl">
              {error}
=======
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-3xl">
        <div className="bg-black/70 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl">
          <div className="flex gap-2 items-center">
            <button
              onClick={handleLocateClick}
              className="bg-emerald-500 hover:bg-emerald-400 text-black px-3 py-3 rounded-xl flex items-center gap-2 font-semibold"
              disabled={isLoading}
            >
              <Locate size={18} /> Konumum
            </button>
            <div className="relative flex-1">
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelected(null);
                }}
                className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none"
                placeholder="Nereye gidelim? (örn. Kadıköy, Shell Petrol)"
              />
              {suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-black/80 border border-white/10 rounded-xl max-h-64 overflow-auto z-50">
                  {suggestions.map((s) => (
                    <button
                      key={s.id}
                      className="w-full text-left px-4 py-3 hover:bg-white/10"
                      onClick={() => {
                        setSelected(s);
                        setQuery(s.name);
                        setSuggestions([]);
                      }}
                    >
                      <div className="text-white font-semibold">{s.name}</div>
                      <div className="text-xs text-gray-400">{s.formatted_address}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handleRouteRequest}
              disabled={isLoading || !selected}
              className="bg-cyan-400 hover:bg-cyan-300 text-black px-4 py-3 rounded-xl flex items-center gap-2 font-semibold disabled:opacity-50"
            >
              <Search size={18} /> Rota Oluştur
            </button>
>>>>>>> 98e77ed1cb3d5ff07516f269c336068e4ad371e7
          </div>
          {route && (
            <div className="mt-3 text-sm text-gray-300 flex gap-4">
              <span>Mesafe: {route.distance_km.toFixed(1)} km</span>
              <span>Süre: {Math.round(route.duration_minutes)} dk</span>
              {activeInstruction && <span>Sonraki: {activeInstruction}</span>}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-50 bg-red-600/90 text-white px-4 py-2 rounded-xl shadow-lg">
          {error}
        </div>
      )}

      {navInstruction && (
        <div className="absolute top-40 left-1/2 -translate-x-1/2 z-50 bg-amber-500/80 text-black px-6 py-4 rounded-2xl font-bold text-lg shadow-xl">
          {navInstruction}
        </div>
 codex/review-current-repository-du94j2
      )}

      {route?.bad_segments && route.bad_segments.length > 0 && (
        <div className="absolute bottom-40 left-1/2 -translate-x-1/2 z-50 bg-red-700/80 text-white px-5 py-3 rounded-2xl shadow-lg">
          {route.bad_segments.map((b, i) => (
            <div key={i}>{`${b.from_km.toFixed(1)}–${b.to_km.toFixed(1)} km arası yol kalitesi düşük (${b.reason}).`}</div>
          ))}
        </div>
      )}

      <div ref={mapContainerRef} className="w-full h-full" />

      )}

      {route?.bad_segments && route.bad_segments.length > 0 && (
        <div className="absolute bottom-40 left-1/2 -translate-x-1/2 z-50 bg-red-700/80 text-white px-5 py-3 rounded-2xl shadow-lg">
          {route.bad_segments.map((b, i) => (
            <div key={i}>{`${b.from_km.toFixed(1)}–${b.to_km.toFixed(1)} km arası yol kalitesi düşük (${b.reason}).`}</div>
          ))}
        </div>
      )}

<<<<<<< HEAD
      {/* --- HARİTA --- */}
=======
>>>>>>> 98e77ed1cb3d5ff07516f269c336068e4ad371e7
      <Map
        {...viewState}
        // Kullanıcı haritayı manuel kaydırırsa, takibi kapat
        onMove={(evt: any) => {
            setViewState(evt.viewState);
            if (evt.viewState.userInitiated) { 
                setIsMapTracking(false);
            }
        }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: "100%", height: "100%" }}
      >
<<<<<<< HEAD
        {/* Rota Çizgisi */}
        {routeData && (
            <Source id="route-source" type="geojson" data={routeData.geometry}>
                <Layer
                    id="route-layer"
                    type="line"
                    paint={{
                        'line-color': routeColor, 
                        'line-width': 6,
                        'line-opacity': 0.8
                    }}
                />
            </Source>
        )}
        
        {/* Başlangıç Konumu/Kullanıcı İşaretçisi */}
=======
        {polylineGeoJson && (
          <Source id="route" type="geojson" data={polylineGeoJson}>
            <Layer id="route-line" type="line" paint={{ "line-color": "#38bdf8", "line-width": 5, "line-opacity": 0.8 }} />
          </Source>
        )}

        {renderWeatherLayers()}
        {renderBadRoads()}

>>>>>>> 98e77ed1cb3d5ff07516f269c336068e4ad371e7
        {startCoords && (
          <Source
            id="start"
            type="geojson"
            data={{ type: "Feature", geometry: { type: "Point", coordinates: [startCoords.lon, startCoords.lat] } }}
          >
            <Layer
              id="start-point"
              type="circle"
              paint={{ "circle-color": "#22d3ee", "circle-radius": 8, "circle-stroke-width": 2, "circle-stroke-color": "#fff" }}
            />
          </Source>
        )}

        {selected && (
          <Source
            id="target"
            type="geojson"
            data={{ type: "Feature", geometry: { type: "Point", coordinates: [selected.lon, selected.lat] } }}
          >
            <Layer id="target-point" type="circle" paint={{ "circle-color": "#f97316", "circle-radius": 8 }} />
          </Source>
        )}

<<<<<<< HEAD
      {/* --- GÖSTERGELER (HUD) --- */}
      <GlassHUD 
          currentSegment={{
              speed: currentSpeed, 
              temp: weatherData?.temp, 
              warning: weatherData?.warning || (startCoords ? "VERİLER ALINIYOR" : "KONUM BEKLENİYOR"), 
              hazard: weatherData?.hazard || false,
              
              // CANLI MANEVRA BİLGİLERİ
              maneuverInstruction: routeDetails.instruction,
              distanceKm: routeDetails.distance,
              etaMinutes: routeDetails.durationMinutes
          }} 
      />
      
      {/* Hız Efekti */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
=======
        {userMarker && (
          <Source id="user" type="geojson" data={{ type: "Feature", geometry: { type: "Point", coordinates: [userMarker.lon, userMarker.lat] } }}>
            <Layer id="user-point" type="circle" paint={{ "circle-color": "#22c55e", "circle-radius": 9, "circle-stroke-color": "#000", "circle-stroke-width": 2 }} />
          </Source>
        )}
      </Map>
 main

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-4">
        <button
          onClick={handleNavigationStart}
          disabled={!route || isLoading}
          className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-4 rounded-2xl font-bold shadow-2xl disabled:opacity-50"
        >
          Başlat
        </button>
        <div className="bg-black/60 text-white px-4 py-3 rounded-2xl border border-white/10 min-w-[220px]">
          <div className="font-semibold text-sm">Hava / Yol Özeti</div>
          <div className="text-xs text-gray-300 mt-1">
 codex/review-current-repository-du94j2

 codex/review-current-repository-n83hdn
main
            {route
              ? route.weather_segments && route.weather_segments.length > 0
                ? `${route.weather_segments.length} bölümde dikkat gerektiren hava durumu var.`
                : "Hava verisi bulunamadı."
              : "Hava verisi yükleniyor..."}
          </div>
          <div className="text-xs text-gray-300 mt-1">
            {route
              ? route.bad_segments && route.bad_segments.length > 0
                ? `${route.bad_segments.length} kötü yol bölümü tespit edildi.`
                : "Kötü yol verisi bulunamadı."
 codex/review-current-repository-du94j2


            {route?.weather_segments?.length
              ? `${route.weather_segments.length} bölümde dikkat gerektiren hava durumu var.`
              : "Hava verisi yükleniyor..."}
          </div>
          <div className="text-xs text-gray-300 mt-1">
            {route?.bad_segments?.length
              ? `${route.bad_segments.length} kötü yol bölümü tespit edildi.`
 main
main
              : "Yol kalitesi taranıyor."}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/30" />
>>>>>>> 98e77ed1cb3d5ff07516f269c336068e4ad371e7
    </main>
  );
}