// utils/apiService.ts

/**
 * Kullanıcının girdiği adresi koordinatlara (lon, lat) çevirir.
 * Bu kısım değişmedi.
 */
export async function geocodeAddress(address: string, token: string): Promise<[number, number] | null> {
  if (!token) return null;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${token}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.features.length > 0) {
      const [lon, lat] = data.features[0].geometry.coordinates;
      return [lon, lat];
    }
    return null;
  } catch (error) {
    console.error("Geocoding hatasi:", error);
    return null;
  }
}

/**
 * Rota hesaplar ve tüm detayları (steps, duration, distance) döndürür.
 * DİKKAT: language=tr parametresi eklendi.
 */
export async function getRoute(start: [number, number], end: [number, number], token: string): Promise<any | null> {
  if (!token) return null;
  
  const coordinates = `${start[0]},${start[1]};${end[0]},${end[1]}`;
  
  // language=tr eklenerek Türkçe talimat istenir.
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&steps=true&language=tr&access_token=${token}`; 
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      // Artık sadece geometri değil, tüm ilk rota objesini döndürüyoruz.
      return data.routes[0];
    }
    return null;
  } catch (error) {
    console.error("Rota hatasi:", error);
    return null;
  }
}