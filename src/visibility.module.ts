import { NgModule } from '@angular/core';
import { VisibilityService } from './visibility.service';

@NgModule({
  providers: [VisibilityService],
  exports: [VisibilityService]
})
export class VisibilityModule {}