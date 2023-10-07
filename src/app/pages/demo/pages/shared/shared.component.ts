import { NotificationService } from './../../../../services/notification/notification.service';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ControlItem } from 'app/models/frontend';
import { markFormGroupTouched, regex, regexErrors } from 'app/shared';

@Component({
  selector: 'app-shared',
  templateUrl: './shared.component.html',
  styleUrls: ['./shared.component.scss'],
})
export class SharedComponent implements OnInit {
  form!: FormGroup;
  isInline!: boolean;
  regexErrors = regexErrors;
  items!: ControlItem[];
  showSpinner = false;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.isInline = true;

    this.items = [
      { label: 'First', value: 1 },
      { label: 'Second', value: 2 },
      { label: 'Third', value: 3 },
      { label: 'Fourth', value: 4 },
      { label: 'Fifth', value: 5 },
    ];
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      input: [
        null,
        {
          updateOn: 'blur',
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern(regex.email),
          ],
        },
      ],
      password: [null, { updateOn: 'blur', validators: [Validators.required] }],
      autocomplete: [
        null,
        {
          updateOn: 'change',
          validators: Validators.required,
        },
      ],
      select: [null, { updateOn: 'change', validators: Validators.required }],
      checkboxes: [
        null,
        {
          updateOn: 'change',
          validators: Validators.required,
        },
      ],
      radios: [
        null,
        {
          updateOn: 'change',
          validators: Validators.required,
        },
      ],
      date: [
        null,
        {
          updateOn: 'change',
          validators: Validators.required,
        },
      ],
      dateRange: [
        null,
        {
          updateOn: 'change',
          validators: Validators.required,
        },
      ],
    });
  }

  onPatchValue(): void {
    this.form.patchValue({
      input: 'test',
      password: 123456,
      autocomplete: 1,
      select: 2,
      checkboxes: [3],
      radios: 4,
      date: new Date().getTime(),
      dateRange: {
        from: new Date(2019, 5, 10).getTime(),
        to: new Date(2023, 10, 7).getTime(),
      },
    });
  }

  onSubmit(): void {
    console.log('Submit');

    if (!this.form.valid) {
      markFormGroupTouched(this.form);
    }
  }

  onToggleInline() {
    this.isInline = !this.isInline;
  }

  onToggleDisable() {
    this.form.enabled ? this.form.disable() : this.form.enable();
  }

  onToggleSpinner(): void {
    this.showSpinner = !this.showSpinner;
  }

  onError(): void {
    this.notificationService.error('Everything is wrong!');
  }

  onSuccess(): void {
    this.notificationService.success('Everything is fine!');
  }
}
