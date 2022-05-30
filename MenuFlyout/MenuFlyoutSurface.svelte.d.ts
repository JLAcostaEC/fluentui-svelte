import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
        class?: string;
        element?: HTMLUListElement;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type MenuFlyoutSurfaceProps = typeof __propDef.props;
export declare type MenuFlyoutSurfaceEvents = typeof __propDef.events;
export declare type MenuFlyoutSurfaceSlots = typeof __propDef.slots;
export default class MenuFlyoutSurface extends SvelteComponentTyped<MenuFlyoutSurfaceProps, MenuFlyoutSurfaceEvents, MenuFlyoutSurfaceSlots> {
}
export {};
