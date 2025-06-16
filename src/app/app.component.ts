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
    <!-- Partículas de fondo -->
    <div class="background-particles">
      <div *ngFor="let particle of particles" 
           class="particle" 
           [style.left.%]="particle.x" 
           [style.top.%]="particle.y"
           [style.animation-delay.s]="particle.delay">
      </div>
    </div>

    <!-- Navbar futurista -->
    <nav class="futuristic-navbar">
      <div class="navbar-content">
        <div class="brand-section">
          <div class="brand-icon-container">
            <mat-icon class="brand-icon">rocket_launch</mat-icon>
          </div>
          <div class="brand-text">
            <h1>NEXUS</h1>
            <span>Store</span>
          </div>
        </div>
        
        <div class="nav-actions">
          <button mat-icon-button class="nav-button">
            <mat-icon>search</mat-icon>
          </button>
          <button mat-icon-button class="nav-button">
            <mat-icon>notifications</mat-icon>
          </button>
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
    /* Navbar futurista */
    .futuristic-navbar {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% - 40px);
      max-width: 1200px;
      z-index: 1000;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      padding: 12px 24px;
      animation: slideInFromTop 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes slideInFromTop {
      0% { transform: translateX(-50%) translateY(-100px); opacity: 0; }
      100% { transform: translateX(-50%) translateY(0); opacity: 1; }
    }

    .navbar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
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
      border-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
      animation: glow 3s ease-in-out infinite;
    }

    .brand-icon {
      color: white;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .brand-text h1 {
      font-size: 24px;
      font-weight: 900;
      background: linear-gradient(135deg, #fff 0%, #e0e7ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0;
      letter-spacing: 2px;
    }

    .brand-text span {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
      font-weight: 300;
      letter-spacing: 4px;
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
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      color: white;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .nav-button:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(255, 255, 255, 0.2);
    }

    .profile-btn {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      box-shadow: 0 8px 24px rgba(240, 147, 251, 0.4);
    }

    .main-container {
      padding-top: 100px;
      min-height: 100vh;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .futuristic-navbar {
        top: 10px;
        width: calc(100% - 20px);
        padding: 8px 16px;
      }
      
      .brand-text h1 {
        font-size: 20px;
      }
      
      .brand-icon-container {
        width: 40px;
        height: 40px;
      }
      
      .main-container {
        padding-top: 80px;
      }
    }
  `]
})
export class AppComponent {
  particles = Array(15).fill(0).map(() => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 6
  }));
}