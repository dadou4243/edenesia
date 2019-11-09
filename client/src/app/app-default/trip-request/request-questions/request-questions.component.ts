import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BookingsService } from 'src/app/core/services/bookings.service';
import { Store, select } from '@ngrx/store';
import {
  RequestState,
  SetCurrentIndex,
  getCurrentStepIndex,
  getCurrentActivitiesStepIndex,
  getFormValue,
  SetFormValue,
  getCurrentValidationErrors,
  SetActivitiesCurrentIndex
} from 'src/app/store/request';
import {
  destinations,
  purposeOptions,
  hotelOptions,
  activityOptions
} from '../data';

@Component({
  selector: 'app-request-questions',
  templateUrl: './request-questions.component.html',
  styleUrls: ['./request-questions.component.scss']
})
export class RequestQuestionsComponent implements OnInit {
  datePlanned = true;
  requestForm: FormGroup;
  currentStepIndex: number;
  currentActivitiesStepIndex: number;
  formValue: any;
  destinationOptions = destinations;
  purposeOptions = purposeOptions;
  hotelOptions = hotelOptions;
  activityOptions = activityOptions;
  errors: any[];
  showErrors = false;

  constructor(
    private fb: FormBuilder,
    private bookingsService: BookingsService,
    private store: Store<RequestState>
  ) {
    this.store.pipe(select(getCurrentStepIndex)).subscribe(index => {
      this.currentStepIndex = index;
    });
    this.store.pipe(select(getCurrentActivitiesStepIndex)).subscribe(index => {
      this.currentActivitiesStepIndex = index;
    });
    this.store.pipe(select(getCurrentValidationErrors)).subscribe(err => {
      this.errors = err;
      if (this.errors.length === 0) {
        this.showErrors = false;
      }
    });
    this.store.pipe(select(getFormValue)).subscribe(formValue => {
      console.log('formValue:', formValue);
      this.formValue = formValue;
    });
  }

  ngOnInit() {
    this.requestForm = this.fb.group({
      firstName: ['', [Validators.required]]
    });
  }

  onClickNext() {
    console.log('CLICK NEXT');
    console.log('this.errors', this.errors);
    // Check if step valid
    if (this.errors.length === 0) {
      this.showErrors = false;

      if (
        this.currentStepIndex === 6 &&
        this.currentActivitiesStepIndex < this.formValue.activities.length - 1
      ) {
        this.store.dispatch(
          SetActivitiesCurrentIndex({
            currentActivitiesStepIndex: this.currentActivitiesStepIndex + 1
          })
        );
        return;
      }
      this.store.dispatch(
        SetCurrentIndex({ currentStepIndex: this.currentStepIndex + 1 })
      );
    } else {
      this.showErrors = true;
    }
  }

  onClickPrevious() {
    this.store.dispatch(
      SetCurrentIndex({ currentStepIndex: this.currentStepIndex - 1 })
    );
  }

  onUpdateStepValues(value) {
    console.log('value:', value);

    this.store.dispatch(
      SetFormValue({
        stepValues: value.stepValues,
        validationErrors: value.validationErrors
      })
    );
    // this.onClickNext();
  }

  submitRequest() {
    this.bookingsService.addBooking(this.requestForm.value).subscribe(res => {
      console.log('res', res);
    });
  }
}
