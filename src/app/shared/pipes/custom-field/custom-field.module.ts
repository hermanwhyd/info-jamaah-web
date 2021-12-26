import { NgModule } from '@angular/core';
import { AdditionalFieldPipe } from './additional-field.pipe';
import { CustomFieldPipe } from './custom-field.pipe';

@NgModule({
  declarations: [AdditionalFieldPipe, CustomFieldPipe],
  exports: [AdditionalFieldPipe, CustomFieldPipe]
})
export class CustomFieldModule { }
