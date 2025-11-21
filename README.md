# MotoMeteo – Türkiye için motosiklet navigasyon prototipi

Bu proje Next.js tabanlı, Türkiye odaklı bir motosiklet navigasyon prototipidir. Kullanıcının tarayıcı konumunu alır, Geoapify üzerinden arama/rota oluşturur, Open-Meteo ile rota boyunca hava durumunu, Overpass API ile de bozuk yol uyarılarını getirir.

## Gereksinimler
- Node.js 18+
- Geoapify API anahtarı
codex/review-current-repository-du94j2

## Ortam değişkenleri
Kök dizinde `.env.local` dosyası oluşturun:

```
GEOAPIFY_API_KEY=BURAYA_KENDI_KEYIMI_YAZACAGIM
```

## Çalıştırma
Gerekli paketler zaten yüklü ise doğrudan geliştirme sunucusunu başlatabilirsiniz:

```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışır.

Kod stilini ve tipleri kontrol etmek için:

```bash
npm run lint
```

## Özellikler
- **Türkçe arama**: Geoapify üzerinden adres/POI arama ve öneri listesi.
- **Rota oluşturma**: Geoapify Routing ile motosiklet sürüşü için rota, mesafe ve süre bilgisi.
- **Başlat & takip**: Geolocation ile konum takibi, Türkçe turn-by-turn uyarıları (isteğe bağlı sesli).
- **Hava durumu**: Open-Meteo’dan rota boyunca örneklenmiş hava segmentleri renkli olarak haritada gösterilir.
- **Bozuk yol uyarıları**: Overpass API’den yüzey etiketlerine göre bozuk yol segmentleri tespit edilir ve rota üzerinde işaretlenir.

## Notlar
- Harita katmanı MapLibre ile `https://demotiles.maplibre.org/style.json` üzerinden gelir; ek bir anahtar gerekmez.
=======
- Mapbox gösterimi için bir Mapbox erişim anahtarı

## Ortam değişkenleri
Kök dizinde `.env.local` dosyası oluşturun:
codex/review-current-repository-n83hdn

```
GEOAPIFY_API_KEY=BURAYA_KENDI_KEYIMI_YAZACAGIM
NEXT_PUBLIC_MAPBOX_TOKEN=BURAYA_MAPBOX_TOKEN_YAZ
```

## Çalıştırma
Gerekli paketler zaten yüklü ise doğrudan geliştirme sunucusunu başlatabilirsiniz:

```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışır.

Kod stilini ve tipleri kontrol etmek için:

```bash
npm run lint
```


```
GEOAPIFY_API_KEY=BURAYA_KENDI_KEYIMI_YAZACAGIM
NEXT_PUBLIC_MAPBOX_TOKEN=BURAYA_MAPBOX_TOKEN_YAZ
```

## Çalıştırma
Gerekli paketler zaten yüklü ise doğrudan geliştirme sunucusunu başlatabilirsiniz:

```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışır.
 main

## Özellikler
- **Türkçe arama**: Geoapify üzerinden adres/POI arama ve öneri listesi.
- **Rota oluşturma**: Geoapify Routing ile motosiklet sürüşü için rota, mesafe ve süre bilgisi.
- **Başlat & takip**: Geolocation ile konum takibi, Türkçe turn-by-turn uyarıları (isteğe bağlı sesli).
- **Hava durumu**: Open-Meteo’dan rota boyunca örneklenmiş hava segmentleri renkli olarak haritada gösterilir.
- **Bozuk yol uyarıları**: Overpass API’den yüzey etiketlerine göre bozuk yol segmentleri tespit edilir ve rota üzerinde işaretlenir.

## Notlar
 main
- API çağrıları sadece backend (Next.js API route) üzerinden yapılır, frontend doğrudan üçüncü parti API’lere bağlanmaz.
- Prototip amaçlıdır; hız, stabilite ve kota limitleri production beklentisiyle test edilmemiştir.
