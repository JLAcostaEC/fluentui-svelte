import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
        open?: boolean;
        disabled?: boolean;
        class?: string;
        element?: HTMLLIElement;
        anchorElement?: HTMLDivElement;
        menuElement?: HTMLUListElement;
    };
    events: {
        open: CustomEvent<any>;
        close: CustomEvent<any>;
        select: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
        flyout: {};
    };
};
export declare type MenuBarItemProps = typeof __propDef.props;
export declare type MenuBarItemEvents = typeof __propDef.events;
export declare type MenuBarItemSlots = typeof __propDef.slots;
export default class MenuBarItem extends SvelteComponentTyped<MenuBarItemProps, MenuBarItemEvents, MenuBarItemSlots> {
}
export {};
