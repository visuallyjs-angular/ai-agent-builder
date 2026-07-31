import {Component, computed} from '@angular/core';
import { BaseAngularOverlayComponent } from "@visuallyjs/browser-ui-angular";
import {isCondition} from '../model-operations';

@Component({
  template:`<ng-container>
    @if(sourceLabel() && isDecision()) {
      <div class="condition-label">
        <span (click)="model.setSelection(edge.source)">{{sourceLabel()}}</span>
      </div>
    }
  </ng-container>`
})
export class EdgeOverlayComponent extends BaseAngularOverlayComponent {

  isDecision = computed(() => this.edge?.source && isCondition(this.edge.source))

  sourceLabel = computed(() => this.$sourceData().label || "")
}
