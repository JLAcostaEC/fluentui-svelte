import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
        inline?: boolean;
        value?: any;
        min?: number;
        max?: number;
        step?: number;
        disabled?: boolean;
        class?: string;
        inputElement?: HTMLInputElement;
        containerElement?: HTMLDivElement;
        buttonsContainerElement?: HTMLDivElement;
        spinUpButtonElement?: HTMLButtonElement;
        clearButtonElement?: HTMLButtonElement;
        spinDownButtonElement?: HTMLButtonElement;
        spinnerFlyoutElement?: HTMLDivElement;
        stepUp?: () => void;
        stepDown?: () => void;
    };
    events: {
        change: CustomEvent<any>;
        input: CustomEvent<any>;
        beforeinput: CustomEvent<any>;
        click: CustomEvent<any>;
        blur: CustomEvent<any>;
        focus: CustomEvent<any>;
        dblclick: CustomEvent<any>;
        contextmenu: CustomEvent<any>;
        mousedown: CustomEvent<any>;
        mouseup: CustomEvent<any>;
        mouseover: CustomEvent<any>;
        mouseout: CustomEvent<any>;
        mouseenter: CustomEvent<any>;
        mouseleave: CustomEvent<any>;
        keypress: CustomEvent<any>;
        keydown: CustomEvent<any>;
        keyup: CustomEvent<any>;
        clear: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
        buttons: {};
    };
};
export declare type NumberBoxProps = typeof __propDef.props;
export declare type NumberBoxEvents = typeof __propDef.events;
export declare type NumberBoxSlots = typeof __propDef.slots;
export default class NumberBox extends SvelteComponentTyped<NumberBoxProps, NumberBoxEvents, NumberBoxSlots> {
    get stepUp(): () => void;
    get stepDown(): () => void;
}
export {};
