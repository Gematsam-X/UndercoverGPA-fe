import { CommonModule } from "@angular/common";
import { Component, computed, input } from "@angular/core";

@Component({
  selector: "app-average-widget",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./average-widget.html",
  styleUrls: ["./average-widget.css"],
})
export class AverageWidget {
  scores = input<number[]>([]);

  average = computed(() => {
    const arr = this.scores();
    if (!arr || arr.length === 0) return "ND";
    const sum = arr.reduce((a, b) => a + b, 0);
    return (sum / arr.length).toFixed(2);
  });
}
