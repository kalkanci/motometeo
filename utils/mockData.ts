// Rota üzerindeki noktaları ve hava durumunu simüle eder
export const generateRouteData = () => {
  // İstanbul - İzmir benzeri hayali bir rota segmentleri
  return [
    { id: 1, km: 0, time: "Now", weather: "clear", temp: 18, hazard: false, coordinates: [28.9784, 41.0082] },
    { id: 2, km: 20, time: "+15m", weather: "clear", temp: 17, hazard: false, coordinates: [29.0, 40.9] },
    { id: 3, km: 45, time: "+35m", weather: "windy", temp: 16, hazard: true, warning: "Crosswind 45km/h", coordinates: [29.1, 40.8] },
    { id: 4, km: 80, time: "+1h", weather: "rain", temp: 12, hazard: true, warning: "Heavy Rain", coordinates: [29.2, 40.6] },
    { id: 5, km: 120, time: "+1h 30m", weather: "clear", temp: 15, hazard: false, coordinates: [29.3, 40.4] },
  ];
};

export const calculateWindChill = (temp: number, speedKm: number) => {
  // Basit bir hissedilen sıcaklık formülü
  if (speedKm < 5) return temp;
  return Math.floor(temp - (speedKm * 0.05)); 
};