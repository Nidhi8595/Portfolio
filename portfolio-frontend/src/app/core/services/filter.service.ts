import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  // The currently selected skill — null means "show all"
  selectedSkill = signal<string | null>(null);

  // Computed value — true when a filter is active
  isFiltered = computed(() => this.selectedSkill() !== null);

  selectSkill(skill: string): void {
    // Clicking the same skill again deselects it
    if (this.selectedSkill() === skill) {
      this.selectedSkill.set(null);
    } else {
      this.selectedSkill.set(skill);
    }
  }

  clearFilter(): void {
    this.selectedSkill.set(null);
  }
}
