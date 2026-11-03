import { cdp, page } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { tick } from 'svelte';
import { render } from 'vitest-browser-svelte';
import DialogTestWrapper from './DialogTestWrapper.svelte';
import type { DialogAnimation, DialogDuration } from '../types.js';

const frame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
const element = () => page.selector('dialog.fs-dialog').element() as HTMLDialogElement;
const motions = () =>
	document.getAnimations().filter((motion) => (motion.effect as KeyframeEffect).target === element());
const surfaceTransitions = () => motions().filter((animation) => !(animation.effect as KeyframeEffect).pseudoElement);
const pause = () => {
	const animations = motions();
	animations.forEach((animation) => animation.pause());
	return animations;
};
const finish = async () => {
	motions().forEach((animation) => animation.finish());
	await frame();
};
const systemMotion = (reduce: boolean) =>
	(cdp() as unknown as { send(method: string, params: unknown): Promise<unknown> }).send('Emulation.setEmulatedMedia', {
		features: [{ name: 'prefers-reduced-motion', value: reduce ? 'reduce' : 'no-preference' }]
	});
let originalPreference: string | undefined;
beforeEach(async () => {
	originalPreference = document.documentElement.dataset.fsReducedMotion;
	delete document.documentElement.dataset.fsReducedMotion;
	await systemMotion(false);
});
afterEach(async () => {
	if (originalPreference === undefined) delete document.documentElement.dataset.fsReducedMotion;
	else document.documentElement.dataset.fsReducedMotion = originalPreference;
	await systemMotion(false);
});

