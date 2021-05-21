import { AdditionalField } from './additional-field.interface';
import { SharedProperty } from './shared-property.interface';

export class CustomField {
  constructor(
    public id: number,
    public groupEnumId: number,
    public fieldName: string,
    public fieldType: string,
    public position?: number,
    public fieldReference?: string,
    public group?: SharedProperty,
    public additionalField?: AdditionalField,
  ) { }
}
