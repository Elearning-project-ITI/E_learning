import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
  animations: [
    trigger('fadeIn', [
      state('visible', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('hidden => visible', animate('2s ease-in-out')),
    ]),
    trigger('slideIn', [
      state('visible', style({ transform: 'translateX(0)', opacity: 1 })),
      state('hidden', style({ transform: 'translateX(-100%)', opacity: 0 })),
      transition('hidden => visible', animate('1s ease-in-out')),
    ]),
    trigger('zoomIn', [
      state('visible', style({ transform: 'scale(1)', opacity: 1 })),
      state('hidden', style({ transform: 'scale(0.5)', opacity: 0 })),
      transition('hidden => visible', animate('1.5s ease-in-out')),
    ])
  ]
})
export class AboutComponent implements AfterViewInit{
  isVisible = false;

  ngAfterViewInit(): void {
    this.checkVisibility();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.checkVisibility();
  }

  private checkVisibility(): void {
    const hero = document.getElementById('hero');
    if (hero) {
      const rect = hero.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      this.isVisible = rect.top <= viewHeight;
    }
  }
}
