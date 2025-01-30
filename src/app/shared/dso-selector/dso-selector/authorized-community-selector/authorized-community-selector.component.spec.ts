import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CommunityDataService } from 'src/app/core/data/community-data.service';
import { Community } from 'src/app/core/shared/community.model';

import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';
import { SearchService } from '../../../../core/shared/search/search.service';
import { ThemedLoadingComponent } from '../../../loading/themed-loading.component';
import { NotificationsService } from '../../../notifications/notifications.service';
import { ListableObjectComponentLoaderComponent } from '../../../object-collection/shared/listable-object/listable-object-component-loader.component';
import { createSuccessfulRemoteDataObject$ } from '../../../remote-data.utils';
import { createPaginatedList } from '../../../testing/utils.test';
import { VarDirective } from '../../../utils/var.directive';
import { SelectorActionType } from '../../modal-wrappers/dso-selector-modal-wrapper.component';
import { AuthorizedCommunitySelectorComponent } from './authorized-community-selector.component';

describe('AuthorizedCommunitySelectorComponent', () => {
  let component: AuthorizedCommunitySelectorComponent;
  let fixture: ComponentFixture<AuthorizedCommunitySelectorComponent>;

  let communityService;
  let community;

  let notificationsService: NotificationsService;

  beforeEach(waitForAsync(() => {
    community = Object.assign(new Community(), {
      id: 'authorized-community',
    });
    communityService = jasmine.createSpyObj('communityService', {
      getAdminAuthorizedCommunity: createSuccessfulRemoteDataObject$(createPaginatedList([community])),
      getAddAuthorizedCommunity: createSuccessfulRemoteDataObject$(createPaginatedList([community])),
      getEditAuthorizedCommunity: createSuccessfulRemoteDataObject$(createPaginatedList([community])),
    });
    notificationsService = jasmine.createSpyObj('notificationsService', ['error']);
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), AuthorizedCommunitySelectorComponent, VarDirective],
      providers: [
        { provide: SearchService, useValue: {} },
        { provide: CommunityDataService, useValue: communityService },
        { provide: NotificationsService, useValue: notificationsService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(AuthorizedCommunitySelectorComponent, {
        remove: { imports: [ListableObjectComponentLoaderComponent, ThemedLoadingComponent] },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizedCommunitySelectorComponent);
    component = fixture.componentInstance;
    component.types = [DSpaceObjectType.COMMUNITY];
    fixture.detectChanges();
  });

  describe('search', () => {
    describe('when selected action is not defined', () => {
      it('should call getAdminAuthorizedCommunity and return the authorized community in a SearchResult', (done) => {
        component.search('', 1).subscribe((resultRD) => {
          expect(communityService.getAdminAuthorizedCommunity).toHaveBeenCalled();
          expect(resultRD.payload.page.length).toEqual(1);
          expect(resultRD.payload.page[0].indexableObject).toEqual(community);
          done();
        });
      });
    });
    describe('when selected action is CREATE', () => {
      it('should call getAddAuthorizedCommunity and return the authorized community in a SearchResult', (done) => {
        component.action = SelectorActionType.CREATE;
        fixture.detectChanges();
        component.search('', 1).subscribe((resultRD) => {
          expect(communityService.getAddAuthorizedCommunity).toHaveBeenCalled();
          expect(resultRD.payload.page.length).toEqual(1);
          expect(resultRD.payload.page[0].indexableObject).toEqual(community);
          done();
        });
      });
    });
    describe('when selected action is EDIT', () => {
      it('should call getEditAuthorizedCommunity and return the authorized community in a SearchResult', (done) => {
        component.action = SelectorActionType.EDIT;
        fixture.detectChanges();
        component.search('', 1).subscribe((resultRD) => {
          expect(communityService.getEditAuthorizedCommunity).toHaveBeenCalled();
          expect(resultRD.payload.page.length).toEqual(1);
          expect(resultRD.payload.page[0].indexableObject).toEqual(community);
          done();
        });
      });
    });
  });
});
