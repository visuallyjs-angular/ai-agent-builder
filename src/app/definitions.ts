import {Node, VisuallyJsModel} from "@visuallyjs/browser-ui";

export const DECISION = "decision"
export const AGENT = "agent"
export const PLACEHOLDER = "placeholder"

export type VertexOperation = (obj:Node, model:VisuallyJsModel) => any

export interface ActionConfigurationProperty {
    id:string
    name:string
    desc:string
    datatype:'string'|'number'|'email'|'array'|'boolean'
}

export interface Action {
    id:string
    name:string
    desc:string
    provider:string
    providerIcon?:string
    properties:Array<ActionConfigurationProperty>
}

export interface Agent {
    id:string
    name:string
    prompt:string
    skills:Array<Action>
    conditions:Array<DecisionCondition>
}

export interface Decision {
    id:string
    name:string
    desc:string
    conditions:Array<DecisionCondition>
}

export interface DecisionCondition {
    id:string
    label:string
}

export interface ActionList {
    provider:string
    icon?:string
    actions:Array<Action>
}

export interface ToolProvider {
    id:string
    icon:string
}
