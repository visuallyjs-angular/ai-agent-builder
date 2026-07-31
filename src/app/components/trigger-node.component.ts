import {Component, computed, inject, Input} from '@angular/core';
import { BaseNodeComponent, VisuallyJsModule } from "@visuallyjs/browser-ui-angular";
import { lookupIcon } from "../model-operations";
import { NodeOptionsComponent } from "./node-options.component";
import { LeafActionComponent } from "./leaf-action.component";
import {AppService} from '../app.service';

@Component({
  selector: 'app-trigger-node',
  standalone: true,
  imports: [VisuallyJsModule, NodeOptionsComponent, LeafActionComponent],
  template: `
    <div class="vjs-ai-node vjs-ai-trigger-node">
      @if (!isUnset()) {
        <div class="vjs-ai-node-header">
          <img class="vjs-ai-node-icon" [src]="lookupIcon(data)" [alt]="data['provider'] || ''" />
          <div class="vjs-ai-node-name" [title]="data['name']">{{ data['name'] }}</div>
          <app-node-options [vertex]="getNode()" [model]="model"></app-node-options>
        </div>
        <div class="vjs-ai-node-body">
          <div class="vjs-ai-node-summary">{{ data['summary'] }}</div>
        </div>
      }
      @if (isUnset()) {
        <div style="padding:15px; margin:0 auto; text-align:center" (click)="$app.selectTrigger(getNode(), model)">
          Select Trigger
        </div>
      }

      @if (allSourceEdges().length === 0) {
        <app-leaf-action></app-leaf-action>
      }

      <img src="/icons/trigger-top.svg" class="vjs-ai-trigger-top" alt="" [style.backgroundColor]="isUnset() ? 'white' : '#f8f9fa'" />

    </div>
  `
})
export class TriggerNodeComponent extends BaseNodeComponent {
  $app = inject(AppService)

  lookupIcon = lookupIcon;

  isUnset = computed(() => !this.$data()['provider'] || !this.$data()['trigger'])
}
