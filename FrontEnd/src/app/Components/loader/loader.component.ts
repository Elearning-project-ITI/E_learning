import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css',
  animations: [
        trigger('slideUp', [
          state('visible', style({
            opacity: 1,
            transform: 'translateY(0)'
          })),
          state('hidden', style({
            opacity: 0,
            transform: 'translateY(-100%)',
            display: 'none'  // Ensure it's fully removed after the animation
          })),
          transition('visible => hidden', [
            animate('1.5s ease-in-out')
          ])
        ])
      ]
})
export class LoaderComponent {
  @Input() isLoading: boolean = true;
}
