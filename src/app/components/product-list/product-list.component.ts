import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  isLoading = true;
  showAddForm = false;
  isSubmitting = false;
  editingProductId: number | null = null;
  
  productForm: FormGroup;
  editForm: FormGroup;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      image: ['', Validators.required]
    });

    this.editForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: () => {
        this.showMessage('Error al cargar productos', 'error');
        this.isLoading = false;
      }
    });
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetForm();
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.isSubmitting = true;
      const newProduct = this.productForm.value;
      
      this.productService.createProduct(newProduct).subscribe({
        next: (product) => {
          this.products.unshift(product);
          this.showMessage('Producto creado exitosamente', 'success');
          this.resetForm();
          this.showAddForm = false;
          this.isSubmitting = false;
        },
        error: () => {
          this.showMessage('Error al crear producto', 'error');
          this.isSubmitting = false;
        }
      });
    }
  }

  startEdit(product: Product): void {
    this.editingProductId = product.id!;
    this.editForm.patchValue({
      title: product.title,
      price: product.price
    });
  }

  saveEdit(): void {
    if (this.editForm.valid && this.editingProductId) {
      const updates = this.editForm.value;
      
      this.productService.updateProduct(this.editingProductId, updates).subscribe({
        next: (updatedProduct) => {
          const index = this.products.findIndex(p => p.id === this.editingProductId);
          if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updates };
          }
          this.showMessage('Producto actualizado exitosamente', 'success');
          this.cancelEdit();
        },
        error: () => {
          this.showMessage('Error al actualizar producto', 'error');
        }
      });
    }
  }

  cancelEdit(): void {
    this.editingProductId = null;
    this.editForm.reset();
  }

  deleteProduct(product: Product): void {
    if (confirm(`¿Estás seguro de eliminar "${product.title}"?`)) {
      this.productService.deleteProduct(product.id!).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== product.id);
          this.showMessage('Producto eliminado exitosamente', 'success');
        },
        error: () => {
          this.showMessage('Error al eliminar producto', 'error');
        }
      });
    }
  }

  resetForm(): void {
    this.productForm.reset();
  }

  getCategoryColor(category: string): string {
    const colors: {[key: string]: string} = {
      'electronics': 'primary',
      'jewelery': 'accent',
      "men's clothing": 'warn',
      "women's clothing": ''
    };
    return colors[category] || '';
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.floor(rating) ? 1 : 0);
  }

  trackByProductId(index: number, product: Product): number {
    return product.id!;
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 4000,
      panelClass: [`${type}-snackbar`],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}