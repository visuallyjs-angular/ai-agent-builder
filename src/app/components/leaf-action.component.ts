import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leaf-action',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="vjs-ai-node-leaf-action">
    <div class="vjs-ai-node-line"></div>
      <button class="vjs-ai-node-add-button vjs-next-step-picker">
        <img src="/icons/plus.svg" alt="Add" style="width:100%;height: 100%" />
      </button>
    </div>
  `
})
export class LeafActionComponent {}
