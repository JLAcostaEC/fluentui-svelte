/** Converts a pixel value (number, string, or getter function) to a `rem` string. */
export const pxToRem = (px: number | string | (() => number | string), base = 16) => {
	if (typeof px === 'function') {
		px = px();
	}
	return `${((typeof px === 'string' ? parseInt(px) : px) / base).toFixed(2)}rem`;
};

/** Rounds a pixel value to the nearest physical pixel based on the device pixel ratio. */
export const roundByDPR = (value: number, element?: Element) => {
	const dpr = element?.ownerDocument.defaultView?.devicePixelRatio || window.devicePixelRatio || 1;
	return Math.round(value * dpr) / dpr;
};

/** Converts a kebab-case string to Title Case (e.g. `'my-label'` → `'My Label'`). */
export const capitalize = (str: string) => {
	return str
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ');
};

export const getInitials = (name: string, max: number = 2) => {
	return name
		.split(' ')
		.map((n, i) => (i < max ? n[0] : ''))
		.join('');
};

type EventHandler<E extends Event> = (this: unknown, event: E) => void;

/** Wraps a handler so it fires at most once, then becomes a no-op. */
export function once<E extends Event>(fn: EventHandler<E> | null): EventHandler<E> {
	return function (this: unknown, event: E) {
		if (fn) {
			fn.call(this, event);
			fn = null;
		}
	};
}

/** Wraps a handler to call `preventDefault()` before invoking it. */
export function preventDefault<E extends Event = Event>(fn: EventHandler<E>): EventHandler<E> {
	return function (this: unknown, event: E) {
		event.preventDefault();
		fn.call(this, event);
	};
}

/**
 * Dispatches an event to a list of callbacks.
 * If any blocker in `blockers` is true, calls `preventDefault()` and skips the callbacks.
 */
export const invokeHandlers = <T extends Event>(
	e: T,
	blockers: boolean | (boolean | undefined)[] = [],
	callbacks: Array<((event: any) => void) | unknown> = []
) => {
	if ((Array.isArray(blockers) ? blockers : [blockers]).some(Boolean)) return e.preventDefault();

	for (const cb of callbacks) {
		if (typeof cb === 'function') cb(e);
	}
};

/** Returns `true` if the object has no own enumerable keys (also handles `null`/`undefined`). */
export const isObjectEmpty = (obj: Record<string, unknown> | null | undefined): boolean =>
	Object.keys(obj || {}).length === 0;

/** Returns the value of a CSS custom property as milliseconds. */
export function getCSSDuration(property: string, element: Element = document.documentElement): number {
	const raw = window.getComputedStyle(element).getPropertyValue(property).trim();
	const value = parseFloat(raw);
	if (isNaN(value)) return 0;
	return raw.endsWith('ms') ? value : value * 1000;
}
