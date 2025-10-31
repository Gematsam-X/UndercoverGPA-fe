import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './homepage.html',
  styleUrls: ['./homepage.css'],
})
export class Homepage {
  username: string = localStorage.getItem('username') || 'Guest';

  constructor(private router: Router) {}

  redirectToNewVoteForm() {
    this.router.navigate(['new-vote']);
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userEmail');
    this.router.navigate(['login']);
  }
}
