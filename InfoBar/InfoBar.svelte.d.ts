import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
        open?: boolean;
        closable?: boolean;
        severity?: "information" | "success" | "caution" | "critical" | "attention";
        title?: string;
        message?: string;
        class?: string;
        element?: HTMLDivElement;
        titleElement?: HTMLHeadingElement;
        messageElement?: HTMLParagraphElement;
        actionElement?: HTMLDivElement;
        closeButtonElement?: HTMLButtonElement;
    };
    events: {
        open: CustomEvent<any>;
        close: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        icon: {};
        default: {};
        action: {};
    };
};
export declare type InfoBarProps = typeof __propDef.props;
export declare type InfoBarEvents = typeof __propDef.events;
export declare type InfoBarSlots = typeof __propDef.slots;
/**
 * The InfoBar control is for displaying app-wide status messages to users that are highly visible yet non-intrusive. There are built-in security levels to easily indicate the type of message shown as well as the option to include your own call to action or hyperlink button. [Docs](https://fluent-svelte.vercel.app/docs/components/infobar)
 * - Usage:
 * ```tsx
 * <InfoBar title="Title" message="Message">
 *     <Button slot="action">Action</Button>
 * </InfoBar>
 * ```
 */
export default class InfoBar extends SvelteComponentTyped<InfoBarProps, InfoBarEvents, InfoBarSlots> {
}
export {};
