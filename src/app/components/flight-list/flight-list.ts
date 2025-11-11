import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightDataService } from '../../services/flight-data';
import { FlightInterface as Flight } from '../../flight.model';

@Component({
  selector: 'app-flight-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flight-list.html',
  styleUrls: ['./flight-list.css'],
})
export class FlightList {
  //Angular’ın yeni fonksiyonu inject() → constructor yerine doğrudan servis “enjeksiyonu” sağlar
  private data = inject(FlightDataService);
  //(Bu, constructor(private data: FlightDataService) ile aynı işlevi görür.) FlightDataService bizim “paylaşılan state” servisimizdi.

  results = this.data.results; // signal getter

  // ---- helpers (template'i sade tutmak için) ----

  // OpenSky verileri hızları metre/saniye (m/s) olarak döndürür.
  toKnots(ms: number | null): string {
    if (ms == null) return '—';
    return Math.round(ms * 1.94384).toString(); // m/s → kt
  }

  // metre → feet çevirisi.
  toFeet(m: number | null): string {
    if (m == null) return '—';
    return Math.round(m * 3.28084).toLocaleString('en-US');
  }

  // dikey hız (vertical rate): saniyedeki metreyi dakikadaki feete çevirir.
  toFpm(ms: number | null): string {
    if (ms == null) return '—';
    return Math.round(ms * 196.850394).toString(); // m/s → ft/min
  }

  // rotayı derece cinsinden gösterir (örneğin 260°).
  fmtDeg(v: number | null): string {
    return v == null ? '—' : Math.round(v).toString();
  }

  // OpenSky zamanları Unix epoch (saniye) formatında verir. Bunu Date’e çevirip “saat:dakika” şeklinde gösterir (ör. 14:37).
  epochToTime(sec: number | null | undefined): string {
    if (!sec) return '—';
    const d = new Date(sec * 1000);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // v true ise uçak yerde, false ise havada.
  onGroundBadge(v: boolean | null | undefined): 'air' | 'ground' {
    return v ? 'ground' : 'air';
  }

  // OpenSky verilerinde position_source 0–2 arasında kodlanır.
  positionSourceLabel(src: number | null | undefined): string {
    switch (src) {
      case 0:
        return 'ADS-B';
      case 1:
        return 'ASTERIX';
      case 2:
        return 'MLAT';
      default:
        return 'Bilinmiyor';
    }
  }

  categoryLabel(cat: number | null | undefined): string {
    if (cat == null) return '—';
    // OpenSky category: ICAO aircraft type category (özet)
    const map: Record<number, string> = {
      0: 'Bilgi yok',
      1: 'Küçük < 7t',
      2: 'Orta 7–136t',
      3: 'Büyük > 136t',
      4: 'Yüksek performans',
      5: 'Helikopter',
      6: 'Planör',
      7: 'Paraşüt/Asılı',
      8: 'Dişli uçuş',
      9: 'Balon',
      10: 'Hava taşıtı (genel)',
      11: 'Askeri',
      12: 'İnsansız/Drone',
      13: 'Uzay',
      14: 'Acil',
      15: 'Hizmet',
    };
    return map[cat] ?? `${cat}`;
  }

  //Her uçuşun koordinatını harita linkine dönüştürür.
  gmapsLink(lat: number | null, lon: number | null): string | null {
    if (lat == null || lon == null) return null;
    return `https://www.google.com/maps?q=${lat},${lon}`;
  }

  trackByIcao(_: number, f: Flight) {
    return f.icao24;
  }
}
