import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
        selected?: boolean;
        disabled?: boolean;
        blackout?: boolean;
        current?: boolean;
        outOfRange?: boolean;
        variant?: "day" | "monthYear";
        header?: string;
    };
    events: {
        click: MouseEvent;
        keydown: KeyboardEvent;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type CalendarViewItemProps = typeof __propDef.props;
export declare type CalendarViewItemEvents = typeof __propDef.events;
export declare type CalendarViewItemSlots = typeof __propDef.slots;
export default class CalendarViewItem extends SvelteComponentTyped<CalendarViewItemProps, CalendarViewItemEvents, CalendarViewItemSlots> {
}
export {};
