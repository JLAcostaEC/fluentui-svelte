import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
        closeOnSelect?: boolean;
        open?: boolean;
        wrapperElement?: HTMLDivElement;
        anchorElement?: HTMLDivElement;
        menuElement?: HTMLUListElement;
    };
    events: {
        contextmenu: MouseEvent;
        select: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
        flyout: {};
    };
};
export declare type ContextMenuProps = typeof __propDef.props;
export declare type ContextMenuEvents = typeof __propDef.events;
export declare type ContextMenuSlots = typeof __propDef.slots;
export default class ContextMenu extends SvelteComponentTyped<ContextMenuProps, ContextMenuEvents, ContextMenuSlots> {
}
export {};
