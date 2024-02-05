import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category.service';
import { Category } from '../category.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.css'],
  providers: [CategoryService],
})
export class CategoryCreateComponent implements OnInit {
  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  saveCategory(name: any) {
    const category: Category = {
      name: name.value,
      id: 0,
    };
    this.categoryService.createCategory(category).subscribe((data) => {
      this.router.navigate(['/products']);
    });
  }
}
