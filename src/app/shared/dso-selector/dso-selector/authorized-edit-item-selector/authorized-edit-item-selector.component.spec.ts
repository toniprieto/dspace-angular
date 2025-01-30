import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ItemDataService } from 'src/app/core/data/item-data.service';
import { Item } from 'src/app/core/shared/item.model';

import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';
import { SearchService } from '../../../../core/shared/search/search.service';
import { ThemedLoadingComponent } from '../../../loading/themed-loading.component';
import { NotificationsService } from '../../../notifications/notifications.service';
import { ListableObjectComponentLoaderComponent } from '../../../object-collection/shared/listable-object/listable-object-component-loader.component';
import { createSuccessfulRemoteDataObject$ } from '../../../remote-data.utils';
import { createPaginatedList } from '../../../testing/utils.test';
import { VarDirective } from '../../../utils/var.directive';
import { AuthorizedEditItemSelectorComponent } from './authorized-edit-item-selector.component';

describe('AuthorizedEditItemSelectorComponent', () => {
  let component: AuthorizedEditItemSelectorComponent;
  let fixture: ComponentFixture<AuthorizedEditItemSelectorComponent>;

  let itemService;
  let item;

  let notificationsService: NotificationsService;

  beforeEach(waitForAsync(() => {
    item = Object.assign(new Item(), {
      id: 'authorized-item',
    });
    itemService = jasmine.createSpyObj('itemService', {
      findEditAuthorized: createSuccessfulRemoteDataObject$(createPaginatedList([item])),
    });
    notificationsService = jasmine.createSpyObj('notificationsService', ['error']);
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), AuthorizedEditItemSelectorComponent, VarDirective],
      providers: [
        { provide: SearchService, useValue: {} },
        { provide: ItemDataService, useValue: itemService },
        { provide: NotificationsService, useValue: notificationsService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(AuthorizedEditItemSelectorComponent, {
        remove: { imports: [ListableObjectComponentLoaderComponent, ThemedLoadingComponent] },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizedEditItemSelectorComponent);
    component = fixture.componentInstance;
    component.types = [DSpaceObjectType.ITEM];
    fixture.detectChanges();
  });

  describe('search', () => {
    it('should call findEditAuthorized and return the authorized item in a SearchResult', (done) => {
      component.search('', 1).subscribe((resultRD) => {
        expect(itemService.findEditAuthorized).toHaveBeenCalled();
        expect(resultRD.payload.page.length).toEqual(1);
        expect(resultRD.payload.page[0].indexableObject).toEqual(item);
        done();
      });
    });
  });
});
