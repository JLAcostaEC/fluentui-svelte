import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
        severity?: "attention" | "success" | "caution" | "critical" | "information";
        class?: string;
        element?: HTMLSpanElement;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type InfoBadgeProps = typeof __propDef.props;
export declare type InfoBadgeEvents = typeof __propDef.events;
export declare type InfoBadgeSlots = typeof __propDef.slots;
/**
 * InfoBadges are a non-intrusive and intuitive way to display notifications or bring focus to an area within an app - whether that be for notifications, indicating new content, or showing an alert. [Docs](https://fluent-svelte.vercel.app/docs/components/infobadge)
 * - Usage:
 * ```tsx
 * <InfoBadge />
 * <InfoBadge severity="success" />
 * <InfoBadge>0</InfoBadge>
 * ```
 */
export default class InfoBadge extends SvelteComponentTyped<InfoBadgeProps, InfoBadgeEvents, InfoBadgeSlots> {
}
export {};
