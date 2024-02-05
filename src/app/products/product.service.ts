import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from './product.model';
import { Observable, map, delay, take, tap, exhaustMap } from 'rxjs';
import { AuthService } from '../Authentication/auth.service';
import { environment } from 'src/environments/environment';

// Local Service
@Injectable()
export class ProductService {
  private baseURL = environment.databaseURL;
  constructor(private http: HttpClient, private authService: AuthService) {}

  getProducts(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseURL + '/products.json').pipe(
      map((result) => {
        const products: Product[] = [];

        for (const key in result) {
          if (categoryId) {
            if (categoryId == result[key].categoryId) {
              products.push({ ...result[key], id: key });
            }
          } else {
            products.push({ ...result[key], id: key });
          }
        }

        return products;
      }),
      delay(1000)
    );
  }

  getProductById(id: string): Observable<Product> {
    return this.http
      .get<Product>(`${this.baseURL}/products/${id}.json`)
      .pipe(delay(1000));
  }

  createProduct(product: Product): Observable<Product> {
    return this.authService.user.pipe(
      take(1),
      tap((user) => console.log(user)),
      exhaustMap((user) => {
        return this.http.post<Product>(
          this.baseURL + `/products.json?auth=${user?.token}`,
          product
        );
      })
    );
  }
}
