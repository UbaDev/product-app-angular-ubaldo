import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatIconModule, MatButtonModule, CommonModule],
  template: `
    <!-- Navbar corregido -->
    <nav class="main-navbar">
      <div class="navbar-content">
        <div class="brand-section">
          <div class="brand-icon-container">
            <mat-icon class="brand-icon">inventory_2</mat-icon>
          </div>
          <div class="brand-text">
            <h1>Gestión de Productos</h1>
            <span>Panel Administrativo</span>
          </div>
        </div>
        
        <div class="nav-actions">
          <button mat-mini-fab class="profile-btn">
            <mat-icon>person</mat-icon>
          </button>
        </div>
      </div>
    </nav>

    <!-- Contenido principal -->
    <main class="main-container">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    /* Navbar con fondo sólido */
    .main-navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      padding: 12px 24px;
      border-bottom: 3px solid #667eea;
    }

    .navbar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1400px;
      margin: 0 auto;
    }

    .brand-section {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .brand-icon-container {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    .brand-icon {
      color: white;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .brand-text h1 {
      font-size: 24px;
      font-weight: 700;
      color: white;
      margin: 0;
      letter-spacing: -0.5px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .brand-text span {
      font-size: 12px;
      color: #a0aec0;
      font-weight: 400;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .nav-button {
      width: 44px;
      height: 44px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      color: white;
      transition: all 0.3s ease;
    }

    .nav-button:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(255, 255, 255, 0.2);
    }

    .profile-btn {
      background: linear-gradient(135d, #667eea 0%, #764ba2 100%);
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
      color: white;
    }

    .main-container {
      padding-top: 90px;
      min-height: 100vh;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .main-navbar {
        padding: 8px 16px;
      }
      
      .brand-text h1 {
        font-size: 18px;
      }
      
      .brand-text span {
        font-size: 10px;
      }
      
      .brand-icon-container {
        width: 40px;
        height: 40px;
      }
      
      .main-container {
        padding-top: 70px;
      }
    }
  `]
})
export class AppComponent {}