import { Component, AfterViewInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css'],
})
export class MapaComponent implements AfterViewInit {
  private map!: L.Map;
  nombre: string = '';
  capital: string = '';
  poblacion: number = 0;
  area: number = 0;

  constructor(private http: HttpClient) {}

  //Se trató de implementar en ngOnInit pero manda error porque la vista del componente y sus
  //componentes hijos se tienen que haber inicializado completamente por eso se utilizó
  //ngAfterViewInit
  ngAfterViewInit(): void {
    this.InicializarMapa();
    this.CargarMapa();
  }

  //Inicialización del mapa
  private InicializarMapa(): void {
    //Crear instancia de un mapa en un elemento div con id='mapa' y setView para centrar el
    //mapa en las coordenadas latitud 37.8, longitud -119.5 y un zoom de 3
    this.map = Leaflet.map('mapa').setView([37.8, -119.5], 4);

    //Añadir una capa de mosaico al mapa, usando OpenStreetMap como proveedor
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
  }

  private CargarMapa(): void {
    const url =
      'https://raw.githubusercontent.com/glynnbird/usstatesgeojson/master/california.geojson';
    this.http.get(url).subscribe((geojson: any) => {
      //crear una capa Leaflet a partir del objeto GeoJSON
      Leaflet.geoJSON(geojson, {
        style: {
          color: '#3388ff',
          weight: 2,
          fillOpacity: 0.3,
        },
        //Añadir un popup que muestra el nombre de la entidad geográfica al hacer clic
        onEachFeature: (feature, layer) => {
          if (feature.properties) {
            this.nombre = feature.properties.name;
            this.capital = feature.properties.city;
            this.poblacion = feature.properties.population;
            this.area = feature.properties.area;
          }
          if (feature.properties && feature.properties.name) {
            layer.bindPopup(`<strong>${feature.properties.name}</strong>`);
          }
        },
      }).addTo(this.map);
    });
  }
}
