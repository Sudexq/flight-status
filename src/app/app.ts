import { Component } from '@angular/core';
import {FlightList} from "./components/flight-list/flight-list"
import {SearchComponent} from "./components/search-component/search-component"

@Component({
  selector: 'app-root',
  standalone: true, // NgModule kullanmadan bileşen (component) oluşturmanı sağlar.
  imports: [FlightList, SearchComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

}
