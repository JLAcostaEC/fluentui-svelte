import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
        expanded?: boolean;
        direction?: "down" | "up";
        headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
        class?: string;
        containerElement?: HTMLDivElement;
        headerElement?: HTMLDivElement;
        contentElement?: HTMLDivElement;
    };
    events: {
        expand: CustomEvent<any>;
        collapse: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        icon: {};
        default: {};
        content: {};
    };
};
export declare type ExpanderProps = typeof __propDef.props;
export declare type ExpanderEvents = typeof __propDef.events;
export declare type ExpanderSlots = typeof __propDef.slots;
/**
 * Expanders are controls that display a header and a collapsable content area. The content area can be expanded clicking on the header. [Docs](https://fluent-svelte.vercel.app/docs/components/expander)
 * - Usage:
 * ```tsx
 * <Expander>
 *     Header
 *     <svelte:fragment slot="content">
 *         Content
 *     </svelte:fragment>
 * </Expander>
 * ```
 */
export default class Expander extends SvelteComponentTyped<ExpanderProps, ExpanderEvents, ExpanderSlots> {
}
export {};
