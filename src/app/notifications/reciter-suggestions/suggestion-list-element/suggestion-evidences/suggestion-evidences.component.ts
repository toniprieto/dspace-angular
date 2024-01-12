import { Component, Input } from '@angular/core';
import { fadeIn } from '../../../../shared/animations/fade';
import { SuggestionEvidences } from '../../../../core/notifications/reciter-suggestions/models/suggestion.model';

@Component({
  selector: 'ds-suggestion-evidences',
  styleUrls: [ './suggestion-evidences.component.scss' ],
  templateUrl: './suggestion-evidences.component.html',
  animations: [fadeIn]
})
export class SuggestionEvidencesComponent {

  @Input() evidences: SuggestionEvidences;

}
