import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
        open?: boolean;
        closable?: boolean;
        placement?: "top" | "bottom" | "left" | "right";
        alignment?: "start" | "center" | "end";
        offset?: number;
        trapFocus?: boolean;
        class?: string;
        wrapperElement?: HTMLDivElement;
        anchorElement?: HTMLDivElement;
        menuElement?: HTMLDivElement;
        backdropElement?: HTMLDivElement;
    };
    events: {
        open: CustomEvent<any>;
        close: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
        override: {};
        flyout: {};
    };
};
export declare type FlyoutWrapperProps = typeof __propDef.props;
export declare type FlyoutWrapperEvents = typeof __propDef.events;
export declare type FlyoutWrapperSlots = typeof __propDef.slots;
/**
 * Flyouts represent a control that displays lightweight UI that is either information, or requires user interaction. Unlike a dialog, a Flyout can be dismissed by clicking or tapping outside of it, or pressing the Esc key. [Docs](https://fluent-svelte.vercel.app/docs/components/flyout)
 * - Usage:
 * ```tsx
 * <Flyout>
 *     <Button>Trigger Button</Button>
 *     <svelte:fragment slot="flyout">
 *         Flyout Contents
 *     </svelte:fragment>
 * </Flyout>
 * ```
 */
export default class FlyoutWrapper extends SvelteComponentTyped<FlyoutWrapperProps, FlyoutWrapperEvents, FlyoutWrapperSlots> {
}
export {};
