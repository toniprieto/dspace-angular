import {
  AsyncPipe,
  NgClass,
  NgFor,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
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
import { ItemDataService } from 'src/app/core/data/item-data.service';
import { Item } from 'src/app/core/shared/item.model';
import { ItemSearchResult } from 'src/app/shared/object-collection/shared/item-search-result.model';

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
  selector: 'ds-authorized-edit-item-selector',
  styleUrls: ['../dso-selector.component.scss'],
  templateUrl: '../dso-selector.component.html',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, InfiniteScrollModule, NgIf, NgFor, HoverClassDirective, NgClass, ListableObjectComponentLoaderComponent, ThemedLoadingComponent, AsyncPipe, TranslateModule],
})
/**
 * Component rendering a list of item to select from for editing
 */
export class AuthorizedEditItemSelectorComponent extends DSOSelectorComponent {

  constructor(
    protected searchService: SearchService,
    protected itemDataService: ItemDataService,
    protected notifcationsService: NotificationsService,
    protected translate: TranslateService,
    protected dsoNameService: DSONameService,
  ) {
    super(searchService, notifcationsService, translate, dsoNameService);
  }

  /**
   * Get a query to send for retrieving the current DSO
   */
  getCurrentDSOQuery(): string {
    return this.currentDSOId;
  }

  /**
   * Perform a search for authorized collections with the current query and page
   * @param query Query to search objects for
   * @param page  Page to retrieve
   * @param useCache Whether or not to use the cache
   */
  search(query: string, page: number, useCache: boolean = true): Observable<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>> {
    let searchListService$: Observable<RemoteData<PaginatedList<Item>>> = null;
    const findOptions: FindListOptions = {
      currentPage: page,
      elementsPerPage: this.defaultPagination.pageSize,
    };

    searchListService$ = this.itemDataService
      .findEditAuthorized(query, null, findOptions, useCache, false, followLink('owningCollection'));

    return searchListService$.pipe(
      getFirstCompletedRemoteData(),
      map((rd) => Object.assign(new RemoteData(null, null, null, null), rd, {
        payload: hasValue(rd.payload) ? buildPaginatedList(rd.payload.pageInfo, rd.payload.page.map((item) => Object.assign(new ItemSearchResult(), { indexableObject: item }))) : null,
      })),
    );
  }
}
