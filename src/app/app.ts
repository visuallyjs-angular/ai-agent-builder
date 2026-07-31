import { Component, inject } from '@angular/core';
import { VisuallyJsModule, VisuallyJsService } from "@visuallyjs/browser-ui-angular";
import { VisuallyJsModel, Vertex } from "@visuallyjs/browser-ui";

import renderOptions from "./render-options";
import modelOptions from "./model-options";
import getViewOptions from "./view-options";
import { addChildAction, replacePlaceholderWithAction } from "./model-operations";
import { AppService } from "./app.service";
import { CommonModule } from '@angular/common';

import { ButtonBarComponent } from "./components/button-bar.component";
import { ActionBrowserComponent } from "./components/action-browser.component";
import { WorkflowInspectorComponent } from "./inspector.component";
import { ConfirmModalComponent } from "./components/confirm-modal.component";
import { NextStepPopupComponent } from "./components/next-step-popup.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    VisuallyJsModule,
    ButtonBarComponent,
    ActionBrowserComponent,
    WorkflowInspectorComponent,
    ConfirmModalComponent,
    NextStepPopupComponent
  ],
  templateUrl: './app.html'
})
export class App {

  appService = inject(AppService);

  url = "/dataset.json";
  renderOptions = renderOptions;
  modelOptions = modelOptions;
  viewOptions = getViewOptions();


  addAction(obj: Vertex, model: VisuallyJsModel) {
    this.appService.openActionBrowser({
      action: "add-action",
      obj,
      model
    }, (item) => {
      if (obj.type === "placeholder") {
        replacePlaceholderWithAction(item, { obj, model });
      } else {
        addChildAction(item, { obj, model });
      }
      this.appService.closeActionBrowser();
    });
  }
}
