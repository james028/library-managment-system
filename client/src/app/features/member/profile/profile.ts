import { Component, inject } from '@angular/core';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UsersService, UserProfile } from '../../../core/services/UsersService';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private usersService = inject(UsersService);

  readonly user$: Observable<UserProfile> = this.usersService.getUserProfile().pipe(
    tap(l => console.log(l)),
    map((user) => ({
      ...user,
      firstName: user.firstName.toUpperCase()
    })),
    catchError((error) => {
      console.error('Wystąpił błąd podczas pobierania profilu:', error);
      // Zwracamy bezpieczny pusty obiekt lub domyślny stan
      return of({} as UserProfile);
    })
  );
}
