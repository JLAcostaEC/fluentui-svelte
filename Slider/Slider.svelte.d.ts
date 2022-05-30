import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
        value?: number;
        min?: number;
        max?: number;
        step?: number;
        ticks?: number[];
        tickPlacement?: "around" | "before" | "after";
        tooltip?: boolean;
        prefix?: string;
        suffix?: string;
        track?: boolean;
        orientation?: "vertical" | "horizontal";
        reverse?: boolean;
        disabled?: boolean;
        class?: string;
        inputElement?: HTMLInputElement;
        containerElement?: HTMLDivElement;
        tickBarElement?: HTMLDivElement;
        thumbElement?: HTMLDivElement;
        railElement?: HTMLDivElement;
        trackElement?: HTMLDivElement;
        stepUp?: () => void;
        stepDown?: () => void;
    };
    events: {
        change: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        tooltip: {
            prefix: string;
            suffix: string;
            value: number;
        };
    };
};
export declare type SliderProps = typeof __propDef.props;
export declare type SliderEvents = typeof __propDef.events;
export declare type SliderSlots = typeof __propDef.slots;
/**
 * A slider is a control that lets the user select from a range of values by moving a thumb control along a track. [Docs](https://fluent-svelte.vercel.app/docs/components/slider)
 * - Usage:
 * ```tsx
 * <Slider bind:value min={-100} max={100} step={10} ticks={[-50, 0, 50]} />
 * ```
 */
export default class Slider extends SvelteComponentTyped<SliderProps, SliderEvents, SliderSlots> {
    get stepUp(): () => void;
    get stepDown(): () => void;
}
export {};
