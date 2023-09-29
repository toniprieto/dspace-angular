import { DynamicFormControlLayout, serializable } from '@ng-dynamic-forms/core';
import { DsDynamicInputModel, DsDynamicInputModelConfig } from '../ds-dynamic-input.model';

export const DYNAMIC_FORM_CONTROL_TYPE_COORDINATES = 'COORDINATES';

export interface DsDynamicCoordinatesModelConfig extends DsDynamicInputModelConfig {
  value?: any;
}

/**
 * This model represents the data for a coordinates input field
 */
export class DynamicCoordinatesModel extends DsDynamicInputModel {

  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_COORDINATES;
  @serializable() hasSelectableMetadata: boolean;

  constructor(config: DsDynamicCoordinatesModelConfig, layout?: DynamicFormControlLayout) {
    super(config, layout);
    //this.readOnly = true;
    //this.disabled = true;
    //this.hasSelectableMetadata = config.hasSelectableMetadata;

    this.value = config.value;
  }
}
