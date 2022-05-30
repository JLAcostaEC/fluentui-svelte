import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
        class?: string;
        element?: HTMLDivElement;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type TooltipSurfaceProps = typeof __propDef.props;
export declare type TooltipSurfaceEvents = typeof __propDef.events;
export declare type TooltipSurfaceSlots = typeof __propDef.slots;
export default class TooltipSurface extends SvelteComponentTyped<TooltipSurfaceProps, TooltipSurfaceEvents, TooltipSurfaceSlots> {
}
export {};
