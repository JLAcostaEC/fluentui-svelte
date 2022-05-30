import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
        value?: any;
        type?: "number" | "search" | "text" | "password" | "email" | "tel" | "url" | "date" | "datetime-local" | "month" | "time" | "week";
        placeholder?: string;
        clearButton?: boolean;
        searchButton?: boolean;
        revealButton?: boolean;
        readonly?: boolean;
        disabled?: boolean;
        class?: string;
        inputElement?: HTMLInputElement;
        containerElement?: HTMLDivElement;
        buttonsContainerElement?: HTMLDivElement;
        clearButtonElement?: HTMLButtonElement;
        searchButtonElement?: HTMLButtonElement;
        revealButtonElement?: HTMLButtonElement;
    };
    events: {
        outermousedown: MouseEvent | UIEvent | Event | KeyboardEvent | ClipboardEvent | AnimationEvent | InputEvent | FocusEvent | CompositionEvent | DragEvent | ErrorEvent | FormDataEvent | PointerEvent | ProgressEvent<EventTarget> | SecurityPolicyViolationEvent | SubmitEvent | TouchEvent | TransitionEvent | WheelEvent;
        clear: CustomEvent<any>;
        search: CustomEvent<any>;
        reveal: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        buttons: {
            value: any;
        };
        default: {};
    };
};
export declare type TextBoxProps = typeof __propDef.props;
export declare type TextBoxEvents = typeof __propDef.events;
export declare type TextBoxSlots = typeof __propDef.slots;
/**
 * The TextBox control lets a user type text into an app. The text displays on the screen in a simple, plaintext format on a single line. It additionally comes with a set of buttons which allow users to perform specialized actions on the text, such as showing a password or clearing the TextBox's contents. [Docs](https://fluent-svelte.vercel.app/docs/components/texbox)
 * - Usage:
 * ```tsx
 * <TextBox placeholder="Enter your name." />
 * ```
 */
export default class TextBox extends SvelteComponentTyped<TextBoxProps, TextBoxEvents, TextBoxSlots> {
}
export {};
