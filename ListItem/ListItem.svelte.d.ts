import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
        selected?: boolean;
        disabled?: boolean;
        href?: string;
        role?: string;
        class?: string;
        element?: HTMLAnchorElement | HTMLLIElement;
    };
    events: {
        select: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        icon: {};
        default: {};
    };
};
export declare type ListItemProps = typeof __propDef.props;
export declare type ListItemEvents = typeof __propDef.events;
export declare type ListItemSlots = typeof __propDef.slots;
/**
 * List Items display data stacked vertically in a single column. List Items work better for items that have text as a focal point, and for collections that are meant to be read top to bottom (i.e. alphabetically ordered). A few common use cases for List Items include lists of messages and search results. [Docs](https://fluent-svelte.vercel.app/docs/components/listitem)
 * - Usage:
 * ```tsx
 * <ListItem>Text</ListItem>
 * ```
 */
export default class ListItem extends SvelteComponentTyped<ListItemProps, ListItemEvents, ListItemSlots> {
}
export {};
