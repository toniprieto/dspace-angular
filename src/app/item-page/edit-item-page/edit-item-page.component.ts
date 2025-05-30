import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnInit,
  runInInjectionContext,
} from '@angular/core';
import {
  ActivatedRoute,
  CanActivateFn,
  Route,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  combineLatest as observableCombineLatest,
  Observable,
  of,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { RemoteData } from '../../core/data/remote-data';
import { Item } from '../../core/shared/item.model';
import {
  fadeIn,
  fadeInOut,
} from '../../shared/animations/fade';
import { isNotEmpty } from '../../shared/empty.util';
import { getItemPageRoute } from '../item-page-routing-paths';

@Component({
  selector: 'ds-edit-item-page',
  templateUrl: './edit-item-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeIn,
    fadeInOut,
  ],
  imports: [
    AsyncPipe,
    NgbTooltipModule,
    NgClass,
    RouterLink,
    RouterOutlet,
    TranslateModule,
  ],
  standalone: true,
})
/**
 * Page component for editing an item
 */
export class EditItemPageComponent implements OnInit {

  /**
   * The item to edit
   */
  itemRD$: Observable<RemoteData<Item>>;

  /**
   * The current page outlet string
   */
  currentPage: string;

  /**
   * All possible page outlet strings
   */
  pages: { page: string, enabled: Observable<boolean> }[];

  constructor(private route: ActivatedRoute, private router: Router, private injector: Injector) {
    this.router.events.subscribe(() => this.initPageParamsByRoute());
  }

  ngOnInit(): void {
    this.initPageParamsByRoute();
    this.pages = this.route.routeConfig.children
      .filter((child: Route) => isNotEmpty(child.path))
      .map((child: Route) => {
        let enabled = of(true);
        if (isNotEmpty(child.canActivate)) {
          enabled = observableCombineLatest(child.canActivate.map((guardFn: CanActivateFn) => {
            return runInInjectionContext(this.injector, () => {
              return guardFn(this.route.snapshot, this.router.routerState.snapshot);
            });
          }),
          ).pipe(
            map((canActivateOutcomes: any[]) => canActivateOutcomes.every((e) => e === true)),
          );
        }
        return { page: child.path, enabled: enabled };
      }); // ignore reroutes
    this.itemRD$ = this.route.data.pipe(map((data) => data.dso));
  }

  /**
   * Get the item page url
   * @param item The item for which the url is requested
   */
  getItemPage(item: Item): string {
    return getItemPageRoute(item);
  }

  /**
   * Set page params depending on the route
   */
  initPageParamsByRoute() {
    this.currentPage = this.route.snapshot.firstChild.routeConfig.path;
  }
}
