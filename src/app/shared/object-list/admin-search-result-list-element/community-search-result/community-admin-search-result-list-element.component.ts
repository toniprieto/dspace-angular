import { Component } from '@angular/core';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { Context } from '../../../../core/shared/context.model';
import { SearchResultListElementComponent } from '../../search-result-list-element/search-result-list-element.component';
import { CommunitySearchResult } from '../../../object-collection/shared/community-search-result.model';
import { Community } from '../../../../core/shared/community.model';
import { getCommunityEditPath } from '../../../../+community-page/community-page-routing.module';

@listableObjectComponent(CommunitySearchResult, ViewMode.ListElement, Context.AdminSearch)
@Component({
  selector: 'ds-community-admin-search-result-list-element',
  styleUrls: ['./community-admin-search-result-list-element.component.scss'],
  templateUrl: './community-admin-search-result-list-element.component.html'
})
/**
 * The component for displaying a list element for a community search result on the admin search page
 */
export class CommunityAdminSearchResultListElementComponent extends SearchResultListElementComponent<CommunitySearchResult, Community> {

  /**
   * Returns the path to the edit page of this community
   */
  getEditPath(): string {
    return getCommunityEditPath(this.dso.uuid)
  }
}
