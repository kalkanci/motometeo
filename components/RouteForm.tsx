// components/RouteForm.tsx - Türkçe ve Dinamik
"use client";
import React, { useState } from 'react';
import { Locate, Search, Loader } from 'lucide-react';

interface RouteFormProps {
  onRouteSubmit: (address: string) => void;
  onLocateClick: () => void;
  isLoading: boolean;
}

export default function RouteForm({ onRouteSubmit, onLocateClick, isLoading }: RouteFormProps) {
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      onRouteSubmit(address);
    }
  };

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[100] w-11/12 max-w-lg">
      <form onSubmit={handleSubmit} className="bg-black/70 backdrop-blur-md p-3 rounded-xl shadow-2xl flex gap-2 border border-white/10">
        
        {/* Konum Belirleme Butonu */}
        <button
          type="button"
          onClick={onLocateClick}
          disabled={isLoading}
          title="Konum İzni İste"
          className="bg-neonRed/80 hover:bg-neonRed text-white p-3 rounded-lg transition-colors disabled:opacity-50"
        >
          <Locate size={20} />
        </button>
        
        {/* Adres Girişi */}
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Hedef adresinizi buraya yazın..."
          disabled={isLoading}
          className="flex-grow bg-transparent text-white placeholder-gray-400 focus:outline-none px-3 text-lg"
        />
        
        {/* Rota Bul Butonu */}
        <button
          type="submit"
          disabled={isLoading || !address.trim()}
          className="bg-neonBlue/80 hover:bg-neonBlue text-black p-3 rounded-lg transition-colors font-bold disabled:opacity-50 flex items-center justify-center w-16"
        >
          {isLoading ? <Loader size={20} className="animate-spin text-white" /> : <Search size={20} />}
        </button>
      </form>
    </div>
  );
}