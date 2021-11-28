import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'ibanFormatter'})
export class IbanFormatterPipe implements PipeTransform {
  transform(value: string): string {
    value = value.replace(/ /g, '');
    let valueFormatted: string = '';
    let lastSlicePos: number = 0;
    const slicePos: number[] = [4, 8, 12, 16, 20, 21];
    slicePos.forEach(pos => {
      let currentString = value.slice(lastSlicePos, pos);
      lastSlicePos = pos;
      valueFormatted += currentString !== ''
                     ? currentString + ' '
                     : '';
    });
    return valueFormatted.trim();
  }
  rawValue(value: string): string {
    value = value.replace(/ /g, '');
    return value;
  }
}