describe('CSS starting-style motion', () => {
	it.each<DialogAnimation>(['fade', 'zoom', 'slide', 'bounce'])(
		'animates %s on entrance and exit',
		async (animation) => {
			const screen = await render(DialogTestWrapper, { animation, duration: 1000 });
			screen.component.openDialog();
			await tick();
			pause();
			const entrance = surfaceTransitions();
			expect(entrance.every((motion) => motion instanceof CSSTransition)).toBe(true);
			const opacity = entrance.find((motion) => (motion as CSSTransition).transitionProperty === 'opacity')!;
			expect(opacity.effect?.getTiming().duration).toBe(1000);
			opacity.currentTime = 0;
			expect(Number(getComputedStyle(element()).opacity)).toBeCloseTo(0);
			const transform = entrance.find((motion) => (motion as CSSTransition).transitionProperty === 'transform');
			expect(!!transform).toBe(animation !== 'fade');
			if (transform) {
				transform.currentTime = 0;
				const matrix = new DOMMatrix(getComputedStyle(element()).transform);
				if (animation === 'slide') expect(matrix.m42).toBeCloseTo(16);
				else expect(matrix.m11).toBeCloseTo(animation === 'zoom' ? 0.88 : 0.96);
			}
			await finish();
			expect(Number(getComputedStyle(element()).opacity)).toBe(1);

			screen.component.closeDialog();
			await tick();
			pause();
			expect(element().open).toBe(false);
			expect(getComputedStyle(element()).display).not.toBe('none');
			const exit = surfaceTransitions();
			expect(exit.some((motion) => (motion as CSSTransition).transitionProperty === 'display')).toBe(true);
			expect(exit.some((motion) => (motion as CSSTransition).transitionProperty === 'overlay')).toBe(true);
			expect(
				exit.find((motion) => (motion as CSSTransition).transitionProperty === 'opacity')?.effect?.getTiming().duration
			).toBe(1000);
			await finish();
			expect(getComputedStyle(element()).display).toBe('none');
		}
	);

	it('fades the native backdrop on entrance and exit', async () => {
		const screen = await render(DialogTestWrapper, { animation: 'fade', duration: 1000 });
		screen.component.openDialog();
		await tick();
		pause();
		expect(motions().some((motion) => (motion.effect as KeyframeEffect).pseudoElement === '::backdrop')).toBe(true);
		await finish();
		screen.component.closeDialog();
		await tick();
		pause();
		expect(motions().some((motion) => (motion.effect as KeyframeEffect).pseudoElement === '::backdrop')).toBe(true);
		await finish();
	});

	it('reverses a closing transition without a jump or a delayed close', async () => {
		const onOpenChange = vi.fn();
		const screen = await render(DialogTestWrapper, { animation: 'fade', duration: 1000, onOpenChange });
		screen.component.openDialog();
		await tick();
		await finish();
		screen.component.closeDialog();
		await tick();
		pause().forEach((motion) => (motion.currentTime = 400));
		const opacity = Number(getComputedStyle(element()).opacity);
		screen.component.openDialog();
		await tick();
		pause().forEach((motion) => (motion.currentTime = 0));
		expect(Number(getComputedStyle(element()).opacity)).toBeCloseTo(opacity, 1);
		await finish();
		expect(element().matches(':modal')).toBe(true);
		expect(element().open).toBe(true);
		expect(onOpenChange.mock.calls).toEqual([[true], [false], [true]]);
	});

	it('slides top-positioned dialogs from above', async () => {
		const screen = await render(DialogTestWrapper, { animation: 'slide', position: 'top-end', duration: 1000 });
		screen.component.openDialog();
		await tick();
		pause().forEach((motion) => (motion.currentTime = 0));
		expect(new DOMMatrix(getComputedStyle(element()).transform).m42).toBeCloseTo(-16);
		await finish();
	});

	it('animates controlled non-modal dialogs in both directions', async () => {
		const screen = await render(DialogTestWrapper, { type: 'non-modal', animation: 'fade', duration: 1000 });
		screen.component.setOpen(true);
		await tick();
		pause();
		expect(surfaceTransitions().length).toBeGreaterThan(0);
		await finish();
		screen.component.setOpen(false);
		await tick();
		pause();
		expect(getComputedStyle(element()).display).not.toBe('none');
		await finish();
		expect(getComputedStyle(element()).display).toBe('none');
	});

	it.each<[DialogDuration, string, string]>([
		[125, '', '0.125s'],
		['fast', '--fs-fast-duration: 72ms;', '0.072s'],
		['normal', '--fs-normal-duration: 333ms;', '0.333s'],
		['slow', '--fs-slow-duration: 500ms;', '0.5s'],
		['slower', '--fs-slower-duration: 1s;', '1s'],
		['very-slow', '--fs-very-slow-duration: 2s;', '2s'],
		['extra-slow', '--fs-extra-slow-duration: 3s;', '3s'],
		['--custom-duration', '--custom-duration: 0.25s;', '0.25s']
	])('resolves duration %s through CSS', async (duration, style, expected) => {
		await render(DialogTestWrapper, { duration, surfaceProps: { style } });
		expect(getComputedStyle(element()).transitionDuration.split(',')[0].trim()).toBe(expected);
	});

	it.each(['app', 'system'])('disables numeric motion for the %s reduced-motion preference', async (source) => {
		if (source === 'app') document.documentElement.dataset.fsReducedMotion = 'true';
		else await systemMotion(true);
		const screen = await render(DialogTestWrapper, { animation: 'bounce', duration: 1000 });
		screen.component.openDialog();
		await tick();
		expect(getComputedStyle(element()).transitionDuration.split(',')[0].trim()).toBe('0s');
		expect(motions()).toHaveLength(0);
		screen.component.closeDialog();
		await tick();
		expect(getComputedStyle(element()).display).toBe('none');
	});

	it('honors an explicit app preference for motion over the OS preference', async () => {
		await systemMotion(true);
		document.documentElement.dataset.fsReducedMotion = 'false';
		const screen = await render(DialogTestWrapper, { duration: 1000 });
		screen.component.openDialog();
		await tick();
		pause();
		expect(surfaceTransitions().length).toBeGreaterThan(0);
		await finish();
	});
});
