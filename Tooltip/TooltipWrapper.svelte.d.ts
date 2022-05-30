import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
        text?: string;
        offset?: number;
        placement?: "top" | "bottom" | "left" | "right" | "auto";
        alignment?: "start" | "center" | "end";
        followCursor?: boolean;
        persistent?: boolean;
        visible?: boolean;
        delay?: number;
        tooltipElement?: HTMLDivElement;
        anchorElement?: HTMLDivElement;
        wrapperElement?: HTMLDivElement;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
        tooltip: {};
    };
};
export declare type TooltipWrapperProps = typeof __propDef.props;
export declare type TooltipWrapperEvents = typeof __propDef.events;
export declare type TooltipWrapperSlots = typeof __propDef.slots;
export default class TooltipWrapper extends SvelteComponentTyped<TooltipWrapperProps, TooltipWrapperEvents, TooltipWrapperSlots> {
}
export {};
