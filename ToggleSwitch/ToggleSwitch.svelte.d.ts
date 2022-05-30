import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
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
export declare type ToggleSwitchProps = typeof __propDef.props;
export declare type ToggleSwitchEvents = typeof __propDef.events;
export declare type ToggleSwitchSlots = typeof __propDef.slots;
/**
 * The toggle switch represents a physical switch that allows users to turn things on or off, like a light switch. Use toggle switch controls to present users with two mutually exclusive options (such as on/off), where choosing an option provides immediate results. [Docs](https://fluent-svelte.vercel.app/docs/components/radiobutton)
 * - Usage:
 * ```tsx
 * <ToggleSwitch bind:checked />
 * ```
 */
export default class ToggleSwitch extends SvelteComponentTyped<ToggleSwitchProps, ToggleSwitchEvents, ToggleSwitchSlots> {
}
export {};
