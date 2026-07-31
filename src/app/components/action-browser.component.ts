import {Component, Input, OnInit, OnDestroy, signal} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { iconBase } from '../model-operations';
import providersData from '../providers';
import { Action } from '../definitions';
import {Base, BrowserUIModel, DatasetIndex} from "@visuallyjs/browser-ui";

@Component({
  selector: 'app-action-browser',
  standalone: true,
  imports: [FormsModule],
  templateUrl: `./action-browser.component.html`
})
export class ActionBrowserComponent implements OnInit {
  @Input() onClose!: () => void;
  @Input() onSelect!: (item: any, context: any) => void;
  @Input() context!: { action:string, obj:Base, model:BrowserUIModel, excludedActions?:Array<Action>, title?:string };

  providers  = signal<Array<any>>([]);
  iconBase = iconBase;
  itemsKey = 'actions';
  title = '';
  excludedActionIds = new Set<string>();

  searchTerm = '';
  index = new DatasetIndex({
    fields: ['name', 'desc', 'provider']
  });
  matchingIds: Set<string> | null = null;

  ngOnInit() {
    const isTrigger = this.context?.action === 'set-trigger';
    const dataUrl = isTrigger ? '/triggers.json' : '/actions.json';
    this.itemsKey = isTrigger ? 'triggers' : 'actions';
    this.title = this.context?.title || (isTrigger ? 'Select a Trigger' : 'Select an Action');
    this.excludedActionIds = new Set((this.context?.excludedActions || []).map((a: Action) => a.id));

    fetch(dataUrl)
      .then(response => response.json())
      .then(data => {
        const providers = data.map((p: any) => {
          if (!p.icon) {
            const providerInfo = providersData.find(pr => pr.id === p.provider);
            p.icon = providerInfo?.icon;
          }
          p[this.itemsKey].forEach((a: any) => a.provider = p.provider);
          return p;
        });

        this.index.clear();
        providers.forEach((p: any) => {
          this.index.addAll(...p[this.itemsKey]);
        });

        this.providers.set(providers)
      })
      .catch(error => console.error('Error loading data:', error));
  }

  onSearchTermChange() {
    if (!this.searchTerm) {
      this.matchingIds = null;
    } else {
      const hits = this.index.search(this.searchTerm);
      this.matchingIds = new Set(hits.map(h => h.document.id));
    }
  }

  getFilteredItems(provider: any): any[] {
    return provider[this.itemsKey].filter((item: any) => !this.matchingIds || this.matchingIds.has(item.id));
  }

  isExcluded(id: string) {
    return this.excludedActionIds.has(id);
  }

  handleItemClick(item: any, provider: any) {
    if (!this.isExcluded(item.id)) {
      this.onSelect({ ...item, provider: provider.provider, providerIcon: provider.icon }, this.context);
    }
  }

  onIconError(event: any) {
    event.target.style.display = 'none';
  }
}
