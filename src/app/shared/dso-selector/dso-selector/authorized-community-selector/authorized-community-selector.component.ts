import {
  AsyncPipe,
  NgClass,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommunityDataService } from 'src/app/core/data/community-data.service';
import { ActionType } from 'src/app/core/resource-policy/models/action-type.model';
import { Community } from 'src/app/core/shared/community.model';
import { CommunitySearchResult } from 'src/app/shared/object-collection/shared/community-search-result.model';

import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { FindListOptions } from '../../../../core/data/find-list-options.model';
import {
  buildPaginatedList,
  PaginatedList,
} from '../../../../core/data/paginated-list.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { getFirstCompletedRemoteData } from '../../../../core/shared/operators';
import { SearchService } from '../../../../core/shared/search/search.service';
import { hasValue } from '../../../empty.util';
import { HoverClassDirective } from '../../../hover-class.directive';
import { ThemedLoadingComponent } from '../../../loading/themed-loading.component';
import { NotificationsService } from '../../../notifications/notifications.service';
import { ListableObjectComponentLoaderComponent } from '../../../object-collection/shared/listable-object/listable-object-component-loader.component';
import { SearchResult } from '../../../search/models/search-result.model';
import { followLink } from '../../../utils/follow-link-config.model';
import { DSOSelectorComponent } from '../dso-selector.component';

@Component({
  selector: 'ds-authorized-community-selector',
  styleUrls: ['../dso-selector.component.scss'],
  templateUrl: '../dso-selector.component.html',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, InfiniteScrollModule, NgIf, NgFor, HoverClassDirective, NgClass, ListableObjectComponentLoaderComponent, ThemedLoadingComponent, AsyncPipe, TranslateModule],
})
/**
 * Component rendering a list of communities to select from
 */
export class AuthorizedCommunitySelectorComponent extends DSOSelectorComponent {

  @Input() action: ActionType;

  constructor(
    protected searchService: SearchService,
    protected communityDataService: CommunityDataService,
    protected notificationsService: NotificationsService,
    protected translate: TranslateService,
    protected dsoNameService: DSONameService,
  ) {
    super(searchService, notificationsService, translate, dsoNameService);
  }

  /**
   * Get a query to send for retrieving the current DSO
   */
  getCurrentDSOQuery(): string {
    return this.currentDSOId;
  }

  /**
   * Perform a search for authorized communities with the current query and page
   * @param query Query to search objects for
   * @param page  Page to retrieve
   * @param useCache Whether or not to use the cache
   */
  search(query: string, page: number, useCache: boolean = true): Observable<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>> {
    let searchListService$: Observable<RemoteData<PaginatedList<Community>>> = null;
    const findOptions: FindListOptions = {
      currentPage: page,
      elementsPerPage: this.defaultPagination.pageSize,
    };

    if (this.action === ActionType.WRITE) {
      searchListService$ = this.communityDataService
        .getEditAuthorizedCommunity(query, findOptions, useCache, false, followLink('parentCommunity'));
    } else if (this.action === ActionType.ADD) {
      searchListService$ = this.communityDataService
        .getAddAuthorizedCommunity(query, findOptions, useCache, false, followLink('parentCommunity'));
    } else {
      // By default, search for admin authorized communities
      searchListService$ = this.communityDataService
        .getAdminAuthorizedCommunity(query, findOptions, useCache, false, followLink('parentCommunity'));
    }
    return searchListService$.pipe(
      getFirstCompletedRemoteData(),
      map((rd) => Object.assign(new RemoteData(null, null, null, null), rd, {
        payload: hasValue(rd.payload) ? buildPaginatedList(rd.payload.pageInfo, rd.payload.page.map((com) => Object.assign(new CommunitySearchResult(), { indexableObject: com }))) : null,
      })),
    );
  }
}
