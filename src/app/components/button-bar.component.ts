import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisuallyJsService } from "@visuallyjs/browser-ui-angular";

@Component({
  selector: 'app-button-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="vjs-button-bar">
      <button (click)="zoomToFit()" title="Zoom To Fit">
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
        <span>Zoom To Fit</span>
      </button>
      <div class="vjs-button-bar-separator"></div>
      <button (click)="undo()" title="Undo">
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
          <path d="M3 7v6h6M3 13c3.6-8 14.4-8 18 0" />
        </svg>
        <span>Undo</span>
      </button>
      <button (click)="redo()" title="Redo">
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
          <path d="M21 7v6h-6M21 13c-3.6-8-14.4-8-18 0" />
        </svg>
        <span>Redo</span>
      </button>
      <div class="vjs-button-bar-separator"></div>
      <button (click)="save()" title="Save">
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </svg>
        <span>Save</span>
      </button>
      <button (click)="load()" title="Load">
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <span>Load</span>
      </button>
      <button (click)="newWorkflow()" title="New">
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span>New</span>
      </button>
      <input
        type="file"
        #fileInput
        style="display: none"
        (change)="handleFileChange($event)"
        accept=".json"
      />
    </div>
  `
})
export class ButtonBarComponent {
  $vjs = inject(VisuallyJsService);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  zoomToFit() {
    this.$vjs.surface().zoomToFit();
  }

  undo() {
    this.$vjs.model().undo();
  }

  redo() {
    this.$vjs.model().redo();
  }

  save() {
    if (!this.$vjs.surface) return;
    const data = this.$vjs.model().exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "workflow.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  load() {
    this.fileInput.nativeElement.click();
  }

  handleFileChange(event: any) {
    const file = event.target.files?.[0];
    if (file && this.$vjs.surface()) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        try {
          const data = JSON.parse(content);
          this.$vjs.model().clear();
          this.$vjs.model().load({ data });
        } catch (err) {
          console.error("Failed to parse file", err);
        }
      };
      reader.readAsText(file);
    }
    event.target.value = "";
  }

  newWorkflow() {
    if (!this.$vjs.surface) return;
    this.$vjs.model().clear();
    this.$vjs.model().addNode({
      type: "trigger",
      name: "New Trigger",
      summary: "Configure this trigger"
    });
    this.$vjs.surface().zoomToFit();
  }
}
