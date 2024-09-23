import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { AboutComponent } from './Components/about/about.component';
import { CoursesComponent } from './Components/courses/courses.component';
import { WorkPerviousComponent } from './Components/work-pervious/work-pervious.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { RegisterationComponent } from './Components/registeration/registeration.component';
import { LoginComponent } from './Components/login/login.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { ViewProfileComponent } from './Components/view-profile/view-profile.component';
import { NotificationComponent } from './Components/notification/notification.component';
import { EditProfileComponent } from './Components/edit-profile/edit-profile.component';

export const routes: Routes = [
    {path:"",component:LoginComponent},
    {path:"home",component:HomeComponent},
    {path:"about",component:AboutComponent},
    {path:"courses",component:CoursesComponent},
    {path:"workPervious",component:WorkPerviousComponent},
    {path:"register",component:RegisterationComponent},
    {path:"login",component:LoginComponent},
    {path:"notification",component:NotificationComponent},
    {path:"profile",component:ProfileComponent, children: [
        { path: "", component: ViewProfileComponent },
        { path: "viewProfile", component: ViewProfileComponent },
        { path: "notification", component: NotificationComponent },
        { path: "editProfile", component: EditProfileComponent }
    ]},

    {path:"**",component:NotFoundComponent}
];
