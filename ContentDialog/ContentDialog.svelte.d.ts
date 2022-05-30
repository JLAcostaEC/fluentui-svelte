import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
        open?: boolean;
        title?: string;
        size?: "standard" | "max" | "min";
        closable?: boolean;
        append?: HTMLElement;
        darken?: boolean;
        trapFocus?: boolean;
        class?: string;
        element?: HTMLElement;
        backdropElement?: HTMLElement;
        bodyElement?: HTMLElement;
        footerElement?: HTMLElement;
    };
    events: {
        backdropclick: CustomEvent<any>;
        backdropmousedown: CustomEvent<any>;
        close: CustomEvent<any>;
        open: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
        footer: {};
        outer: {};
    };
};
export declare type ContentDialogProps = typeof __propDef.props;
export declare type ContentDialogEvents = typeof __propDef.events;
export declare type ContentDialogSlots = typeof __propDef.slots;
export default class ContentDialog extends SvelteComponentTyped<ContentDialogProps, ContentDialogEvents, ContentDialogSlots> {
}
export {};
