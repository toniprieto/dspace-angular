import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { MediaViewerVideoComponent as BaseComponent } from '../../../../../../app/item-page/media-viewer/media-viewer-video/media-viewer-video.component';
import { BtnDisabledDirective } from '../../../../../../app/shared/btn-disabled.directive';

@Component({
  selector: 'ds-themed-media-viewer-video',
  // templateUrl: './media-viewer-video.component.html',
  templateUrl: '../../../../../../app/item-page/media-viewer/media-viewer-video/media-viewer-video.component.html',
  // styleUrls: ['./media-viewer-video.component.scss'],
  styleUrls: ['../../../../../../app/item-page/media-viewer/media-viewer-video/media-viewer-video.component.scss'],
  standalone: true,
  imports: [
    BtnDisabledDirective,
    NgbDropdownModule,
    TranslateModule,
  ],
})
export class MediaViewerVideoComponent extends BaseComponent {
}
