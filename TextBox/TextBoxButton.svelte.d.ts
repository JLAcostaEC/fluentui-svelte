import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
        type?: string;
        class?: string;
        element?: HTMLButtonElement;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type TextBoxButtonProps = typeof __propDef.props;
export declare type TextBoxButtonEvents = typeof __propDef.events;
export declare type TextBoxButtonSlots = typeof __propDef.slots;
export default class TextBoxButton extends SvelteComponentTyped<TextBoxButtonProps, TextBoxButtonEvents, TextBoxButtonSlots> {
}
export {};
