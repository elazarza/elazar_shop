import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule, MatTooltipModule, MatSortModule } from '@angular/material';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatGridListModule} from '@angular/material/grid-list';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';




export const MATERIAL_IMPORTS = [
  CdkTableModule,
  MatTableModule,
  MatToolbarModule,
  MatIconModule,
  MatInputModule,
  MatSidenavModule,
  MatFormFieldModule,
  MatMenuModule,
  MatCardModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSelectModule,
  MatListModule,
  MatRadioModule,
  MatTabsModule,
  MatCheckboxModule,
  MatStepperModule,
  MatExpansionModule,
  MatButtonModule,
  MatDialogModule,
  MatPaginatorModule,
  MatTooltipModule,
  MatSortModule,
  MatProgressBarModule,
  MatGridListModule,
  DragDropModule,
  ScrollingModule
];

@NgModule({
  imports: [...MATERIAL_IMPORTS],
  exports: [...MATERIAL_IMPORTS],
  declarations: []
})
export class MaterialModule { }
