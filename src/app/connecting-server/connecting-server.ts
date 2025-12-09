import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-connecting-server',
  templateUrl: './connecting-server.html',
  styleUrls: ['./connecting-server.css'],
})
export class ConnectingServer implements OnInit, OnDestroy {
  seconds = 0;
  private intervalId?: any;

  ngOnInit() {
    // ⏱️ Parte il timer
    this.intervalId = setInterval(() => {
      this.seconds++;
    }, 1000);
  }

  ngOnDestroy() {
    // 🧹 Evita memory leak
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
