import { Component } from '@angular/core';

import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { SiteStatisticsPageComponent } from './site-statistics-page.component';

/**
 * Themed wrapper for SiteStatisticsPageComponent
 */
@Component({
  selector: 'ds-site-statistics-page',
  styleUrls: [],
  templateUrl: '../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [
    SiteStatisticsPageComponent,
  ],
})
export class ThemedSiteStatisticsPageComponent extends ThemedComponent<SiteStatisticsPageComponent> {
  protected getComponentName(): string {
    return 'SiteStatisticsPageComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/statistics-page/site-statistics-page/site-statistics-page.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./site-statistics-page.component`);
  }

}
