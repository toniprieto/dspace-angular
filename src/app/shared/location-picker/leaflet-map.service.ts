import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root',
  })
/**
 * Service to load Leaflet library only if we are using a browser.
 * The leaflet library can't be used with ssr mode because use object only available in browser platforms.
 */
export class LeafletMapService {

  public L = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(platformId)) {
      this.L = require('leaflet');
    }
  }

}
