import { Component, ViewChild, ElementRef, OnInit, Input, Inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { APP_CONFIG, AppConfig } from '../../../config/app-config.interface';
import { GoogleMap } from '@angular/google-maps';
import { LocationPickerService } from './location-picker.service';

@Component({
  selector: 'ds-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss']
})
export class LocationPickerComponent implements OnInit {

  apiLoaded!: boolean;

  loadMarker = false;

  @Input() set inputValue(inputValue: string) {

    if (inputValue) {

      // Get current longitude and latitude
      let parts = inputValue.split('; ');
      for (let index = 0; index < parts.length; ++index) {
        if (parts[index].lastIndexOf('east=', 0) === 0) {
          this.longitude = Number(parts[index].substring('east='.length));
        }
        if (parts[index].lastIndexOf('north=', 0) === 0) {
          this.latitude = Number(parts[index].substring('north='.length));
        }
      }

      // Update center
      if (this.latitude !== undefined && this.longitude !== undefined) {
        this.center = {
          lng: this.longitude,
          lat: this.latitude
        };
        this.loadMarker = true;
      }
    }
  }

  coordinates = '';
  markers = []  as  any;

  @ViewChild('search', { static: false }) set content(content: ElementRef) {
    if (content) { // initially setter gets called with undefined

      //setTimeout(() => {
        // To check that the input field has been loades
        this.changeDetectorRef.detectChanges();
        this.searchElementRef = content;
        this.initMap();
        if (this.loadMarker) {
          this.addMarker(this.center);
        }
      //});

    }
  }
  public searchElementRef!: ElementRef;

  @ViewChild(GoogleMap)
  public map!: GoogleMap;

  zoom = 8;
  center!: any;
  options: google.maps.MapOptions = {
    zoomControl: true,
    gestureHandling: 'none',
    disableDefaultUI: true,
    fullscreenControl: true,
    disableDoubleClickZoom: true,
    mapTypeId: 'roadmap'
  };
  latitude!: any;
  longitude!: any;

  constructor(protected activeModal: NgbActiveModal,
              protected ngZone: NgZone,
              protected locationPickerService: LocationPickerService,
              private changeDetectorRef: ChangeDetectorRef,
              @Inject(APP_CONFIG) protected appConfig: AppConfig) {

    this.longitude = this.appConfig.locationPicker.center.lng;
    this.latitude =  this.appConfig.locationPicker.center.lat;
    this.zoom = this.appConfig.locationPicker.zoom;
    this.center = this.appConfig.locationPicker.center;
  }

  ngOnInit(): void {
    this.locationPickerService.obsCurrentApiStatus.subscribe(status => {
      this.apiLoaded = status.valueOf();
      this.changeDetectorRef.detectChanges();
    });
  }

  initMap() {

    // Binding autocomplete to search input control
    let autocomplete = new google.maps.places.SearchBox(
      this.searchElementRef.nativeElement
    );

    // Align search box to center
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(
      this.searchElementRef.nativeElement
    );

    autocomplete.addListener('places_changed', () => {
      this.ngZone.run(() => {

        // Get place results
        let places: google.maps.places.PlaceResult[] = autocomplete.getPlaces();
        if (places.length === 0) {
          return;
        }

        // Clear out the old markers.
        this.markers = [];

        // For each place, get the icon, name and location.
        let bounds = new google.maps.LatLngBounds();
        places.forEach((place, index) => {
          let icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

          let markerPoint = new google.maps.Marker({
            position: place.geometry.location,
            icon: icon,
            title: place.name,
          });

          // Create a marker for each place.
          this.markers.push(markerPoint);

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        this.map.fitBounds(bounds);
      });
    });
  }

  addMarker(location) {
    // Clear out the old markers.
    this.markers = [];

    this.markers.push({
      position: location
    });

    if (typeof location.lat === 'function') {
      this.coordinates = `${location.lat()}x${location.lng()}`;
    } else {
      this.coordinates = `${location.lat}x${location.lng}`;
    }

  }

  mapClick(event) {
    this.addMarker(event.latLng);
  }

  markerClick(marker) {
    this.addMarker(marker._position);
  }

  sendToParent(event) {

    let parts = this.coordinates.split('x');
    let latParam = Number(parts[0]);
    let lngParam = Number(parts[1]);

    this.locationPickerService.getNameByCoordinates(this.coordinates).then(
      (name) => {
        if (name !== '') {
          this.activeModal.close(`east=${lngParam}; north=${latParam}; name=${name}`);
        } else {
          this.activeModal.close(`east=${lngParam}; north=${latParam}`);
        }
      }).catch( () => {this.activeModal.close(`east=${lngParam}; north=${latParam}`);});
  }

}


