import { Component } from '@angular/core';
import { ActivatedRoute, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-cousre-details',
  standalone: true,
  imports: [RouterOutlet,RouterModule,RouterLinkActive],
  templateUrl: './cousre-details.component.html',
  styleUrl: './cousre-details.component.css'
})
export class CousreDetailsComponent {
  ID=0
  constructor(myRoute:ActivatedRoute ){ 
    this.ID=myRoute.snapshot.params["id"]; 
  }

}
