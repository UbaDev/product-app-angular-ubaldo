import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  isLoading = true;
  showAddForm = false;
  isSubmitting = false;
  editingProduct: Product | null = null;
  
  displayedColumns: string[] = ['image', 'title', 'price', 'category', 'actions'];
  
  productForm: FormGroup;

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
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  /**
   * Carga todos los productos desde la API
   */
  loadProducts(): void {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
        this.showSuccess('Productos cargados correctamente');
      },
      error: () => {
        this.showError('Error al cargar productos');
        this.isLoading = false;
      }
    });
  }

  /**
   * Muestra/oculta el formulario de agregar
   */
  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    this.editingProduct = null;
    if (this.showAddForm) {
      this.productForm.reset();
    }
  }

  /**
   * Procesa el envío del formulario
   */
  onSubmit(): void {
    if (this.productForm.valid) {
      this.isSubmitting = true;
      const formData = this.productForm.value;

      if (this.editingProduct) {
        // Actualizar producto existente
        this.productService.updateProduct(this.editingProduct.id!, formData).subscribe({
          next: (updatedProduct) => {
            const index = this.products.findIndex(p => p.id === this.editingProduct!.id);
            if (index !== -1) {
              this.products[index] = { ...this.products[index], ...formData };
            }
            this.showSuccess('Producto actualizado correctamente');
            this.cancelForm();
            this.isSubmitting = false;
          },
          error: () => {
            this.showError('Error al actualizar el producto');
            this.isSubmitting = false;
          }
        });
      } else {
        // Crear nuevo producto
        this.productService.createProduct(formData).subscribe({
          next: (newProduct) => {
            // Agregar al inicio de la lista para visualización inmediata
            this.products = [newProduct, ...this.products];
            this.showSuccess('Producto creado correctamente');
            this.cancelForm();
            this.isSubmitting = false;
          },
          error: () => {
            this.showError('Error al crear el producto');
            this.isSubmitting = false;
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * Inicia la edición de un producto
   */
  editProduct(product: Product): void {
    this.editingProduct = product;
    this.showAddForm = true;
    
    // Prellenar el formulario con los datos del producto
    this.productForm.patchValue({
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image
    });
  }

  /**
   * Elimina un producto con confirmación
   */
  deleteProduct(product: Product): void {
    const confirmDelete = confirm(
      `¿Está seguro que desea eliminar el producto "${product.title}"?\n\nEsta acción no se puede deshacer.`
    );

    if (confirmDelete) {
      this.productService.deleteProduct(product.id!).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== product.id);
          this.showSuccess('Producto eliminado correctamente');
        },
        error: () => {
          this.showError('Error al eliminar el producto');
        }
      });
    }
  }

  /**
   * Cancela la edición/creación
   */
  cancelForm(): void {
    this.showAddForm = false;
    this.editingProduct = null;
    this.productForm.reset();
  }

  /**
   * Maneja errores de carga de imagen
   */
  onImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/60x60?text=Sin+Imagen';
  }

  /**
   * Marca todos los campos como tocados para mostrar errores
   */
  private markFormGroupTouched(): void {
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Muestra mensaje de éxito
   */
  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  /**
   * Muestra mensaje de error
   */
  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}