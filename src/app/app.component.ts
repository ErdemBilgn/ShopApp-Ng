import { Component, OnInit } from '@angular/core';
import { Product } from './products/product.model';
import { HttpClient } from '@angular/common/http';
import { ProductService } from './products/product.service';
import { AuthService } from './Authentication/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ProductService],
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.autoLogin();
  }
}
