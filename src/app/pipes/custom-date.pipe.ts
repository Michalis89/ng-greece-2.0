import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate',
  standalone: true,
})
export class CustomDatePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(timestamp: number | string): string {
    if (typeof timestamp === 'string') {
      timestamp = parseInt(timestamp, 10);
    }
    return this.datePipe.transform(timestamp * 1000, 'dd-MM-yyyy') ?? '';
  }
}
