import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

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

export function CHFValidator(): ValidatorFn {
  return (controlCurrent: AbstractControl): ValidationErrors | null => {
    if(controlCurrent !== null){
      let regex = new RegExp('(^[0-9]+\.[0-9]{1}[5]*|^[0-9]+)$');
      return regex.test(controlCurrent.value) === true
             ? null
             : { isNotValidCHF: true };
    }
    return null;
  }
}

export function IntValidator(): ValidatorFn {
  return (controlCurrent: AbstractControl): ValidationErrors | null => {
    if(controlCurrent !== null){
      let regex = new RegExp('^[0-9]+$');
      return regex.test(controlCurrent.value) === true
             ? null
             : { isDecimal: true };
    }
    return null;
  }
}
