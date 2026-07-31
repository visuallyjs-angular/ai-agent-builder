import {Component, computed} from '@angular/core';
import { BaseNodeComponent, VisuallyJsModule } from "@visuallyjs/browser-ui-angular";
import { lookupIcon } from "../model-operations";
import { DeleteNodeComponent } from "./delete-node.component";

@Component({
  selector: 'app-decision-node',
  standalone: true,
  imports: [VisuallyJsModule, DeleteNodeComponent],
  template: `
    <div class="decision-node vjs-ai-node">
      <div class="vjs-ai-node-header">
        <img class="vjs-ai-node-icon" [src]="lookupIcon(data)" [alt]="data['provider'] || ''" />
        <div class="vjs-ai-node-name" [title]="data['name']">{{ data['name'] }}</div>
        <app-delete-node [vertex]="getNode()" [model]="model"></app-delete-node>
      </div>
      <div style="display:flex;justify-content:center;height: 0">
      @for (condition of conditions(); track condition.id) {
        <div [attr.data-vjs-port]="condition.id" [attr.data-vjs-source]="true">&nbsp;</div>
      }
      </div>
    </div>
  `
})
export class DecisionNodeComponent extends BaseNodeComponent {
  lookupIcon = lookupIcon;
  conditions = computed(() => this.$data()['conditions'] || [])
}
