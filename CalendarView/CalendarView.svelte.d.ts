import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
        locale?: string;
        multiple?: boolean;
        headers?: boolean;
        value?: Date | Date[] | null;
        blackout?: Date[];
        min?: Date;
        max?: Date;
        view?: "days" | "months" | "years";
        weekStart?: number;
        __floating?: boolean;
        class?: string;
        element?: HTMLDivElement;
    };
    events: {
        change: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type CalendarViewProps = typeof __propDef.props;
export declare type CalendarViewEvents = typeof __propDef.events;
export declare type CalendarViewSlots = typeof __propDef.slots;
/**
 * A calendar view lets a user view and interact with a calendar that they can navigate by month, year, or decade. A user can select a single date or multiple dates. [Docs](https://fluent-svelte.vercel.app/docs/components/calendarview)
 * - Usage:
 * ```tsx
 * <CalendarView value={new Date(2022, 2, 14)} />
 * ```
 */
export default class CalendarView extends SvelteComponentTyped<CalendarViewProps, CalendarViewEvents, CalendarViewSlots> {
}
export {};
