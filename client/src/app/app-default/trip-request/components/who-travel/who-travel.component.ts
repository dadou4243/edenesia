import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'app-who-travel',
  templateUrl: './who-travel.component.html',
  styleUrls: ['./who-travel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WhoTravelComponent implements OnInit {
  @Input() showConfirm;
  @Input() numberPeople: number;
  @Output() pickedNumberPeople = new EventEmitter();

  options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  stepValidationObject: any;

  constructor() {}

  ngOnInit() {
    this.stepValidationObject = {
      numberPeople: {
        message: 'You must select at least one choice',
        isValid: this.numberPeople === -1
      }
    };

    this.pickedNumberPeople.emit({
      validationErrors: this.stepValidationObject
    });
  }

  onNumberPeopleChange(numberPeopleFromEvent) {
    console.log('numberPeopleFromEvent:', numberPeopleFromEvent);
    this.stepValidationObject.numberPeople.isValid =
      numberPeopleFromEvent > 0 ? true : false;

    this.pickedNumberPeople.emit({
      stepValues: {
        numberPeople: numberPeopleFromEvent
      },
      validationErrors: this.stepValidationObject
    });
  }
}
