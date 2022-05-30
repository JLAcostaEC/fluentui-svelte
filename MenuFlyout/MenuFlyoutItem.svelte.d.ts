import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
        variant?: "standard" | "radio" | "toggle";
        cascading?: boolean;
        hint?: string;
        selected?: boolean;
        checked?: boolean;
        indented?: boolean;
        group?: any;
        value?: any;
        disabled?: boolean;
        open?: boolean;
        __depth?: boolean;
        class?: string;
        element?: HTMLLIElement;
        inputElement?: HTMLInputElement;
        inputLabelElement?: HTMLLabelElement;
        subMenuAnchorElement?: HTMLDivElement;
        subMenuElement?: HTMLUListElement;
    };
    events: {
        change: Event;
        input: Event;
        beforeinput: InputEvent;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        icon: {
            slot: string;
        };
        default: {};
        flyout: {};
    };
};
export declare type MenuFlyoutItemProps = typeof __propDef.props;
export declare type MenuFlyoutItemEvents = typeof __propDef.events;
export declare type MenuFlyoutItemSlots = typeof __propDef.slots;
export default class MenuFlyoutItem extends SvelteComponentTyped<MenuFlyoutItemProps, MenuFlyoutItemEvents, MenuFlyoutItemSlots> {
}
export {};
