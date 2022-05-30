import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
        value?: number;
        size?: number;
        class?: string;
        element?: SVGElement;
        circleElement?: SVGCircleElement;
    };
    events: {
        change: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type ProgressRingProps = typeof __propDef.props;
export declare type ProgressRingEvents = typeof __propDef.events;
export declare type ProgressRingSlots = typeof __propDef.slots;
/**
 * ProgressRing provides visual feedback to to the user that a long-running operation is underway. It can mean that the user cannot interact with the app when the progress indicator is visible, and can also indicate how long the wait time might be. [Docs](https://fluent-svelte.vercel.app/docs/components/progressring)
 * - Usage:
 * ```tsx
 * <ProgressRing />
 * <ProgressRing value={50} />
 * ```
 */
export default class ProgressRing extends SvelteComponentTyped<ProgressRingProps, ProgressRingEvents, ProgressRingSlots> {
}
export {};
