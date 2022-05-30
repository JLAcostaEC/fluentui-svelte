import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
        group?: any;
        checked?: boolean;
        value?: any;
        disabled?: boolean;
        class?: string;
        inputElement?: HTMLInputElement;
        containerElement?: HTMLLabelElement;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type RadioButtonProps = typeof __propDef.props;
export declare type RadioButtonEvents = typeof __propDef.events;
export declare type RadioButtonSlots = typeof __propDef.slots;
/**
 * Radio buttons, also called option buttons, let users select one option from a collection of two or more mutually exclusive, but related, options. The singular behavior of a RadioButtons group distinguishes it from check boxes, which support multi-selection and deselection, or clearing. [Docs](https://fluent-svelte.vercel.app/docs/components/radiobutton)
 * - Usage:
 * ```tsx
 * <script>
 *     import { RadioButton } from "fluent-svelte";
 *
 *     let flavor = "chocolate";
 * </script>
 *
 * <RadioButton bind:group={flavor} value="chocolate">Chocolate</RadioButton>
 * <RadioButton bind:group={flavor} value="vanilla">Vanilla</RadioButton>
 * <RadioButton bind:group={flavor} value="strawberry">Strawberry</RadioButton>
 * ```
 */
export default class RadioButton extends SvelteComponentTyped<RadioButtonProps, RadioButtonEvents, RadioButtonSlots> {
}
export {};
