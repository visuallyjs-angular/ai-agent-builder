import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisuallyJsModel, Vertex, getDownstreamVertices } from "@visuallyjs/browser-ui";
import { AppService } from "../app.service";
import { deleteVertex } from "../model-operations";

@Component({
  selector: 'app-delete-node',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="vjs-ai-delete-button" data-vjs-no-events="true" (click)="handleDelete($event)">
      <span *ngIf="label">{{ label }}</span>
      <svg *ngIf="!label" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 6h18"></path>
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
      </svg>
    </button>
  `
})
export class DeleteNodeComponent {
  @Input() vertex!: Vertex;
  @Input() model!: VisuallyJsModel;
  @Input() label?: string;

  appService = inject(AppService);

  handleDelete(e: MouseEvent) {
    e.stopPropagation();
    const ds = getDownstreamVertices(this.vertex, false);
    if (ds.length > 0) {
      this.appService.confirm({
        title: "Delete Node?",
        message: "This node has downstream vertices which will also be deleted. Are you sure?",
        onConfirm: () => deleteVertex(this.vertex, this.model)
      });
    } else {
      deleteVertex(this.vertex, this.model);
    }
  }
}
