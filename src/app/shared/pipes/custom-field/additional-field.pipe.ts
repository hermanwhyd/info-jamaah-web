import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';
import { AdditionalField } from '../../types/additional-field.interface';

@Pipe({
  name: 'additionalField',
  pure: true // meaning that transform method will invoked only the value was changes
})
export class AdditionalFieldPipe implements PipeTransform {

  transform(af: AdditionalField, ...args: any[]): string {
    if (!af.value) {
      return '';
    }

    if (af.customField.fieldType === 'date') {
      const dt = DateTime.fromISO(af.value);
      return dt.toFormat('dd-MMM-yyyy');
    }

    return af.value;
  }

}
