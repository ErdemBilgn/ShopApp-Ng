import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, exhaustMap, map, take, tap } from 'rxjs';
import { Category } from './category.model';
import { environment } from 'src/environments/environment';
import { AuthService } from '../Authentication/auth.service';

@Injectable()
export class CategoryService {
  private baseURL = environment.databaseURL; //'https://ng-shopapp-f7021-default-rtdb.firebaseio.com';
  constructor(private http: HttpClient, private authService: AuthService) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseURL}/categories.json`).pipe(
      map((data) => {
        const categories: Category[] = [];

        for (const key in data) {
          categories.push({ ...data[key], id: key });
        }
        return categories;
      })
    );
  }

  createCategory(category: Category): Observable<Category> {
    return this.authService.user.pipe(
      take(1),
      tap((user) => console.log(user)),
      exhaustMap((user) => {
        return this.http.post<Category>(
          `${this.baseURL}/categories.json?auth=${user?.token}`,
          category
        );
      })
    );
  }
}
