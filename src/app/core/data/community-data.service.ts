import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  filter,
  map,
  switchMap,
  take,
} from 'rxjs/operators';

import { isNotEmpty } from '../../shared/empty.util';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RequestParam } from '../cache/models/request-param.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { Community } from '../shared/community.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { getAllCompletedRemoteData } from '../shared/operators';
import { BitstreamDataService } from './bitstream-data.service';
import { ComColDataService } from './comcol-data.service';
import { DSOChangeAnalyzer } from './dso-change-analyzer.service';
import { FindListOptions } from './find-list-options.model';
import { PaginatedList } from './paginated-list.model';
import { RemoteData } from './remote-data';
import { RequestService } from './request.service';

@Injectable({ providedIn: 'root' })
export class CommunityDataService extends ComColDataService<Community> {
  protected topLinkPath = 'search/top';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected comparator: DSOChangeAnalyzer<Community>,
    protected notificationsService: NotificationsService,
    protected bitstreamDataService: BitstreamDataService,
  ) {
    super('communities', requestService, rdbService, objectCache, halService, comparator, notificationsService, bitstreamDataService);
  }

  // this method is overridden in order to make it public
  getEndpoint() {
    return this.halService.getEndpoint(this.linkPath);
  }

  findTop(options: FindListOptions = {}, ...linksToFollow: FollowLinkConfig<Community>[]): Observable<RemoteData<PaginatedList<Community>>> {
    return this.getEndpoint().pipe(
      map(href => `${href}/search/top`),
      switchMap(href => this.findListByHref(href, options, true, true, ...linksToFollow)),
    );
  }

  /**
   * Get all communities the user is admin of
   *
   * @param query                       limit the returned collection to those with metadata values
   *                                    matching the query terms. The query is also used to build a prefix query. It can be used to implement
   *                                    an autosuggest feature over the object name
   * @param options                     The [[FindListOptions]] object
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   * @return Observable<RemoteData<PaginatedList<Community>>>
   *    community list
   */
  getAdminAuthorizedCommunity(query: string, options: FindListOptions = {}, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<Community>[]): Observable<RemoteData<PaginatedList<Community>>> {
    const searchHref = 'findAdminAuthorized';
    options = Object.assign({}, options, {
      searchParams: [new RequestParam('query', query)],
    });

    return this.searchBy(searchHref, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow).pipe(
      getAllCompletedRemoteData(),
    );
  }

  /**
   * Get all communities the user is authorized to add a new subcommunity or collection to
   *
   * @param query                       limit the returned collection to those with metadata values
   *                                    matching the query terms. The query is also used to build a prefix query. It can be used to implement
   *                                    an autosuggest feature over the object name
   * @param options                     The [[FindListOptions]] object
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   * @return Observable<RemoteData<PaginatedList<Community>>>
   *    community list
   */
  getAddAuthorizedCommunity(query: string, options: FindListOptions = {}, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<Community>[]): Observable<RemoteData<PaginatedList<Community>>> {
    const searchHref = 'findAddAuthorized';
    options = Object.assign({}, options, {
      searchParams: [new RequestParam('query', query)],
    });

    return this.searchBy(searchHref, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow).pipe(
      getAllCompletedRemoteData(),
    );
  }

  /**
   * Get all communities the user is authorized to edit
   *
   * @param query                       limit the returned collection to those with metadata values
   *                                    matching the query terms. The query is also used to build a prefix query. It can be used to implement
   *                                    an autosuggest feature over the object name
   * @param options                     The [[FindListOptions]] object
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   * @return Observable<RemoteData<PaginatedList<Community>>>
   *    community list
   */
  getEditAuthorizedCommunity(query: string, options: FindListOptions = {}, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<Community>[]): Observable<RemoteData<PaginatedList<Community>>> {
    const searchHref = 'findEditAuthorized';
    options = Object.assign({}, options, {
      searchParams: [new RequestParam('query', query)],
    });

    return this.searchBy(searchHref, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow).pipe(
      getAllCompletedRemoteData(),
    );
  }

  protected getFindByParentHref(parentUUID: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      switchMap((communityEndpointHref: string) =>
        this.halService.getEndpoint('subcommunities', `${communityEndpointHref}/${parentUUID}`)),
    );
  }

  protected getScopeCommunityHref(options: FindListOptions) {
    return this.getEndpoint().pipe(
      map((endpoint: string) => this.getIDHref(endpoint, options.scopeID)),
      filter((href: string) => isNotEmpty(href)),
      take(1),
    );
  }
}
