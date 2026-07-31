import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseNodeComponent } from "@visuallyjs/browser-ui-angular";

@Component({
  selector: 'app-placeholder-node',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="vjs-ai-node placeholder-node">
      <button class="vjs-ai-node-add-button vjs-next-step-picker" data-vjs-popup-anchor="center">
        <img src="/icons/plus.svg" alt="Add" style="width:100%;height:100%" />
      </button>
    </div>
  `
})
export class PlaceholderNodeComponent extends BaseNodeComponent {}
