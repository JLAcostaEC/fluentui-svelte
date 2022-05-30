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
export declare type MenuBarProps = typeof __propDef.props;
export declare type MenuBarEvents = typeof __propDef.events;
export declare type MenuBarSlots = typeof __propDef.slots;
export default class MenuBar extends SvelteComponentTyped<MenuBarProps, MenuBarEvents, MenuBarSlots> {
}
export {};
