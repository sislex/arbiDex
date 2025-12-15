import { Component } from '@angular/core';
import {Auth} from '../../components/auth/auth';

@Component({
  selector: 'app-auth-container',
  imports: [
    Auth
  ],
  standalone: true,
  templateUrl: './auth-container.html',
  styleUrl: './auth-container.scss',
})
export class AuthContainer {

}
