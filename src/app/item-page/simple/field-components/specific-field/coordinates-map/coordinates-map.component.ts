import { Component, Input } from '@angular/core';
import { Item } from '../../../../../core/shared/item.model';
import { LeafletMapService } from 'src/app/shared/location-picker/leaflet-map.service';
import { Map, Marker } from 'leaflet';

@Component({
  selector: 'ds-coordinates-map',
  templateUrl: './coordinates-map.component.html',
  styleUrls: ['./coordinates-map.component.scss']
})
export class CoordinatesMapComponent {

  /**
   * The item to display metadata for
   */
  @Input() item: Item;

  /**
   * Fields (schema.element.qualifier) used to render their values.
   */
  @Input() field: string;

  /**
   * Label i18n key for the rendered metadata
   */
  @Input() label: string;

  map!: Map;
  markers: Marker[] = [];
  markersInfo = [];

  constructor (protected leafletMapService: LeafletMapService) {}

  ngAfterViewInit() {
    if (this.leafletMapService.L && this.hasCoordinates()) {
      this.initMarkers();
    }
  }

  initMarkers() {

    if (this.leafletMapService.L) {

      // Create the map in the #map container
      this.map = this.leafletMapService.L.map('map').setZoom(8);

      // Add a tilelayer
      this.leafletMapService.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '<a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        // Se puede incluir otro enlace cambiando por (por ejemplo):
        //attribution: '<a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors | <a href="http://georebiun.upc.edu">GeoRebiun</a>'
      }).addTo(this.map);

      // Icons
      this.leafletMapService.L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'assets/images/leaflet/marker-icon-2x.png',
        iconUrl: 'assets/images/leaflet/marker-icon.png',
        shadowUrl: 'assets/images/leaflet/marker-shadow.png'
      });

      // Soluciona problema con imágenes del mapa (tiles) que no se cargan inicialmente
      // https://stackoverflow.com/questions/38832273/leafletjs-not-loading-all-tiles-until-moving-map
      const mapVar = this.map;
      this.map.on('load',function() {
          setTimeout(() => {
            mapVar.invalidateSize();
          }, 1);
      });

      this.markersInfo = this.item.allMetadataValues(this.field)
        .filter((value: string) => value.startsWith('east='))
        .map((value: string) => {
          // Get current longitude and latitude
          let lng = 0;
          let lat = 0;
          let name = '';
          let parts = value.split('; ');
          for (let index = 0; index < parts.length; ++index) {
            if (parts[index].lastIndexOf('east=', 0) === 0) {
              lng = Number(parts[index].substring('east='.length));
            }
            if (parts[index].lastIndexOf('north=', 0) === 0) {
              lat = Number(parts[index].substring('north='.length));
            }
            if (parts[index].lastIndexOf('name=', 0) === 0) {
              name = parts[index].substring('name='.length);
            }
          }
          return {
            position: { lat: lat, lng: lng },
            name: name
          };
        });

      for (let index = 0; index < this.markersInfo.length; index++) {
        const data = this.markersInfo[index];
        const marker = this.generateMarker(data, index);
        marker.addTo(this.map).bindPopup(`<b>${data.name}</b>`);
        this.map.panTo(data.position);
        this.markers.push(marker);
      }

      if (this.markers.length === 1) {
        this.zoomMarker(this.markersInfo[0].position);
      } else {
        let group = this.leafletMapService.L.featureGroup(this.markers);
        this.map.fitBounds(group.getBounds(), {padding: [50,50]});
      }
    }
  }

  generateMarker(data: any, index: number) {
    return this.leafletMapService.L.marker(data.position, { draggable: false });
  }

  zoomMarker(position) {
    this.map.setView(new this.leafletMapService.L.LatLng(position.lat, position.lng), 8);
  }

  hasCoordinates() {
    return this.item.allMetadata(this.field).some(v => v.value.startsWith('east='));
  }

}
