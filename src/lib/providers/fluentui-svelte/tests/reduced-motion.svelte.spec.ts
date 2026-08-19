import { cdp, page } from 'vitest/browser';
import { flushSync } from 'svelte';
import { beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import { Expander, fadeScale, flyToOffset } from '$internal';
import ReducedMotionProbe from './ReducedMotionProbe.svelte';
import ReducedMotionTestWrapper from './ReducedMotionTestWrapper.svelte';

/** Mounts the provider and flushes its effects, so the reads below see the settled value. */
const mount = () => {
	render(ReducedMotionTestWrapper);
	flushSync();
};

/**
 * Says what the OS says. The provider takes no prop any more, so emulating the media query is the
 * only way left to put the system on one side of a disagreement. `CDPSession` ships untyped, which
 * is what the cast is for.
 */
const systemAsksForReducedMotion = (reduce: boolean) =>
	(cdp() as unknown as { send(method: string, params?: unknown): Promise<unknown> }).send(
		'Emulation.setEmulatedMedia',
		{ features: [{ name: 'prefers-reduced-motion', value: reduce ? 'reduce' : 'no-preference' }] }
	);

/** Runs `fn` against an attached element, since transitions read computed styles. */
const withElement = <T>(fn: (node: HTMLElement) => T): T => {
	const node = document.createElement('div');
	document.body.appendChild(node);

	try {
		return fn(node);
	} finally {
		node.remove();
	}
};

/** Builds the DOM shape `Expander` requires, and cleans up after itself. */
const withDetails = <T>(fn: (details: HTMLDetailsElement) => T): T => {
	const details = document.createElement('details');
	details.innerHTML = '<summary>Header</summary><div class="content">Content</div>';
	document.body.appendChild(details);

	try {
		return fn(details);
	} finally {
		details.remove();
	}
};

/**
 * Both the preference and the emulated media query outlive a component teardown, so each test starts
 * from "nobody has answered and the OS is quiet" rather than from what the previous one left behind.
 */
beforeEach(async () => {
	localStorage.clear();
	await systemAsksForReducedMotion(false);
});

describe('the global context is the source', () => {
	it('is what a child reads through the context', async () => {
		mount();
		await page.getByTestId('reduce').click();

		await expect.element(page.getByTestId('from-context')).toHaveTextContent('true');
	});

	it('is what getReducedMotion() hands to transitions and classes', async () => {
		mount();
		await page.getByTestId('reduce').click();

		await expect.element(page.getByTestId('from-getter')).toHaveTextContent('true');
	});

	it('keeps the getter live across setReducedMotion()', async () => {
		mount();
		await page.getByTestId('reduce').click();

		await expect.element(page.getByTestId('from-context')).toHaveTextContent('true');
		await expect.element(page.getByTestId('from-getter')).toHaveTextContent('true');
	});

	it('remembers the preference across mounts, because it is persisted', async () => {
		mount();
		await page.getByTestId('reduce').click();
		cleanup();

		mount();
		await expect.element(page.getByTestId('from-getter')).toHaveTextContent('true');
	});

	it('falls back to the media query with no provider mounted', async () => {
		render(ReducedMotionProbe);
		flushSync();

		await expect.element(page.getByTestId('from-context')).toHaveTextContent('undefined');
		await expect.element(page.getByTestId('from-getter')).toHaveTextContent('false');
	});

	it('is published on the root element for CSS to follow', async () => {
		mount();
		await page.getByTestId('reduce').click();

		await expect.element(page.getByTestId('from-context')).toHaveTextContent('true');
		expect(document.documentElement.dataset.fsReducedMotion).toBe('true');
	});
});

describe('the app preference outranks the system', () => {
	it('follows the system while no preference has been given', async () => {
		await systemAsksForReducedMotion(true);
		mount();

		await expect.element(page.getByTestId('from-getter')).toHaveTextContent('true');
		expect(document.documentElement.dataset.fsReducedMotion).toBe('true');
	});

	it('keeps motion full when the app says so and the system says reduce', async () => {
		await systemAsksForReducedMotion(true);
		mount();
		await page.getByTestId('restore').click();

		await expect.element(page.getByTestId('from-context')).toHaveTextContent('false');
		await expect.element(page.getByTestId('from-getter')).toHaveTextContent('false');
		expect(document.documentElement.dataset.fsReducedMotion).toBe('false');
	});

	it('hands the decision back to the system when the preference is cleared', async () => {
		await systemAsksForReducedMotion(true);
		mount();
		await page.getByTestId('restore').click();
		await expect.element(page.getByTestId('from-getter')).toHaveTextContent('false');

		await page.getByTestId('follow-system').click();

		await expect.element(page.getByTestId('from-getter')).toHaveTextContent('true');
	});
});

describe('what the components hand down', () => {
	it('collapses fadeScale to no duration', async () => {
		expect(withElement((node) => fadeScale(node, { duration: 333, reducedMotion: true }).duration)).toBe(0);
	});

	it('collapses flyToOffset to no duration', async () => {
		expect(withElement((node) => flyToOffset(node, { duration: 333, y: 10, reducedMotion: true }).duration)).toBe(0);
	});

	it('leaves the durations alone otherwise', async () => {
		expect(withElement((node) => fadeScale(node, { duration: 333, reducedMotion: false }).duration)).toBe(333);
		expect(withElement((node) => flyToOffset(node, { duration: 333, y: 10 }).duration)).toBe(333);
	});

	it('collapses the expander polyfill duration', async () => {
		expect(withDetails((details) => new Expander(details, 'down', 400, 'ease-out', () => true).effectiveDuration)).toBe(
			0
		);
	});

	it('re-reads the expander getter on every animation', async () => {
		let reduced = false;

		withDetails((details) => {
			const expander = new Expander(details, 'down', 400, 'ease-out', () => reduced);
			expect(expander.effectiveDuration).toBe(400);

			reduced = true;
			expect(expander.effectiveDuration).toBe(0);
		});
	});
});
