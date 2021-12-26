import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';
import { CustomField } from 'src/app/shared/types/custom-field.model';

@Pipe({
  name: 'customField',
  pure: true // meaning that transform method will invoked only the value was changes
})
export class CustomFieldPipe implements PipeTransform {

  transform(value: CustomField, ...args: any[]): string {
    if (!value.value) {
      return '';
    }

    if (value.fieldType === 'date') {
      const dt = DateTime.fromISO(value.value.value);
      return dt.toFormat('dd-MMM-yyyy');
    }

    return value.value.value;
  }

}
