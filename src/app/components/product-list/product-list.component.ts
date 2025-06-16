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
        this.showSuccess(`📦 ${products.length} productos cargados desde FakeStore API`);
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
   * Procesa el envío del formulario con manejo correcto de memoria
   */
  onSubmit(): void {
    if (this.productForm.valid) {
      this.isSubmitting = true;
      const formData = this.productForm.value;

      if (this.editingProduct) {
        // EDITAR PRODUCTO EXISTENTE
        const isLocalProduct = this.editingProduct.id! > 1000;
        
        if (isLocalProduct) {
          // Producto local - editar directamente en memoria
          console.log('✏️ Editando producto LOCAL en memoria:', this.editingProduct.id);
          
          const index = this.products.findIndex(p => p.id === this.editingProduct!.id);
          if (index !== -1) {
            this.products[index] = { 
              ...this.products[index], 
              ...formData 
            };
            console.log('💾 Producto local actualizado:', this.products[index]);
          }
          
          this.showSuccess('✅ Producto local actualizado en memoria');
          this.cancelForm();
          this.isSubmitting = false;
          
        } else {
          // Producto de API - simular actualización
          console.log('🌐 Simulando edición de producto API:', this.editingProduct.id);
          
          this.productService.updateProduct(this.editingProduct.id!, formData).subscribe({
            next: (response) => {
              console.log('📥 API simuló actualización:', response);
              
              // Actualizar visualmente en la lista local
              const index = this.products.findIndex(p => p.id === this.editingProduct!.id);
              if (index !== -1) {
                this.products[index] = { 
                  ...this.products[index], 
                  ...formData 
                };
                console.log('💾 Producto API actualizado localmente:', this.products[index]);
              }
              
              this.showSuccess('✅ Producto API actualizado (simulado + local)');
              this.cancelForm();
              this.isSubmitting = false;
            },
            error: () => {
              this.showError('❌ Error al actualizar el producto');
              this.isSubmitting = false;
            }
          });
        }
        
      } else {
        // CREAR NUEVO PRODUCTO
        console.log('🆕 Creando nuevo producto...');
        
        this.productService.createProduct(formData).subscribe({
          next: (response) => {
            console.log('📥 API simuló creación:', response);
            
            const newProductLocal = {
              ...formData,
              id: Date.now(), // ID único para esta sesión
              rating: { rate: 0, count: 0 }
            };
            
            console.log('💾 Guardando producto nuevo en memoria:', newProductLocal);
            this.products = [newProductLocal, ...this.products];
            
            this.showSuccess('✅ Producto creado y guardado en memoria');
            this.cancelForm();
            this.isSubmitting = false;
          },
          error: () => {
            this.showError('❌ Error al crear el producto');
            this.isSubmitting = false;
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * Inicia la edición con feedback mejorado - FUNCIÓN CORREGIDA
   */
  editProduct(product: Product): void {
    const isLocalProduct = product.id! > 1000;
    const productType = isLocalProduct ? 'local (en memoria)' : 'API (simulado)';
    
    console.log(`✏️ Iniciando edición de producto ${productType}:`, product);
    
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
    
    // Mostrar información sobre el tipo de edición
    if (isLocalProduct) {
      this.showSuccess(`📝 Editando producto local - cambios se guardan directamente en memoria`);
    } else {
      this.showSuccess(`📝 Editando producto API - cambios son simulados pero se ven localmente`);
    }
  }

  /**
   * Elimina productos con manejo correcto de memoria
   */
  deleteProduct(product: Product): void {
    const isLocalProduct = product.id! > 1000;
    const productType = isLocalProduct ? 'LOCAL (en memoria)' : 'API (simulado)';
    
    const confirmDelete = confirm(
      `🗑️ ¿Eliminar "${product.title}"?\n\n📍 Tipo: ${productType}\n⚠️ Esta acción no se puede deshacer en esta sesión.`
    );

    if (confirmDelete) {
      if (isLocalProduct) {
        // Producto local - eliminar directamente de memoria
        console.log('🗑️ Eliminando producto LOCAL de memoria:', product.id);
        this.products = this.products.filter(p => p.id !== product.id);
        this.showSuccess(`✅ Producto local "${product.title}" eliminado de memoria`);
        
      } else {
        // Producto de API - simular eliminación
        console.log('🌐 Simulando eliminación de producto API:', product.id);
        
        this.productService.deleteProduct(product.id!).subscribe({
          next: () => {
            console.log('📥 API simuló eliminación');
            this.products = this.products.filter(p => p.id !== product.id);
            this.showSuccess(`✅ Producto API "${product.title}" eliminado (simulado + local)`);
          },
          error: () => {
            this.showError('❌ Error al eliminar el producto');
          }
        });
      }
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