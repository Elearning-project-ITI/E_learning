import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileDataService {
  private profileDataSubject = new BehaviorSubject<any>(null);
  profileData$ = this.profileDataSubject.asObservable();

  constructor() {}

  setProfileData(data: any): void {
    this.profileDataSubject.next(data);
  }

  getProfileData(): any {
    return this.profileDataSubject.value;
  }
}
// private profileDataSubject = new BehaviorSubject<any>(null);

// // Expose profileDataSubject as an Observable
// getProfileData(): Observable<any> {
//   return this.profileDataSubject.asObservable();
// }

// // Method to update profile data
// setProfileData(profileData: any): void {
//   this.profileDataSubject.next(profileData);
// }