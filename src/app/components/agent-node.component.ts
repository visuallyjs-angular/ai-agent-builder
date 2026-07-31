import { Component, Input, inject } from '@angular/core';
import { BaseNodeComponent, VisuallyJsModule } from "@visuallyjs/browser-ui-angular";
import { lookupIcon } from "../model-operations";
import { DeleteNodeComponent } from "./delete-node.component";
import { AppService } from "../app.service";
import { Action } from "../definitions";

@Component({
  selector: 'app-agent-node',
  standalone: true,
  imports: [VisuallyJsModule, DeleteNodeComponent],
  template: `
    <div class="vjs-ai-node">
      <div class="vjs-ai-node-header">
        <div class="vjs-ai-node-name" [title]="data['name']">{{ data['name'] || "Agent" }}</div>
        <button data-vjs-no-events="true" class="vjs-ai-button vjs-ai-agent-add-skill-button" style="padding: 4px 8px; font-size: 12px" (click)="appService.addSkill(getNode(), model)">+ Skill</button>
        <app-delete-node [vertex]="getNode()" [model]="model"></app-delete-node>
      </div>
      <div class="vjs-ai-node-body">
        <div class="agent-skills-list">
          @for (skill of skills; track skill.id) {
            <div class="agent-skill-item">
              <img [src]="lookupIcon(skill)" [alt]="skill.provider" class="agent-skill-icon" />
              <span class="agent-skill-name">{{ skill.name }}</span>
              <button data-vjs-no-events="true" class="agent-skill-delete" (click)="removeSkill(skill.id, skill.name)"></button>
            </div>
          }
        </div>
      </div>
      @for (condition of conditions; track condition.id) {
        <div [attr.data-vjs-port]="condition.id" [attr.data-vjs-source]="true"></div>
      }
    </div>
  `
})
export class AgentNodeComponent extends BaseNodeComponent {
  @Input() addSkill!: (obj: any, model: any) => void;

  appService = inject(AppService);
  lookupIcon = lookupIcon;

  get skills(): Action[] {
    return this.data['skills'] || [];
  }

  get conditions(): any[] {
    return this.data['conditions'] || [];
  }

  removeSkill(skillId: string, skillName: string) {
    this.appService.confirm({
      title: "Remove Skill?",
      message: `Are you sure you want to remove the skill "${skillName}"?`,
      onConfirm: () => {
        this.updateNode({
          skills: this.skills.filter((s: Action) => s.id !== skillId)
        })
      }
    });
  }
}
