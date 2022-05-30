import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
        value: Date | null;
        open?: boolean;
        locale?: string;
        placeholder?: string;
        disabled?: boolean;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type CalendarDatePickerProps = typeof __propDef.props;
export declare type CalendarDatePickerEvents = typeof __propDef.events;
export declare type CalendarDatePickerSlots = typeof __propDef.slots;
export default class CalendarDatePicker extends SvelteComponentTyped<CalendarDatePickerProps, CalendarDatePickerEvents, CalendarDatePickerSlots> {
}
export {};
