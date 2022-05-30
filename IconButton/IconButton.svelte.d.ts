import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
        href?: string;
        disabled?: boolean;
        class?: string;
        element?: HTMLElement;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type IconButtonProps = typeof __propDef.props;
export declare type IconButtonEvents = typeof __propDef.events;
export declare type IconButtonSlots = typeof __propDef.slots;
/**
 * An Icon Button is a clickable control that triggers an immediate action. Unlike the Button control, it serves the purpose of encapsulating an icon glyph as it’s content. [Docs](https://fluent-svelte.vercel.app/docs/components/iconbutton)
 * - Usage:
 * ```tsx
 * <IconButton>
 *     <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
 *         <path d="M8 14A6 6 0 108 2a6 6 0 000 12zm0-1A5 5 0 118 3a5 5 0 010 10z" />
 *     </svg>
 * </IconButton>
 * ```
 */
export default class IconButton extends SvelteComponentTyped<IconButtonProps, IconButtonEvents, IconButtonSlots> {
}
export {};
