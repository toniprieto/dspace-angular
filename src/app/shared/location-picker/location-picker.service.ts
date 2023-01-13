import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { APP_CONFIG, AppConfig } from '../../../config/app-config.interface';
import { Inject, Injectable } from '@angular/core';

// Fet a partir de l'exemple a:
// https://stackoverflow.com/questions/74402785/angular-lazy-loading-google-maps-you-have-included-the-google-maps-javascri

@Injectable({
  providedIn: 'root',
})
export class LocationPickerService {

  private currentApiStatus: BehaviorSubject<boolean>;
  obsCurrentApiStatus: Observable<boolean>;

  constructor(
    httpClient: HttpClient,
    @Inject(APP_CONFIG) protected appConfig: AppConfig
  ) {
    this.currentApiStatus =  new BehaviorSubject(Boolean(false));
    this.obsCurrentApiStatus = this.currentApiStatus.asObservable();

    let apiKey = this.appConfig.locationPicker.googleApiKey;
    httpClient.jsonp('https://maps.googleapis.com/maps/api/js?libraries=places,geometry&key=' + apiKey, 'callback')
      .pipe(
        map(() => true),
        catchError((error) => {
          console.log(error);
          return of(false);
        }),
      ).subscribe( loaded => {
      console.log(loaded);
      this.currentApiStatus.next(loaded);
    });
  }

  /**
   * Call to geocoder to get a name for a location/coordinates
   *
   * @param coordinates format <latitude>x<longitude>, by exemple:
   *                41.37669733971977x2.157391171874994
   */
  getNameByCoordinates(coordinates: string): Promise<string> {

    let geocoder = new google.maps.Geocoder;

    let parts = coordinates.split('x');
    let latParam = Number(parts[0]);
    let lngParam = Number(parts[1]);

    return new Promise(function(resolve, reject) {
      geocoder.geocode({'location': new google.maps.LatLng(latParam, lngParam)},
        function(results, status) {
          if (status === 'OK') {
            // First try to return position 1, more especific, else return position 0, more general
            if (results[1]) {
              resolve(results[1].formatted_address);
            } else if (results[0]) {
              resolve(results[0].formatted_address);
            } else {
              resolve('');
            }
          } else {
            reject('');
          }
        });
    });
  }

}
