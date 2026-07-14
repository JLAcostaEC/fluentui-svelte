import { locators, type Locator } from 'vitest/browser';

// Components that render floating content (Flyout/Dialog) rely on floating-ui's
// `autoUpdate` and runed's `onClickOutside`, which schedule async work. When
// vitest-browser tears a test down mid-flight, Playwright aborts those pending
// operations and surfaces a benign "Cancelled" unhandled rejection. It does not
// reflect a test or component failure, so we mark only that specific noise as
// handled to keep the runner's exit code meaningful.
if (typeof window !== 'undefined') {
	window.addEventListener('unhandledrejection', (event) => {
		const reason = event.reason;
		const message = typeof reason === 'string' ? reason : (reason?.message ?? '');
		if (message.includes('Cancelled')) {
			event.preventDefault();
		}
	});
}

locators.extend({
	selector(selector) {
		return `css=${selector}`;
	}
});

declare module 'vitest/browser' {
	interface LocatorSelectors {
		selector: (selector: string) => Locator;
	}
}
