import { AsyncPipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { RemoteData } from '../../core/data/remote-data';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { Item } from '../../core/shared/item.model';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { ViewMode } from '../../core/shared/view-mode.model';
import { getItemPageRoute } from '../../item-page/item-page-routing-paths';
import { BtnDisabledDirective } from '../../shared/btn-disabled.directive';
import { DSOSelectorModalWrapperComponent } from '../../shared/dso-selector/modal-wrappers/dso-selector-modal-wrapper.component';
import { CollectionElementLinkType } from '../../shared/object-collection/collection-element-link.type';
import { ListableObjectComponentLoaderComponent } from '../../shared/object-collection/shared/listable-object/listable-object-component-loader.component';
import { SearchObjects } from '../../shared/search/models/search-objects.model';
import { ProfileClaimService } from '../profile-claim/profile-claim.service';

/**
 * Component representing a modal that show a list of suggested profile item to claim
 */
@Component({
  selector: 'ds-profile-claim-item-modal',
  templateUrl: './profile-claim-item-modal.component.html',
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    ListableObjectComponentLoaderComponent,
    TranslateModule,
  ],
  standalone: true,
})
export class ProfileClaimItemModalComponent extends DSOSelectorModalWrapperComponent implements OnInit {

  /**
   * The current page's DSO
   */
  @Input() dso: DSpaceObject;

  /**
   * List of suggested profiles, if any
   */
  listEntries$: BehaviorSubject<RemoteData<SearchObjects<DSpaceObject>>> = new BehaviorSubject(null);

  /**
   * The view mode of the listed objects
   */
  viewMode = ViewMode.ListElement;

  /**
   * The available link types
   */
  linkTypes = CollectionElementLinkType;

  /**
   * A boolean representing form checkbox status
   */
  checked = false;

  /**
   * An event fired when user click on submit button
   */
  @Output() create: EventEmitter<any> = new EventEmitter<any>();

  constructor(protected activeModal: NgbActiveModal, protected route: ActivatedRoute, private router: Router,
              private profileClaimService: ProfileClaimService,
              public dsoNameService: DSONameService,
  ) {
    super(activeModal, route);
  }

  /**
   * Retrieve suggested profiles, if any
   */
  ngOnInit(): void {
    this.profileClaimService.searchForSuggestions(this.dso as EPerson).pipe(
      getFirstCompletedRemoteData(),
    ).subscribe(
      (result: RemoteData<SearchObjects<DSpaceObject>>) => this.listEntries$.next(result),
    );
  }

  /**
   * Close modal and Navigate to given DSO
   *
   * @param dso
   */
  selectItem(dso: DSpaceObject): void {
    this.close();
    this.navigate(dso);
  }

  /**
   * Navigate to given DSO
   *
   * @param dso
   */
  navigate(dso: DSpaceObject) {
    this.router.navigate([getItemPageRoute(dso as Item)]);
  }

  /**
   * Change the status of form's checkbox
   */
  toggleCheckbox() {
    this.checked = !this.checked;
  }

  /**
   * Emit an event when profile should be created from scratch
   */
  createFromScratch() {
    this.create.emit();
    this.close();
  }

}
