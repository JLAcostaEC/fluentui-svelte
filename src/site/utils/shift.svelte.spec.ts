import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setup, shiftBackground } from './shift.js';

let container: HTMLDivElement;
let cleanups: (() => void)[];
let frames: Map<number, FrameRequestCallback>;
let motion: MediaQueryList;

beforeEach(() => {
	container = document.createElement('div');
	document.body.appendChild(container);
	cleanups = [];
	frames = new Map();
	let id = 0;
	vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
		frames.set(++id, callback);
		return id;
	});
	vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id));
	vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
	motion = Object.assign(new EventTarget(), { matches: false }) as MediaQueryList;
	vi.spyOn(window, 'matchMedia').mockReturnValue(motion);
});

afterEach(() => {
	for (const cleanup of cleanups) cleanup();
	container.remove();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

function attach() {
	const cleanup = shiftBackground(container);
	if (cleanup) cleanups.push(cleanup);
	return cleanup!;
}

function frame(timestamp: number) {
	const pending = [...frames];
	for (const [id, callback] of pending) {
		frames.delete(id);
		callback(timestamp);
	}
}

describe('shift background lifecycle', () => {
	it('waits for load and idle time, and cancels pending setup on detach', () => {
		vi.spyOn(document, 'readyState', 'get').mockReturnValue('loading');
		const idle = vi.fn(() => 7);
		const cancelIdle = vi.fn();
		vi.stubGlobal('requestIdleCallback', idle);
		vi.stubGlobal('cancelIdleCallback', cancelIdle);
		const detach = attach();
		expect(idle).not.toHaveBeenCalled();
		document.defaultView!.dispatchEvent(new Event('load'));
		expect(idle).toHaveBeenCalledOnce();
		expect(container.querySelector('canvas')).toBeNull();
		detach();
		expect(cancelIdle).toHaveBeenCalledWith(7);
	});

	it('removes the load listener when detached before load', () => {
		vi.spyOn(document, 'readyState', 'get').mockReturnValue('loading');
		const idle = vi.fn();
		vi.stubGlobal('requestIdleCallback', idle);
		attach()();
		window.dispatchEvent(new Event('load'));
		expect(idle).not.toHaveBeenCalled();
		expect(container.querySelector('canvas')).toBeNull();
	});

	it('starts in an idle callback and releases its canvas and animation on detach', () => {
		vi.spyOn(document, 'readyState', 'get').mockReturnValue('complete');
		let start: IdleRequestCallback;
		vi.stubGlobal('requestIdleCallback', (callback: IdleRequestCallback) => {
			start = callback;
			return 7;
		});
		vi.stubGlobal('cancelIdleCallback', vi.fn());
		const detach = attach();
		start!({ didTimeout: false, timeRemaining: () => 50 });
		expect(container.querySelectorAll('canvas')).toHaveLength(1);
		expect(frames.size).toBe(1);
		detach();
		expect(container.querySelector('canvas')).toBeNull();
		expect(frames.size).toBe(0);
		window.dispatchEvent(new Event('resize'));
		motion.dispatchEvent(new Event('change'));
		expect(frames.size).toBe(0);
	});

	it('uses a cancellable timer when requestIdleCallback is unavailable', () => {
		vi.spyOn(document, 'readyState', 'get').mockReturnValue('complete');
		vi.stubGlobal('requestIdleCallback', undefined);
		const timer = vi.fn(() => 9);
		vi.stubGlobal('setTimeout', timer);
		const cancel = vi.spyOn(window, 'clearTimeout');
		attach()();
		expect(timer).toHaveBeenCalledWith(expect.any(Function), 0);
		expect(cancel).toHaveBeenCalledWith(9);
		expect(container.querySelector('canvas')).toBeNull();
	});

	it('pauses while hidden and resumes without advancing through the hidden time', () => {
		cleanups.push(setup(container));
		frame(0);
		vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
		document.dispatchEvent(new Event('visibilitychange'));
		expect(frames.size).toBe(0);
		vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
		document.dispatchEvent(new Event('visibilitychange'));
		expect(frames.size).toBe(1);
		frame(60_000);
		expect(frames.size).toBe(1);
	});

	it('renders a static background for reduced motion and responds to preference changes', () => {
		Object.assign(motion, { matches: true });
		cleanups.push(setup(container));
		expect(container.querySelector('canvas')).not.toBeNull();
		expect(frames.size).toBe(0);
		Object.assign(motion, { matches: false });
		motion.dispatchEvent(new Event('change'));
		expect(frames.size).toBe(1);
		Object.assign(motion, { matches: true });
		motion.dispatchEvent(new Event('change'));
		expect(frames.size).toBe(0);
	});

	it('keeps concurrent instances independent and lowers the canvas pixel count', () => {
		const first = setup(container);
		cleanups.push(first, setup(container));
		const canvases = container.querySelectorAll('canvas');
		expect(canvases).toHaveLength(2);
		expect(canvases[0].width * canvases[0].height).toBeLessThan(window.innerWidth * window.innerHeight);
		first();
		expect(container.querySelectorAll('canvas')).toHaveLength(1);
		frame(0);
		expect(frames.size).toBe(1);
	});

	it('keeps the static background visible after resizing from desktop to mobile', () => {
		Object.assign(motion, { matches: true });
		vi.spyOn(Math, 'random').mockReturnValue(0.5);
		vi.stubGlobal('innerWidth', 1600);
		vi.stubGlobal('innerHeight', 900);
		cleanups.push(setup(container));
		vi.stubGlobal('innerWidth', 390);
		vi.stubGlobal('innerHeight', 844);
		window.dispatchEvent(new Event('resize'));
		const canvas = container.querySelector('canvas')!;
		const pixel = canvas
			.getContext('2d')!
			.getImageData(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2), 1, 1).data;
		expect(pixel[2]).toBeGreaterThan(pixel[0]);
		expect(frames.size).toBe(0);
	});
});
