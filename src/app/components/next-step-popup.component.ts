import {Component, inject, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserUIModel, Vertex, Surface } from "@visuallyjs/browser-ui";
import { addChild, replacePlaceholder } from "../model-operations";
import {AppService} from '../app.service';

@Component({
  selector: 'app-next-step-popup',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="vjs-next-step">
      <div (click)="doAddAction($event)">
        <img src="/icons/action.svg" width="16" height="16" alt="Action" style="margin-right: 10px" />
        Perform an action
      </div>
      <div (click)="addConditionNode($event, 'decision', 'Decision', emptyPayload)">
        <img src="/icons/condition.svg" width="16" height="16" alt="Condition" style="margin-right:10px" />
        Decision
      </div>
      <div (click)="addConditionNode($event, 'agent', 'Agent', agentPayload)">
        <img src="/icons/ai.svg" width="16" height="16" alt="AI" style="margin-right: 10px" />
        Enter AI agent
      </div>
    </div>
  `
})
export class NextStepPopupComponent {
  @Input() vertex!:Vertex
  @Input() model!:BrowserUIModel
  @Input() ui!:Surface
  @Input() hide!: () => void;

  appService = inject(AppService)

  emptyPayload = () => ({});
  agentPayload = () => ({ skills: [] });

  addConditionNode(e: any, type: string, name: string, payload: () => any) {
    e.stopPropagation();
    this.hide();
    const pl = Object.assign(payload() || {}, { name });
    if (this.vertex.data.type === "placeholder") {
      replacePlaceholder(this.vertex, type, pl, this.model);
    } else {
      addChild(this.vertex, type, pl, this.model);
    }
  }

  doAddAction(e: any) {
    e.stopPropagation();
    this.hide();
    this.appService.addAction(this.vertex, this.model);
  }
}
