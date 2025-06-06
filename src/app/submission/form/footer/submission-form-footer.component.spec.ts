import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  SimpleChange,
} from '@angular/core';
import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  NgbModal,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  cold,
  getTestScheduler,
  hot,
} from 'jasmine-marbles';
import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { SubmissionRestService } from '../../../core/submission/submission-rest.service';
import { BtnDisabledDirective } from '../../../shared/btn-disabled.directive';
import { mockSubmissionId } from '../../../shared/mocks/submission.mock';
import { SubmissionRestServiceStub } from '../../../shared/testing/submission-rest-service.stub';
import { SubmissionServiceStub } from '../../../shared/testing/submission-service.stub';
import { createTestComponent } from '../../../shared/testing/utils.test';
import { SubmissionService } from '../../submission.service';
import { SubmissionFormFooterComponent } from './submission-form-footer.component';

const submissionServiceStub: SubmissionServiceStub = new SubmissionServiceStub();

const submissionId = mockSubmissionId;

describe('SubmissionFormFooterComponent', () => {

  let comp: SubmissionFormFooterComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<SubmissionFormFooterComponent>;
  let submissionRestServiceStub: SubmissionRestServiceStub;
  let scheduler: TestScheduler;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule,
        TranslateModule.forRoot(),
        SubmissionFormFooterComponent,
        TestComponent,
        BtnDisabledDirective,
      ],
      providers: [
        { provide: SubmissionService, useValue: submissionServiceStub },
        { provide: SubmissionRestService, useClass: SubmissionRestServiceStub },
        ChangeDetectorRef,
        NgbModal,
        SubmissionFormFooterComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  describe('', () => {
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {
      submissionServiceStub.getSubmissionStatus.and.returnValue(of(true));
      const html = `
        <ds-submission-form-footer [submissionId]="submissionId"></ds-submission-form-footer>`;

      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
      testFixture.detectChanges();
    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create SubmissionFormFooterComponent', inject([SubmissionFormFooterComponent], (app: SubmissionFormFooterComponent) => {

      expect(app).toBeDefined();

    }));
  });

  describe('', () => {
    beforeEach(() => {
      scheduler = getTestScheduler();
      fixture = TestBed.createComponent(SubmissionFormFooterComponent);
      comp = fixture.componentInstance;
      compAsAny = comp;
      submissionRestServiceStub = TestBed.inject(SubmissionRestService as any);
      comp.submissionId = submissionId;

    });

    afterEach(() => {
      comp = null;
      compAsAny = null;
      fixture = null;
    });

    describe('ngOnChanges', () => {
      beforeEach(() => {
        submissionServiceStub.getSubmissionStatus.and.returnValue(hot('-a-b', {
          a: false,
          b: true,
        }));

        submissionServiceStub.getSubmissionSaveProcessingStatus.and.returnValue(hot('-a-b', {
          a: false,
          b: true,
        }));

        submissionServiceStub.getSubmissionDepositProcessingStatus.and.returnValue(hot('-a-b', {
          a: false,
          b: true,
        }));
      });

      it('should set submissionIsInvalid properly', () => {

        const expected = cold('-c-d', {
          c: true,
          d: false,
        });

        comp.ngOnChanges({
          submissionId: new SimpleChange(null, submissionId, true),
        });

        fixture.detectChanges();

        expect(compAsAny.submissionIsInvalid).toBeObservable(expected);
      });

      it('should set processingSaveStatus properly', () => {

        const expected = cold('-c-d', {
          c: false,
          d: true,
        });

        comp.ngOnChanges({
          submissionId: new SimpleChange(null, submissionId, true),
        });

        fixture.detectChanges();

        expect(comp.processingSaveStatus).toBeObservable(expected);
      });

      it('should set processingDepositStatus properly', () => {

        const expected = cold('-c-d', {
          c: false,
          d: true,
        });

        comp.ngOnChanges({
          submissionId: new SimpleChange(null, submissionId, true),
        });

        fixture.detectChanges();

        expect(comp.processingDepositStatus).toBeObservable(expected);
      });
    });

    it('should call dispatchSave on save', () => {

      comp.save(null);
      fixture.detectChanges();

      expect(submissionServiceStub.dispatchSave).toHaveBeenCalledWith(submissionId, true);
    });

    it('should call dispatchSaveForLater on save for later', () => {

      comp.saveLater(null);
      fixture.detectChanges();

      expect(submissionServiceStub.dispatchSaveForLater).toHaveBeenCalledWith(submissionId);
    });

    it('should call dispatchDeposit on save', () => {

      comp.deposit(null);
      fixture.detectChanges();

      expect(submissionServiceStub.dispatchDeposit).toHaveBeenCalledWith(submissionId);
    });

    describe('on discard confirmation', () => {
      beforeEach((done) => {
        comp.showDepositAndDiscard = of(true);
        fixture.detectChanges();
        const modalBtn = fixture.debugElement.query(By.css('.btn-danger'));

        modalBtn.nativeElement.click();
        fixture.detectChanges();

        const confirmBtn: any = ((document as any).querySelector('.btn-danger:nth-child(2)'));

        confirmBtn.click();

        fixture.detectChanges();
        fixture.whenStable().then(() => {
          done();
        });
      });

      it('should call dispatchDiscard', () => {
        expect(submissionServiceStub.dispatchDiscard).toHaveBeenCalledWith(submissionId);
      });
    });

    it('should not have deposit button disabled when submission is not valid', () => {
      comp.showDepositAndDiscard = of(true);
      compAsAny.submissionIsInvalid = of(true);
      fixture.detectChanges();
      const depositBtn: any = fixture.debugElement.query(By.css('.btn-success'));

      expect(depositBtn.nativeElement.getAttribute('aria-disabled')).toBe('false');
      expect(depositBtn.nativeElement.classList.contains('disabled')).toBeFalse();
    });

    it('should not have deposit button disabled when submission is valid', () => {
      comp.showDepositAndDiscard = of(true);
      compAsAny.submissionIsInvalid = of(false);
      fixture.detectChanges();
      const depositBtn: any = fixture.debugElement.query(By.css('.btn-success'));

      expect(depositBtn.nativeElement.getAttribute('aria-disabled')).toBe('false');
      expect(depositBtn.nativeElement.classList.contains('disabled')).toBeFalse();
    });

    it('should disable save button when all modifications had been saved', () => {
      comp.hasUnsavedModification = of(false);
      fixture.detectChanges();

      const saveBtn: any = fixture.debugElement.query(By.css('#save'));
      expect(saveBtn.nativeElement.getAttribute('aria-disabled')).toBe('true');
      expect(saveBtn.nativeElement.classList.contains('disabled')).toBeTrue();
    });

    it('should enable save button when there are not saved modifications', () => {
      comp.hasUnsavedModification = of(true);
      fixture.detectChanges();

      const saveBtn: any = fixture.debugElement.query(By.css('#save'));
      expect(saveBtn.nativeElement.getAttribute('aria-disabled')).toBe('false');
      expect(saveBtn.nativeElement.classList.contains('disabled')).toBeFalse();
    });

  });
});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``,
  standalone: true,
  imports: [
    NgbModule,
  ],
})
class TestComponent {

  submissionId = mockSubmissionId;

}
