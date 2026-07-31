import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen" class="modal-overlay" (click)="onCancel()">
      <div class="modal-content confirm-modal" (click)="$event.stopPropagation()" style="max-width: 400px">
        <div class="action-browser-header">
          <h3>{{ title }}</h3>
          <button class="close-button" (click)="onCancel()">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="action-browser-content" style="padding: 24px">
          <p style="margin: 0; font-size: 15px; color: #4b5563; line-height: 1.5">
            {{ message }}
          </p>
        </div>
        <div class="vjs-inspector-footer" style="gap: 12px">
          <button
            class="vjs-ai-button"
            style="background-color: #f1f5f9; color: #475569"
            (click)="onCancel()"
          >
            Cancel
          </button>
          <button
            class="vjs-ai-button"
            style="background-color: #ef4444"
            (click)="onConfirm()"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  `
})
export class ConfirmModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() message = '';
  @Input() onConfirm!: () => void;
  @Input() onCancel!: () => void;
}
