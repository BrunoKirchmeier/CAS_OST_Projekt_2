import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export function CompareValidator(
  comparTo: string
): ValidatorFn {
  return (controlCurrent: AbstractControl): ValidationErrors | null => {

    if(controlCurrent !== null &&
       controlCurrent.parent !== null &&
       controlCurrent.parent.value !== null &&
       controlCurrent.parent.value.hasOwnProperty(comparTo) ){

      const valueComparTo: string = controlCurrent.parent.value[comparTo];
      return controlCurrent.value === valueComparTo
             ? null
             : { matching: true };

    }
    return null;
  }
}
