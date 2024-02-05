import { NgModule } from '@angular/core';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryCreateComponent } from './category-create/category-create.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminGuard } from '../Authentication/admin.guard';
import { AuthenticationModule } from '../Authentication/authentication.module';

@NgModule({
  declarations: [CategoryListComponent, CategoryCreateComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AuthenticationModule,
    RouterModule.forChild([
      {
        path: 'categories/create',
        component: CategoryCreateComponent,
        canActivate: [AdminGuard],
      },
    ]),
  ],
  exports: [CategoryListComponent, CategoryCreateComponent],
})
export class CategoriesModule {}
