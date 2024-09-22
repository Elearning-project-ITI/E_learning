import { Component } from '@angular/core';
import { RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  togglenotify(event: Event) {
    const notifiaction = event.target as HTMLElement;
    if (notifiaction.classList.contains('fa-regular')) {
      notifiaction.classList.remove('fa-regular');
      notifiaction.classList.add('fa-solid');
    } else {
      notifiaction.classList.remove('fa-solid');
      notifiaction.classList.add('fa-regular');
    }
  }
}
