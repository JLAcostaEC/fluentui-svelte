import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
        open?: boolean;
        closable?: boolean;
        closeOnSelect?: boolean;
        placement?: "top" | "bottom" | "left" | "right";
        alignment?: "start" | "center" | "end";
        offset?: number;
        class?: string;
        wrapperElement?: HTMLDivElement;
        anchorElement?: HTMLDivElement;
        menuElement?: HTMLUListElement;
        backdropElement?: HTMLDivElement;
    };
    events: {
        select: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
        flyout: {};
    };
};
export declare type MenuFlyoutWrapperProps = typeof __propDef.props;
export declare type MenuFlyoutWrapperEvents = typeof __propDef.events;
export declare type MenuFlyoutWrapperSlots = typeof __propDef.slots;
export default class MenuFlyoutWrapper extends SvelteComponentTyped<MenuFlyoutWrapperProps, MenuFlyoutWrapperEvents, MenuFlyoutWrapperSlots> {
}
export {};
