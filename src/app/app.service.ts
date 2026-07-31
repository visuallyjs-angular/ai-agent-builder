import { Injectable, signal } from '@angular/core';

import {setTrigger, addAgentSkill, replacePlaceholderWithAction, addChildAction} from "./model-operations"
import {Node, Vertex, VisuallyJsModel} from "@visuallyjs/browser-ui"

@Injectable({
  providedIn: 'root'
})
export class AppService {
  activePopupNodeId = signal<string | null>(null);

  confirmOptions = signal<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  actionBrowserOptions = signal<{
    isOpen: boolean;
    context: any;
    onSelect: ((item: any) => void) | null;
  }>({
    isOpen: false,
    context: null,
    onSelect: null
  });

  confirm(options: { title: string; message: string; onConfirm: () => void }) {
    this.confirmOptions.set({
      isOpen: true,
      title: options.title,
      message: options.message,
      onConfirm: () => {
        options.onConfirm();
        this.confirmOptions.update(prev => ({ ...prev, isOpen: false }));
      }
    });
  }

  openActionBrowser(context: any, onSelect: (item: any) => void) {
    this.actionBrowserOptions.set({
      isOpen: true,
      context: context,
      onSelect: onSelect
    });
  }

  closeActionBrowser() {
    this.actionBrowserOptions.update(prev => ({ ...prev, isOpen: false }));
  }

  closeConfirm() {
    this.confirmOptions.update(prev => ({ ...prev, isOpen: false }));
  }

  selectTrigger(obj: Node, model: VisuallyJsModel): void {
    this.openActionBrowser({
      action: "set-trigger",
      obj,
      model
    }, (item) => {
      setTrigger(obj, model, item);
      this.closeActionBrowser();
    });
  }

  addSkill(obj: Node, model: VisuallyJsModel): void {
    this.openActionBrowser({
      action: "add-skill",
      obj,
      model,
      title: "Select Skill",
      excludedActions: obj.data['skills'] || []
    }, (item) => {
      addAgentSkill(obj, model, item);
      this.closeActionBrowser();
    });
  }

  addAction(obj: Vertex, model: VisuallyJsModel) {
    this.openActionBrowser({
      action: "add-action",
      obj,
      model
    }, (item) => {
      debugger
      if (obj.type === "placeholder") {
        replacePlaceholderWithAction(item, { obj, model });
      } else {
        addChildAction(item, { obj, model });
      }
      this.closeActionBrowser();
    });
  }
}
