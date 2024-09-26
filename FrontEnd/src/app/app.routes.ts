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
import { ForgetPasswordComponent } from './Components/forget-password/forget-password.component';
import { ResetPasswordComponent } from './Components/reset-password/reset-password.component';
import { CousreDetailsComponent } from './Components/cousre-details/cousre-details.component';
import { ViewCourseDetailsComponent } from './Components/view-course-details/view-course-details.component';
import { CoursematerialComponent } from './Components/coursematerial/coursematerial.component';
import { QuizesComponent } from './Components/quizes/quizes.component';
import { ReviwesComponent } from './Components/reviwes/reviwes.component';
import { CoursesAdminComponent } from './Components/courses-admin/courses-admin.component';
import { QuizesAdminComponent } from './Components/quizes-admin/quizes-admin.component';
import { MaterialAdminComponent } from './Components/material-admin/material-admin.component';
import { WishlistComponent } from './Components/wishlist/wishlist.component';
import { VerifyEmailComponent } from './Components/verify-email/verify-email.component';

export const routes: Routes = [
    {path:"",component:HomeComponent},
    {path:"home",component:HomeComponent},
    {path:"about",component:AboutComponent},
    {path:"courses",component:CoursesComponent},
    {path:"workPervious",component:WorkPerviousComponent},
    {path:"register",component:RegisterationComponent},
    {path:"login",component:LoginComponent},
    {path:"forgetpassword",component:ForgetPasswordComponent},
    {path:"resetpassword",component:ResetPasswordComponent},
    {path:"verify-email",component:VerifyEmailComponent},
    {path:"notification",component:NotificationComponent},
    {path:"myCourses",component:CoursesAdminComponent},
    {path:"myQuizes",component:QuizesAdminComponent},
    {path:"myMaterial",component:MaterialAdminComponent},
    {path:"wishlist",component:WishlistComponent},
    {path:"profile",component:ProfileComponent, children: [
        { path: "", component: ViewProfileComponent },
        { path: "viewProfile", component: ViewProfileComponent },
        { path: "notification", component: NotificationComponent },
        { path: "editProfile", component: EditProfileComponent }
    ]},
    {path:"cousres/:id",component:CousreDetailsComponent,children:[
        { path: "", component: ViewCourseDetailsComponent },
        { path: "cousredetails", component: ViewCourseDetailsComponent },
        { path: "cousrematerial", component: CoursematerialComponent },
        { path: "quizes", component: QuizesComponent },
        { path: "reviews", component: ReviwesComponent }
    ]},
    {path:"**",component:NotFoundComponent}
];
