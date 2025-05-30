import { Component } from '@angular/core';
import { ThemedComponent } from 'src/app/shared/theme-support/themed.component';

import { CreateCollectionParentSelectorComponent } from './create-collection-parent-selector.component';

/**
 * Themed wrapper for CreateCollectionParentSelectorComponent
 */
@Component({
  selector: 'ds-create-collection-parent-selector',
  styleUrls: [],
  templateUrl: '../../../theme-support/themed.component.html',
  standalone: true,
  imports: [
    CreateCollectionParentSelectorComponent,
  ],
})
export class ThemedCreateCollectionParentSelectorComponent
  extends ThemedComponent<CreateCollectionParentSelectorComponent> {

  protected getComponentName(): string {
    return 'CreateCollectionParentSelectorComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../themes/${themeName}/app/shared/dso-selector/modal-wrappers/create-collection-parent-selector/create-collection-parent-selector.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./create-collection-parent-selector.component');
  }

}
