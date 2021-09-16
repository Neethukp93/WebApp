import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PersonRoutingModule } from './person-routing.module';
import { PersonComponent } from './person.component';

@NgModule({
  declarations: [PersonComponent],
  imports: [SharedModule, PersonRoutingModule],
  exports: [PersonComponent],
})
export class PersonModule {}
