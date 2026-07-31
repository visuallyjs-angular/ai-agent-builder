import {Edge, EVENT_TAP, VisuallyJsModel, Node} from "@visuallyjs/browser-ui"

import { WorkflowNodeComponent } from "./components/workflow-node.component";
import { TriggerNodeComponent } from "./components/trigger-node.component";
import { DecisionNodeComponent } from "./components/decision-node.component";
import { AgentNodeComponent } from "./components/agent-node.component";
import { PlaceholderNodeComponent } from "./components/placeholder-node.component";
import { isCondition } from "./model-operations";
import {EdgeOverlayComponent} from './components/edge-overlay.component';
import {AngularComponentOverlayType} from '@visuallyjs/browser-ui-angular';

export default function getViewOptions(): any {
    return {
        nodes:{
            trigger: {
                component: TriggerNodeComponent
            },
            decision: {
                component: DecisionNodeComponent,
                parent:"default"
            },
            agent: {
                component: AgentNodeComponent,
                parent:"default"
            },
            placeholder: {
                component: PlaceholderNodeComponent
            },
            default:{
                component: WorkflowNodeComponent,
                events:{
                    [EVENT_TAP]: (p:any) => {
                        p.model.setSelection(p.obj)
                    }
                }
            }
        },
        edges:{
            default:{
                overlays:[{
                        type:AngularComponentOverlayType,
                        options:{
                            component:EdgeOverlayComponent,
                            location:0.5
                        }
                    }
                ]
            },
            placeholder:{
                cssClass:"vjs-ai-placeholder-edge"
            }
        }
    }
}
