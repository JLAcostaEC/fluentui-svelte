import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
        variant?: "caption" | "body" | "bodyStrong" | "bodyLarge" | "subtitle" | "title" | "titleLarge" | "display";
        tag?: any;
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
export declare type TextBlockProps = typeof __propDef.props;
export declare type TextBlockEvents = typeof __propDef.events;
export declare type TextBlockSlots = typeof __propDef.slots;
export default class TextBlock extends SvelteComponentTyped<TextBlockProps, TextBlockEvents, TextBlockSlots> {
}
export {};
