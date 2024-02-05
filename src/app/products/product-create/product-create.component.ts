import { Component, OnInit } from '@angular/core';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../categories/category.service';
import { Category } from '../../categories/category.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css'],
  providers: [CategoryService],
})
export class ProductCreateComponent implements OnInit {
  categories: Category[] = [];
  error: string = '';
  model: any = {};

  constructor(
    private productService: ProductService,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  saveProduct(form: NgForm) {
    //   name: any,
    //   price: any,
    //   imageUrl: any,
    //   description: any,
    //   isActive: any,
    //   categoryId: any

    const extensions = ['jpeg', 'png', 'jpg'];
    const extension = this.model.imageURL.split('.').pop();

    if (extensions.indexOf(extension) === -1) {
      this.error = 'Resim uzantısı sadece jpeg, jpg ve png olmalıdır';
      return;
    }

    if (!this.model.categoryId || this.model.categoryId == 0) {
      this.error = 'Kategori seçmelisiniz';
      return;
    }

    if (form.valid) {
      const product: Product = {
        id: 6,
        name: this.model.name,
        price: this.model.price,
        imageURL: this.model.imageURL,
        description: this.model.description,
        isActive: this.model.isActive,
        categoryId: this.model.categoryId,
      };

      this.productService.createProduct(product).subscribe((data) => {
        this.router.navigate(['/products']);
      });
    } else {
      this.error = 'Formu kontrol ediniz';
    }

    console.log(this.model);
  }
}
