import { Config } from './config.interface';

export interface LocationPickerConfig extends Config {
  googleApiKey: string;
  metadata: string;
  zoom: number;
  center: {
    lat: number
    lng: number
  }
}
