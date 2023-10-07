import { AbstractControl, FormGroup } from '@angular/forms';

export const markFormGroupTouched = (formGroup: FormGroup) => {
  (Object as any).values(formGroup.controls).forEach((control: any) => {
    control.markAsTouched();

    if (control.controls) {
      markFormGroupTouched(control);
    }
  });
};
