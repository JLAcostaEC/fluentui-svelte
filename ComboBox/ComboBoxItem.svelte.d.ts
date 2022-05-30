import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
        selected?: boolean;
        disabled?: boolean;
        class?: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        icon: {};
        default: {};
    };
};
export declare type ComboBoxItemProps = typeof __propDef.props;
export declare type ComboBoxItemEvents = typeof __propDef.events;
export declare type ComboBoxItemSlots = typeof __propDef.slots;
export default class ComboBoxItem extends SvelteComponentTyped<ComboBoxItemProps, ComboBoxItemEvents, ComboBoxItemSlots> {
}
export {};
