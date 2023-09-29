import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { DynamicFormControlComponent, DynamicFormLayoutService, DynamicFormValidationService } from '@ng-dynamic-forms/core';

import { DynamicCoordinatesModel } from './dynamic-coordinates.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LocationPickerComponent } from '../../../../../location-picker/location-picker.component';

/**
 * Component representing a simple disabled input field
 */
@Component({
  selector: 'ds-dynamic-coordinates',
  templateUrl: './dynamic-coordinates.component.html'
})
/**
 * Component for displaying a form input with a coordinates field
 */
export class DsDynamicCoordinatesComponent extends DynamicFormControlComponent {

  @Input() formId: string;
  @Input() group: FormGroup;
  @Input() model: DynamicCoordinatesModel;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  private page;

  constructor(protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService,
              protected modalService: NgbModal,
  ) {
    super(layoutService, validationService);
  }

  /**
   * Open modal to show the location picker
   * @param event The click event fired
   */
  openLocationPicker(event) {
    const modalRef: NgbModalRef = this.modalService.open(LocationPickerComponent, { size: 'lg', windowClass: 'locationpicker' });
    modalRef.componentInstance.inputValue = this.model.value;
    modalRef.result.then((result: string) => {
      if (result) {
        this.model.value = result;
        this.change.emit();
      }
    }, () => {
      return;
    });
  }

  onChange($event: Event) {
    super.onChange($event);
    this.change.emit();
  }

}
