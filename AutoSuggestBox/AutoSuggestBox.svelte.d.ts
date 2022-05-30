import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
        value?: any;
        items?: string[];
        open?: boolean;
        selection?: number;
        matches?: string[];
        class?: string;
        inputElement?: HTMLInputElement;
        containerElement?: HTMLDivElement;
        buttonsContainerElement?: HTMLDivElement;
        clearButtonElement?: HTMLButtonElement;
        searchButtonElement?: HTMLButtonElement;
        flyoutElement?: HTMLUListElement;
    };
    events: {
        search: CustomEvent<any>;
        input: CustomEvent<any>;
        focus: CustomEvent<any>;
        blur: CustomEvent<any>;
        keydown: CustomEvent<any>;
        change: CustomEvent<any>;
        beforeinput: CustomEvent<any>;
        click: CustomEvent<any>;
        dblclick: CustomEvent<any>;
        contextmenu: CustomEvent<any>;
        mousedown: CustomEvent<any>;
        mouseup: CustomEvent<any>;
        mouseover: CustomEvent<any>;
        mouseout: CustomEvent<any>;
        mouseenter: CustomEvent<any>;
        mouseleave: CustomEvent<any>;
        keypress: CustomEvent<any>;
        keyup: CustomEvent<any>;
        clear: CustomEvent<any>;
        select: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        'item-template': {
            id: string;
            value: any;
            matches: string[];
            selection: number;
            item: string;
            index: any;
        };
        default: {};
        buttons: {
            slot: string;
        };
    };
};
export declare type AutoSuggestBoxProps = typeof __propDef.props;
export declare type AutoSuggestBoxEvents = typeof __propDef.events;
export declare type AutoSuggestBoxSlots = typeof __propDef.slots;
export default class AutoSuggestBox extends SvelteComponentTyped<AutoSuggestBoxProps, AutoSuggestBoxEvents, AutoSuggestBoxSlots> {
}
export {};
