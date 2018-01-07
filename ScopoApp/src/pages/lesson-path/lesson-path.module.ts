import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LessonPathPage } from './lesson-path';

@NgModule({
  declarations: [
    LessonPathPage,
  ],
  imports: [
    IonicPageModule.forChild(LessonPathPage),
  ],
})
export class LessonPathPageModule {}
