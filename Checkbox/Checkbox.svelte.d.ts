import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
        checked?: boolean;
        indeterminate?: boolean;
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
export declare type CheckboxProps = typeof __propDef.props;
export declare type CheckboxEvents = typeof __propDef.events;
export declare type CheckboxSlots = typeof __propDef.slots;
/**
 * Checkboxes represent a control that a user can select (check) or clear (uncheck). A Checkbox can also report its value as indeterminate. [Docs](https://fluent-svelte.vercel.app/docs/components/checkbox)
 * - Usage:
 * ```tsx
 * <Checkbox bind:checked />
 * ```
 */
export default class Checkbox extends SvelteComponentTyped<CheckboxProps, CheckboxEvents, CheckboxSlots> {
}
export {};
