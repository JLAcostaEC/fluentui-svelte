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
export declare type FlyoutSurfaceProps = typeof __propDef.props;
export declare type FlyoutSurfaceEvents = typeof __propDef.events;
export declare type FlyoutSurfaceSlots = typeof __propDef.slots;
export default class FlyoutSurface extends SvelteComponentTyped<FlyoutSurfaceProps, FlyoutSurfaceEvents, FlyoutSurfaceSlots> {
}
export {};
