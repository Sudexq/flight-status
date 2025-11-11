// src/app/services/flight-data.ts
import { Injectable, signal } from '@angular/core';
import { FlightInterface as Flight } from '../flight.model';

@Injectable({ providedIn: 'root' }) //bu servisin uygulama genelinde tek kopya (singleton) olarak kullanılmasını sağlar.
export class FlightDataService {
  private _results = signal<Flight[]>([]); // Arama/filtre sonucu ekranda gösterilecek liste

  //_ öneki bunların private (sadece servis içinde erişilebilir) olduğunu gösterir.

  // ---- read APIs (component'ler bunları kullanır) ----
  // Bunlar okuma fonksiyonlarıdır
  // Component tarafında sadece bunlar çağrılır; private _results değişkenine doğrudan erişilmez.
  results = () => this._results();

  // ---- write APIs (setter) ----
  // Arama sonucunu yeni bir listeyle değiştirir
  // Eğer liste doluysa ilk elemanı otomatik olarak seçili hale getirir
  setResults(list: Flight[]) {
    this._results.set(list ?? []);
  }

  // Her şeyi sıfırlar (arama kutusu “Temizle” butonuna bastığında kullanılır)
  clear() {
    this._results.set([]);
  }
}

// signal nedir?

//Angular 16+ sürümlerinde gelen signal() özelliği,
//React’in state’ine benzer bir reaktif (otomatik güncellenen) veri sistemidir.

// signal() = değer saklayan ve değiştiğinde bağlı yerleri otomatik yenileyen bir mini “state store”.

// .set() ile güncellenir.

// Çağırdığında (this._results()) o anki değeri verir.

// Signal değiştiğinde o sinyali kullanan component’ler otomatik yeniden render edilir.
