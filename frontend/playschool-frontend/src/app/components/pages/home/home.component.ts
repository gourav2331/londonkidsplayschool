// src/app/components/pages/home/home.component.ts
import {
  Component,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

declare const $: any; // jQuery from index.html scripts

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    // Only run this in the browser, NEVER on server
    if (isPlatformBrowser(this.platformId)) {
      // Let Angular render the view completely
      setTimeout(() => {
        if (typeof $ === 'undefined') {
          console.warn('jQuery is not available; owlCarousel cannot be initialized.');
          return;
        }

        const $carousel = $('.header-carousel');
        if (!$carousel.length) {
          console.warn('No .header-carousel element found.');
          return;
        }

        // Initialize Owl Carousel manually
        $carousel.owlCarousel({
          autoplay: true,
          smartSpeed: 1500,
          items: 1,
          dots: true,
          loop: true,
          nav: true,
          navText: [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>',
          ],
        });
      }, 0);
    }
  }
}
