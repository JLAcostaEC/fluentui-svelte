import type { SvelteComponent } from "svelte";
import type { Options as FocusTrapOptions } from "focus-trap";
export { default as ComboBoxItem } from "./ComboBox/ComboBoxItem.svelte";
export { default as FlyoutSurface } from "./Flyout/FlyoutSurface.svelte";
export { default as TooltipSurface } from "./Tooltip/TooltipSurface.svelte";
export { default as MenuFlyoutSurface } from "./MenuFlyout/MenuFlyoutSurface.svelte";
export { default as CalendarViewItem } from "./CalendarView/CalendarViewItem.svelte";
interface ExternalMouseEventOptions {
    type?: string;
    stopPropagation?: boolean;
}
export declare function externalMouseEvents(node: HTMLElement, options?: ExternalMouseEventOptions): {
    destroy(): void;
};
export declare function focusTrap(node: HTMLElement, options?: FocusTrapOptions): {
    destroy(): void;
};
export declare function uid(prefix: string): string;
interface ArrowNavigationOptions {
    preventTab?: boolean;
    stopPropagation?: boolean;
}
export declare function arrowNavigation(node: HTMLElement, options?: ArrowNavigationOptions): {
    destroy: () => void;
};
export declare function getCSSDuration(property: any): number;
export declare function createEventForwarder(component: SvelteComponent, exclude?: string[]): (node: HTMLElement | SVGElement) => {
    destroy: () => void;
};
