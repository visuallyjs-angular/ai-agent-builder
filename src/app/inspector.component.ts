import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isNode, VisuallyJsModel, Vertex, Base, isPort, getDownstreamVertices } from "@visuallyjs/browser-ui";
import {InspectorComponent, VisuallyJsModule} from "@visuallyjs/browser-ui-angular";
import { Action, ActionList, ActionConfigurationProperty, DecisionCondition } from "./definitions";
import { addCondition, deleteCondition } from "./model-operations";
import { AppService } from "./app.service";

@Component({
  selector: 'app-inspector-header',
  standalone: true,
  imports: [],
  template: `
    <div class="vjs-inspector-header">
      <div class="vjs-inspector-title">
        <ng-content></ng-content>
      </div>
      <button class="close-button" (click)="model.clearSelection()">
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  `
})
export class InspectorHeaderComponent {
  @Input() model!: VisuallyJsModel;
}

@Component({
  selector: 'app-inspector-body',
  standalone: true,
  imports: [],
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-content inspector-modal" (click)="$event.stopPropagation()">
        <div class="vjs-ai-inspector">
          <ng-content></ng-content>
          <div class="vjs-inspector-footer">
            <button class="vjs-ai-button" (click)="close()">Done</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class InspectorBodyComponent {
  @Input() model!: VisuallyJsModel;

  close() {
    this.model.clearSelection()
  }
}

@Component({
  selector: 'app-decision-conditions-section',
  standalone: true,
  imports: [],
  template: `
    <div class="vjs-inspector-field-row" style="justify-content: space-between; align-items: center; display: flex">
      <h4>Conditions</h4>
      <button class="vjs-ai-button" (click)="addCondition(decision, model)" title="Add Condition">
        Add Condition
      </button>
    </div>
    <div class="vjs-inspector-properties">
    @for (condition of conditions; track condition.id) {
      <div class="vjs-inspector-field vjs-inspector-field-row">
        <input type="text" placeholder="Label" vjs-att="label" [attr.vjs-port]="condition.id"/>
        <button class="vjs-ai-delete-button" (click)="doDeleteCondition(condition.id)">
          <img src="/icons/trash.svg" alt="Delete" style="width: 100%; height: 100%" />
        </button>
      </div>
    }
    </div>
  `
})
export class DecisionConditionsSectionComponent {
  @Input() decision: any;
  @Input() model!: VisuallyJsModel;

  appService = inject(AppService);
  addCondition = addCondition;

  get conditions(): DecisionCondition[] {
    return this.decision.data.conditions || [];
  }

  doDeleteCondition(conditionId: string) {
    const port = this.decision.getPort(conditionId);
    const ds = getDownstreamVertices(port, false);
    if (ds.length > 0) {
      this.appService.confirm({
        title: "Delete Condition?",
        message: "This condition has downstream vertices which will also be deleted. Are you sure?",
        onConfirm: () => deleteCondition(this.decision, conditionId, this.model)
      });
    } else {
      deleteCondition(this.decision, conditionId, this.model);
    }
  }
}

@Component({
  selector: 'app-workflow-inspector',
  standalone: true,
  imports: [VisuallyJsModule, InspectorHeaderComponent, InspectorBodyComponent, DecisionConditionsSectionComponent],
  template: `<ng-container>
    @if(currentObj != null) {
      <app-inspector-body [model]="model()">
        @if(isPort(currentObj)) {
          <app-inspector-header [model]="model()">
          <h3>Prompt</h3>
             </app-inspector-header>
             <div class="vjs-inspector-properties">
           <div class="vjs-inspector-field">
             <label>Name</label>
             <input type="text" vjs-att="label" placeholder="Label" vjs-focus/>
           </div>
           </div>
        } @else if (currentType === 'decision') {
          <app-inspector-header [model]="model()">
               <h3>Decision</h3>
               </app-inspector-header>
             <div class="vjs-inspector-properties">
             <div class="vjs-inspector-field">
               <label>Name</label>
               <input type="text" vjs-att="name" placeholder="Name"/>
               </div>
               <div class="vjs-inspector-field">
               <label>Summary</label>
               <textarea vjs-att="summary" placeholder="Summary" rows="3"></textarea>
               </div>
               <div class="vjs-inspector-divider" style="margin: 15px 0; border-top: 1px solid #eee"></div>
             <app-decision-conditions-section [decision]="currentObj" [model]="model()"></app-decision-conditions-section>
             </div>
        } @else if (currentType === "agent") {
            <app-inspector-header [model]="model()">
                <h3>Agent</h3>
            </app-inspector-header>
            <div class="vjs-inspector-properties">
                <div class="vjs-inspector-field">
                    <label>Name</label>
                    <input type="text" vjs-att="name" placeholder="Name"/>
                </div>
                <div class="vjs-inspector-field">
                    <label>Prompt</label>
                    <textarea vjs-att="prompt" placeholder="Prompt" rows="5"></textarea>
                </div>
                <div class="vjs-inspector-divider" style="margin: 15px 0; border-top: 1px solid #eee"></div>
                <app-decision-conditions-section [decision]="currentObj" [model]="model()"></app-decision-conditions-section>
            </div>
        } @else if (currentType !== "decision" && currentType !== "agent") {
          <app-inspector-header [model]="model()">
            <h3>{{currentObj.data.name}}</h3>
            <p>{{currentObj.data.desc}}</p>
          </app-inspector-header>
          <div class="vjs-inspector-properties">
            <div class="vjs-inspector-field">
              <label>Name</label>
              <input type="text" vjs-att="name" placeholder="Name"/>
            </div>
            <div class="vjs-inspector-field">
              <label>Summary</label>
              <textarea vjs-att="summary" placeholder="Summary" rows="3"></textarea>
            </div>
            <div class="vjs-inspector-divider" style="margin: 15px 0; border-top: 1px solid #eee"></div>
            @if (getAction(currentObj)) {
              @for (prop of getAction(currentObj)!.properties; track prop.id) {
                <div class="vjs-inspector-field">
                  <label>{{ prop.name }}</label>
                  @if (prop.datatype === 'string') {
                    <textarea [attr.vjs-att]="prop.id" [placeholder]="prop.desc" rows="3"></textarea>
                  }
                  @if (prop.datatype === 'number') {
                    <input type="number" [attr.vjs-att]="prop.id" [placeholder]="prop.desc"/>
                  }
                  @if (prop.datatype === 'boolean') {
                    <select [attr.vjs-att]="prop.id">
                      <option value=""></option>
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  }
                  @if (prop.datatype === 'array') {
                    <textarea [attr.vjs-att]="prop.id" [placeholder]="prop.desc + ' (comma separated)'" rows="2"></textarea>
                  }
                  @if (['string', 'number', 'boolean', 'array'].indexOf(prop.datatype) === -1) {
                    <input type="text" [attr.vjs-att]="prop.id" [placeholder]="prop.desc"/>
                  }
                  <div class="vjs-field-desc">{{ prop.desc }}</div>
                </div>
              }
            }
          </div>

        }
      </app-inspector-body>
    }
  </ng-container>`
})
export class WorkflowInspectorComponent extends InspectorComponent implements OnInit {
  providers: ActionList[] = [];
  isPort = isPort;

  ngOnInit() {
    fetch('/actions.json')
      .then(response => response.json())
      .then(data => this.providers = data)
      .catch(error => console.error('Error loading actions:', error));
  }

  getAction(obj: Base): Action | null {
    if (!obj || !isNode(obj) || !obj.data) return null;
    const { type, provider: providerId } = obj.data;
    if (!type || !providerId) return null;
    const provider = this.providers.find(p => p.provider.toLowerCase() === providerId.toLowerCase());
    if (!provider) return null;
    return provider.actions.find(a => a.id === type) || null;
  }
}
