import { classNames } from '../../../platform/preact/class-names.ts';
import './panel.scss'
import { h } from "preact";

export type PanelProps = h.JSX.HTMLAttributes<HTMLDivElement> & {

}

export function Panel({ ...props}: PanelProps) {
  return <div  {...props} class={classNames({ "component-panel": true }, props.className, props.class)} />
}

export type PanelHeaderProps = h.JSX.HTMLAttributes<HTMLDivElement> & {
}


export function PanelHeader({ ...props}: PanelHeaderProps) {
  return <div  {...props} class={classNames({ "component-panel-header": true }, props.className, props.class)} />
}

export type PanelSectionProps = h.JSX.HTMLAttributes<HTMLDivElement> & {
  scrollable?: boolean
}

export function PanelSection({ scrollable, ...props}: PanelSectionProps) {
  return <div {...props} class={classNames({ "component-panel-section": true, 'scrollable': scrollable }, props.className, props.class)}  />
}

export type PanelListItemProps = h.JSX.HTMLAttributes<HTMLDivElement> & {
}

export function PanelListItem({ ...props}: PanelListItemProps) {
  return <div {...props}  class={classNames({ 
    "component-panel-list-item": true,
    'clickable': props.onClick !== undefined
  }, props.className, props.class)}  />
}

export type PanelListProps = h.JSX.HTMLAttributes<HTMLDivElement> & {
}

export function PanelList({ children, ...props}: PanelListProps) {
  return <div {...props} class={classNames({ 
    "component-panel-list": true,
    "empty": children === undefined || Array.isArray(children) && !children.length
  }, props.className, props.class)} > 
  {children}
  </div>
}