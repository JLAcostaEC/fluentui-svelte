import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
        class?: string;
        element?: HTMLElement;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type MenuFlyoutDividerProps = typeof __propDef.props;
export declare type MenuFlyoutDividerEvents = typeof __propDef.events;
export declare type MenuFlyoutDividerSlots = typeof __propDef.slots;
export default class MenuFlyoutDivider extends SvelteComponentTyped<MenuFlyoutDividerProps, MenuFlyoutDividerEvents, MenuFlyoutDividerSlots> {
}
export {};
