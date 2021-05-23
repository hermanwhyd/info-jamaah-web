import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customfield'
})
export class CustomfieldPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
