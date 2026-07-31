import {Component, computed} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseNodeComponent } from "@visuallyjs/browser-ui-angular";
import { lookupIcon } from "../model-operations";
import { NodeOptionsComponent } from "./node-options.component";
import { LeafActionComponent } from "./leaf-action.component";

@Component({
  selector: 'app-workflow-node',
  standalone: true,
  imports: [NodeOptionsComponent, LeafActionComponent],
  template: `
    <div class="vjs-ai-node">
      <div class="vjs-ai-node-header">
        <img class="vjs-ai-node-icon" [src]="lookupIcon(data)" [alt]="data['provider'] || ''" />
        <div class="vjs-ai-node-name" [title]="data['name']">{{ data['name'] }}</div>
        <app-node-options [vertex]="getNode()" [model]="model"></app-node-options>
      </div>
      <div class="vjs-ai-node-body">
        <div class="vjs-ai-node-summary">{{ data['summary'] }}</div>
      </div>
      @if (allSourceEdges().length === 0) {
        <app-leaf-action></app-leaf-action>
      }
    </div>
  `
})
export class WorkflowNodeComponent extends BaseNodeComponent {
  lookupIcon = lookupIcon;
}
