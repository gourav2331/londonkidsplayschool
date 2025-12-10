// src/app/app.component.ts
import {
  Component,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from './components/core/navbar/navbar.component';
import { FooterComponent } from './components/core/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  title = 'playschool-frontend';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    // Only touch DOM in the browser, never on the server
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const spinner = document.getElementById('spinner');
        if (spinner) {
          spinner.classList.remove('show');
        }
      }, 300);
    }
  }
}
