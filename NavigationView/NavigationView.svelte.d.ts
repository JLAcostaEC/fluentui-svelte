import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        variant?: "default" | "compact" | "minimal";
        expanded?: boolean;
        menuButton?: boolean;
        backButton?: boolean;
    };
    events: {
        back: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        header: {};
        items: {};
        footer: {};
        default: {};
    };
};
export declare type NavigationViewProps = typeof __propDef.props;
export declare type NavigationViewEvents = typeof __propDef.events;
export declare type NavigationViewSlots = typeof __propDef.slots;
export default class NavigationView extends SvelteComponentTyped<NavigationViewProps, NavigationViewEvents, NavigationViewSlots> {
}
export {};
