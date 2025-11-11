import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; //Template-driven formu (örneğin [(ngModel)]) aktif eder.
import { CommonModule } from '@angular/common'; //*ngIf, *ngFor, date, number pipe’larını kullanmanı sağlar.
import { FlightInterface } from '../../flight.model';
import { FlightDataService } from '../../services/flight-data';
import { ApiService } from '../../api';

@Component({
  selector: 'app-search-component',
  imports: [FormsModule, CommonModule],
  templateUrl: './search-component.html',
  styleUrl: './search-component.css',
})
export class SearchComponent implements OnInit {
  flights: FlightInterface[] = []; // tüm uçuş verileri
  searchItem: string = ''; // input'taki arama kelimesi
  filtered: FlightInterface[] = []; // filtrelenmiş uçuşlar

  //servisi componenta private olarak enjekte eder. FlightDataService → componentler arası veri paylaşımını sağlar
  constructor(private apiService: ApiService, private flightData: FlightDataService) {}

  //component ilk yüklendiğinde çağırılan yer
  ngOnInit(): void {
    this.apiService.getAllStates().subscribe({
      //API çağrısı bir Observable döndürür. subscribe() ile bu veriye abone oluyorsun
      next: (data) => {
        //veri başarıyla geldiğinde çalışır
        console.log('[UI] flights:', data);
        this.flights = data; // uçuşları component’e kaydeder
      },
      error: (err) =>
        //bir hata olursa çalışır
        console.log('error: ', err),
    });
  }

  onSearch(): void {
    const q = this.searchItem.trim().toUpperCase().replace(/\s+/g, ''); //searchItem değerini normalize eder
    //trim() → baştaki/sondaki boşlukları siler.
    // toUpperCase() → büyük/küçük farkı olmasın diye.
    // .replace(/\s+/g, '') → çağrı kodundaki (callsign) boşlukları tamamen temizler.

    if (!q) {
      //Eğer arama boşsa
      this.filtered = [];
      this.flightData.clear();
      return;
    }

    //callsign içinde q geçen uçuşları bulur.
    this.filtered = this.flights.filter((f) =>
      (f.callsign ?? '').toUpperCase().replace(/\s+/g, '').includes(q)
    );

    // burada servise yazıyoruz → diğer component'ler okuyabilir
    this.flightData.setResults(this.filtered);
  }

  //Arama kutusunu ve filtreyi sıfırlar.
  //Ayrıca FlightDataService’deki paylaşılan veriyi de temizler, böylece diğer component’ler de boş görünür.
  clear(): void {
    this.searchItem = '';
    this.filtered = [];
    this.flightData.clear(); // paylaşılan state'i de temizle
  }
}
