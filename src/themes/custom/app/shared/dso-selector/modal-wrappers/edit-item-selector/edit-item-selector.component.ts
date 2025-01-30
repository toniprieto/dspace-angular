import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { EditItemSelectorComponent as BaseComponent } from 'src/app/shared/dso-selector/modal-wrappers/edit-item-selector/edit-item-selector.component';

import { AuthorizedItemSelectorComponent } from '../../../../../../../app/shared/dso-selector/dso-selector/authorized-item-selector/authorized-item-selector.component';

@Component({
  selector: 'ds-themed-edit-item-selector',
  // styleUrls: ['./edit-item-selector.component.scss'],
  // templateUrl: './edit-item-selector.component.html',
  templateUrl: '../../../../../../../app/shared/dso-selector/modal-wrappers/edit-item-selector/edit-item-selector.component.html',
  standalone: true,
  imports: [NgIf, AuthorizedItemSelectorComponent, TranslateModule],
})
export class EditItemSelectorComponent extends BaseComponent {
}
