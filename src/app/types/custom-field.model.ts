import { SharedProperty } from './shared-property.interface';

export class CustomField {
  constructor(
    public id: number,
    public groupEnumId: number,
    public position: number,
    public fieldName: string,
    public fieldType: string,
    public fieldReference: string,
    public group?: SharedProperty,
  ) { }
}
