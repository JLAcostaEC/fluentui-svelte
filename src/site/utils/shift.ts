import { createNoise3D } from 'simplex-noise';
import type { Attachment } from 'svelte/attachments';
import { on } from 'svelte/events';

const circleCount = 150;
const circlePropCount = 8;
const circlePropsLength = circleCount * circlePropCount;
const baseSpeed = 0.05;
const rangeSpeed = 1;
const baseTTL = 150;
const rangeTTL = 200;
const baseRadius = 100;
const rangeRadius = 200;
const rangeHue = 20;
const xOff = 0.0015;
const yOff = 0.0015;
const zOff = 0.0015;
const backgroundColor = 'hsla(0,0%,5%,1)';
const frameInterval = 1000 / 30;

const { PI, cos, sin, abs, random } = Math;
const TAU = 2 * PI;
const rand = (n: number) => n * random();
const fadeInOut = (t: number, m: number) => {
	const hm = 0.5 * m;
	return abs(((t + hm) % m) - hm) / hm;
};

export const shiftBackground: Attachment<HTMLElement> = (node) => {
	let cancelStart: (() => void) | undefined;
	let destroy: (() => void) | undefined;

	function schedule() {
		// Keep canvas setup out of hydration and the initial resource load.
		if (typeof window.requestIdleCallback === 'function') {
			const id = window.requestIdleCallback(() => (destroy = setup(node)), { timeout: 1000 });
			cancelStart = () => window.cancelIdleCallback(id);
		} else {
			const id = window.setTimeout(() => (destroy = setup(node)), 0);
			cancelStart = () => window.clearTimeout(id);
		}
	}

	if (document.readyState === 'complete') schedule();
	const offLoad = document.readyState === 'complete' ? undefined : on(window, 'load', schedule, { once: true });

	return () => {
		offLoad?.();
		cancelStart?.();
		destroy?.();
	};
};

export function setup(container: HTMLElement) {
	// Each attachment owns its canvas, noise generator and animation loop.
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');
	if (!context) return () => {};
	const ctx = context;
	const noise = createNoise3D();
	const circleProps = new Float32Array(circlePropsLength);
	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
	let baseHue = 220;
	let animationRequest: number | undefined;
	let lastFrame: number | undefined;
	let width: number;
	let height: number;
	let scale: number;

	// Let the browser composite the blur instead of filtering a canvas copy every frame.
	canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;filter:blur(50px)';
	container.appendChild(canvas);
	resize();
	for (let i = 0; i < circlePropsLength; i += circlePropCount) initCircle(i);
	renderFrame(0);
	syncAnimation();

	const offResize = on(window, 'resize', () => {
		resize();
		for (let i = 0; i < circlePropsLength; i += circlePropCount) initCircle(i);
		renderFrame(0);
	});
	const offVisibility = on(document, 'visibilitychange', syncAnimation);
	const offMotion = on(reducedMotion, 'change', syncAnimation);

	return () => {
		offResize();
		offVisibility();
		offMotion();
		if (animationRequest !== undefined) cancelAnimationFrame(animationRequest);
		canvas.remove();
	};

	function initCircle(i: number) {
		const x = rand(width);
		const y = rand(height);
		const n = noise(x * xOff, y * yOff, baseHue * zOff);
		const t = rand(TAU);
		const speed = baseSpeed + rand(rangeSpeed);
		const vx = speed * cos(t);
		const vy = speed * sin(t);
		const ttl = baseTTL + rand(rangeTTL);
		const radius = baseRadius + rand(rangeRadius);
		const hue = baseHue + n * rangeHue;

		const life = reducedMotion.matches ? ttl / 2 : 0;
		circleProps.set([x, y, vx, vy, life, ttl, radius, hue], i);
	}

	function updateCircle(i: number, delta: number) {
		const x = circleProps[i];
		const y = circleProps[i + 1];
		const vx = circleProps[i + 2];
		const vy = circleProps[i + 3];
		const life = circleProps[i + 4];
		const ttl = circleProps[i + 5];
		const radius = circleProps[i + 6];
		const hue = circleProps[i + 7];

		ctx.fillStyle = `hsla(${hue},60%,30%,${fadeInOut(life, ttl)})`;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, TAU);
		ctx.fill();

		circleProps[i] = x + vx * delta;
		circleProps[i + 1] = y + vy * delta;
		circleProps[i + 4] = life + delta;

		if (x < -radius || x > width + radius || y < -radius || y > height + radius || life > ttl) {
			initCircle(i);
		}
	}

	function resize() {
		width = window.innerWidth;
		height = window.innerHeight;
		// A blurred background needs fewer pixels; cap work on large displays too.
		scale = Math.min(0.25, 480 / width, 270 / height);
		canvas.width = Math.max(1, Math.round(width * scale));
		canvas.height = Math.max(1, Math.round(height * scale));
		ctx.setTransform(scale, 0, 0, scale, 0, 0);
	}

	function renderFrame(delta: number) {
		ctx.fillStyle = backgroundColor;
		ctx.fillRect(0, 0, width, height);
		baseHue += delta;
		for (let i = 0; i < circlePropsLength; i += circlePropCount) updateCircle(i, delta);
	}

	function syncAnimation() {
		if (animationRequest !== undefined) cancelAnimationFrame(animationRequest);
		animationRequest = undefined;
		lastFrame = undefined;
		if (!document.hidden && !reducedMotion.matches) animationRequest = requestAnimationFrame(draw);
	}

	function draw(timestamp: number) {
		const elapsed = lastFrame === undefined ? frameInterval : timestamp - lastFrame;
		if (elapsed >= frameInterval - 1) {
			// Preserve the original 60 FPS movement speed, without catching up after a pause.
			renderFrame(Math.min(elapsed / (1000 / 60), 4));
			lastFrame = timestamp;
		}
		animationRequest = requestAnimationFrame(draw);
	}
}
