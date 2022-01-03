import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'chfFormatter'})
export class ChfFormatterPipe implements PipeTransform {
  transform(value: number): string {
    let valueFormatted: string = value.toFixed(2);
    return valueFormatted;
  }
  rawValue(value: string): number {
    let rawValue: number = parseFloat(value ?? 0);
    rawValue = Math.ceil(rawValue*20)/20
    return rawValue;
  }
}
