import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
        value?: any;
        searchValue?: any;
        placeholder?: string;
        items?: {
            name: string;
            value: any;
            disabled?: boolean;
        }[];
        editable?: boolean;
        disabled?: boolean;
        open?: boolean;
        class?: string;
        inputElement?: HTMLInputElement;
        searchInputElement?: HTMLInputElement;
        containerElement?: HTMLDivElement;
        menuElement?: HTMLUListElement;
        buttonElement?: HTMLButtonElement;
    };
    events: {
        change: Event;
        input: Event;
        beforeinput: InputEvent;
        keydown: CustomEvent<any>;
        open: CustomEvent<any>;
        close: CustomEvent<any>;
        select: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type ComboBoxProps = typeof __propDef.props;
export declare type ComboBoxEvents = typeof __propDef.events;
export declare type ComboBoxSlots = typeof __propDef.slots;
/**
 * Use a combo box (also known as a drop-down list) to present a list of items that a user can select from. A combo box starts in a compact state and expands to show a list of selectable items.
 *
 * When the combo box is closed, it either displays the current selection or is empty if there is no selected item. When the user expands the combo box, it displays the list of selectable items.
 * [Docs](https://fluent-svelte.vercel.app/docs/components/combobox)
 *
 * - Usage:
 *    ```tsx
 *    <ComboBox items={[
 * 	{ name: "Item 0", value: 0 },
 * 	{ name: "Item 1", value: 1 },
 * 	{ name: "Item 2", value: 2 },
 * ]} />
 *    ```
 */
export default class ComboBox extends SvelteComponentTyped<ComboBoxProps, ComboBoxEvents, ComboBoxSlots> {
}
export {};
