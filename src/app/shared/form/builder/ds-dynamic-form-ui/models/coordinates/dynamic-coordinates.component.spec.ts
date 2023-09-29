import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { DynamicFormLayoutService, DynamicFormValidationService } from '@ng-dynamic-forms/core';

import { DsDynamicCoordinatesComponent } from './dynamic-coordinates.component';
import { DynamicCoordinatesModel } from './dynamic-coordinates.model';
import {
  mockDynamicFormLayoutService,
  mockDynamicFormValidationService
} from '../../../../../testing/dynamic-form-mock-services';

describe('DsDynamicCoordinatesComponent', () => {
  let comp: DsDynamicCoordinatesComponent;
  let fixture: ComponentFixture<DsDynamicCoordinatesComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let model;
  let group;

  function init() {
    model = new DynamicCoordinatesModel({
      value: 'test',
      repeatable: false,
      metadataFields: [],
      submissionId: '1234',
      id: 'coordinatesInput',
      name: 'coordinatesInput',
      hasSelectableMetadata: false
    });
    group = new FormGroup({
      coordinatesInput: new FormControl(),
    });
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      declarations: [DsDynamicCoordinatesComponent],
      imports: [FormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: DynamicFormLayoutService, useValue: mockDynamicFormLayoutService },
        { provide: DynamicFormValidationService, useValue: mockDynamicFormValidationService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsDynamicCoordinatesComponent);
    comp = fixture.componentInstance; // DsDynamicCoordinatesComponent test instance
    de = fixture.debugElement;
    el = de.nativeElement;
    comp.model = model;
    comp.group = group;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });
});
