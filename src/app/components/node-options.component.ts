import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vertex, VisuallyJsModel } from "@visuallyjs/browser-ui";
import { DeleteNodeComponent } from "./delete-node.component";
import { setTrigger } from "../model-operations";
import { AppService } from "../app.service";

@Component({
  selector: 'app-node-options',
  standalone: true,
  imports: [CommonModule, DeleteNodeComponent],
  template: `
    <div class="vjs-ai-node-options" tabIndex="0" data-vjs-no-events="true">
      <button class="vjs-ai-node-options-button">
        <img src="/icons/more-horizontal.svg" width="16" height="16" alt="Options" />
      </button>
      <div class="vjs-ai-node-options-menu">
        <app-delete-node [vertex]="vertex" [model]="model" label="Delete Node"></app-delete-node>
        <button class="vjs-ai-node-options-menu-item" (click)="handleOpenBrowser()">
          Change {{ isTrigger ? 'trigger' : 'action' }}
        </button>
      </div>
    </div>
  `
})
export class NodeOptionsComponent {
  @Input() vertex!: Vertex;
  @Input() model!: VisuallyJsModel;

  appService = inject(AppService);

  get isTrigger() {
    return this.vertex.type === 'trigger';
  }

  handleOpenBrowser() {
    this.appService.openActionBrowser({
      action: this.isTrigger ? 'set-trigger' : 'change-action',
      excludedActions: [{ id: this.isTrigger ? this.vertex.data['trigger'] : this.vertex.type }]
    }, (item) => this.handleSelectAction(item));
  }

  handleSelectAction(item: any) {
    if (this.isTrigger) {
      setTrigger(this.vertex as any, this.model, item);
    } else {
      this.model.setType(this.vertex, item.id);
      this.model.updateNode(this.vertex, {
        provider: item.provider,
        name: item.name,
        summary: item.desc
      });
    }

    this.appService.closeActionBrowser()
  }
}
