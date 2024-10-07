import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './Components/header/header.component';
import { FooterComponent } from './Components/footer/footer.component';
import { LoaderComponent } from './Components/loader/loader.component';
import { RegisterationComponent } from "./Components/registeration/registeration.component";
import { PusherService } from './shared/services/notification.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, LoaderComponent, RegisterationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'finalProject';
  isLoading: boolean = true;

  constructor(
    private pusherService: PusherService, // Inject PusherService
  ) {}

  ngOnInit(): void {
   
    setTimeout(() => {
      this.isLoading = false; 
    }, 3000);
  }
}
