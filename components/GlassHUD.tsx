// components/GlassHUD.tsx - Canlı Hız, Manevra ve Uyarı Göstergesi
"use client";
import { Navigation, CloudRain, Wind, AlertTriangle, Thermometer, Battery } from "lucide-react";

interface CurrentSegmentProps {
    speed: number;
    temp?: number;
    warning: string;
    hazard: boolean;
    // Yeni eklenen alanlar:
    maneuverInstruction?: string; 
    distanceKm?: number;
    etaMinutes?: number;
}

export default function GlassHUD({ currentSegment }: { currentSegment: CurrentSegmentProps }) {
    
    const WarningIcon = currentSegment.warning.includes("YAĞIŞ") ? CloudRain : 
                        currentSegment.warning.includes("RÜZGAR") ? Wind : 
                        AlertTriangle;

    const displayManeuver = currentSegment.maneuverInstruction || "ROTALAMA BEKLENİYOR";
    const displayDistance = currentSegment.distanceKm ? `${currentSegment.distanceKm.toFixed(1)} km` : "---";
    const displayETA = currentSegment.etaMinutes ? new Date(Date.now() + currentSegment.etaMinutes * 60000).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : "--:--";

    return (
        <>
            {/* Üst Bilgi Paneli (Manevra Bilgisi) */}
            <div className="absolute top-4 left-4 right-4 z-50 flex justify-between items-start">
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-3xl shadow-2xl flex flex-col gap-1 w-2/3">
                    <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-widest">
                        <Navigation size={14} /> SIRADAKİ MANEVRA
                    </div>
                    {/* CANLI MANEVRA TALİMATI */}
                    <div className="text-2xl font-bold text-white line-clamp-2">
                        {displayManeuver}
                    </div> 
                    {/* CANLI MESAFE */}
                    <div className="text-neonBlue font-mono">{displayDistance}</div>
                </div>
                
                {/* Pil Göstergesi (Statik) */}
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-3 rounded-full shadow-2xl">
                    <Battery size={24} className="text-green-400" />
                </div>
            </div>

            {/* Tehlike Uyarısı (Dinamik) */}
            {currentSegment.hazard && (
                <div className="absolute top-32 left-1/2 -translate-x-1/2 z-[100] animate-pulse">
                    <div className="bg-red-500/20 backdrop-blur-md border border-red-500/50 px-6 py-3 rounded-full flex items-center gap-3">
                        <WarningIcon className="text-red-500" />
                        <span className="text-white font-bold">{currentSegment.warning}</span>
                    </div>
                </div>
            )}

            {/* Alt Gösterge Paneli */}
            <div className="absolute bottom-8 left-4 right-4 z-50 grid grid-cols-3 gap-4">
                {/* Hız (CANLI GPS Verisi) */}
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-3xl flex flex-col items-center justify-center">
                    <span className="text-gray-400 text-xs">HIZ</span>
                    <span className="text-4xl font-black text-white">
                        {currentSegment.speed !== undefined ? currentSegment.speed : '--'}
                    </span>
                    <span className="text-xs text-gray-500">km/h</span>
                </div>

                {/* Hava Durumu/Sıcaklık (CANLI Veri) */}
                <div className="backdrop-blur-xl border p-4 rounded-3xl flex flex-col items-center justify-center bg-black/40 border-white/10">
                    <span className="text-gray-400 text-xs">SICAKLIK</span>
                    <Thermometer className="text-orange-400 my-1" />
                    <span className="text-sm font-bold">
                         {currentSegment.temp !== undefined ? `${currentSegment.temp}°C` : '--'}
                    </span>
                </div>

                {/* ETA (CANLI HESAPLAMA) */}
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-3xl flex flex-col items-center justify-center">
                    <span className="text-gray-400 text-xs">TAHMİNİ VARIŞ</span>
                    <span className="text-2xl font-bold text-white">{displayETA}</span>
                    <span className="text-xs text-neonBlue">/ Toplam {displayDistance}</span>
                </div>
            </div>
        </>
    );
}