<script lang="ts">
	import type { Snippet } from 'svelte';
	import CaretDownFilled from 'fluentui-icons-svelte/CaretDownFilled.svelte';
	import CaretUpFilled from 'fluentui-icons-svelte/CaretUpFilled.svelte';
	import { Button } from '$lib/index.js';
	import { on } from 'svelte/events';

	let {
		values = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')),
		selectedIndex = $bindable(0),
		disabledIndices = [],
		onSelected,
		visibleItems = 7,
		itemHeight = 40,
		infinite = true,
		inertia = true,
		children
	}: {
		values?: string[];
		selectedIndex?: number;
		/** Real (0-based, unwrapped) indices the carousel must never rest on. */
		disabledIndices?: number[];
		onSelected?: (value: string, index: number) => void;
		visibleItems?: number;
		itemHeight?: number;
		/** When false, the wheel is bounded (no wrap) and stops at the first/last item. */
		infinite?: boolean;
		/** When false, releasing snaps immediately with no momentum coasting. */
		inertia?: boolean;
		children?: Snippet<[{ value: string; index: number; selected: boolean }]>;
	} = $props();

	// Reactive state — read by the template and deriveds.
	let scrolling = $state(false);
	// Continuous position for smooth scrolling (in item units, unbounded for infinite scroll).
	// Starts centred on the initially-selected index.
	let displayPos = $state(selectedIndex);

	// Internal bookkeeping — never read reactively, so plain `let` skips the reactive overhead.
	let isTouching = false;
	let lastTouchY = 0;
	let touchSamples: { t: number; pos: number }[] = [];
	let targetPos = 0;
	let smoothRaf: number | undefined;
	let lastTime = 0;

	// Inertia
	let wheelTimestamps: number[] = [];
	let wheelDirections: number[] = [];
	let wheelEndTimer: ReturnType<typeof setTimeout> | undefined;
	let inertiaVelocity = 0;

	const halfVisible = $derived(Math.floor(visibleItems / 2));
	const containerHeight = $derived(visibleItems * itemHeight);
	// Absolute (unwrapped) index of the centred slot — drives the virtual items and the
	// stable, unique DOM ids / aria-activedescendant target.
	const centerIndex = $derived(Math.round(displayPos));
	const disabledSet = $derived(new Set(disabledIndices));
	const maxPos = $derived(values.length - 1);

	// Map an (unbounded) slot index to a real value index: wrap when infinite, clamp when not.
	function wrapIndex(index: number): number {
		const n = values.length;
		return infinite ? ((index % n) + n) % n : Math.max(0, Math.min(n - 1, index));
	}

	// Clamp a continuous position to the valid range when the carousel is bounded.
	function clampPos(pos: number): number {
		return infinite ? pos : Math.max(0, Math.min(maxPos, pos));
	}

	// Generate virtual items around displayPos for rendering
	const virtualItems = $derived.by(() => {
		const items: { value: string; realIndex: number; visualOffset: number; key: number }[] = [];
		const buffer = halfVisible + 3;
		for (let i = -buffer; i <= buffer; i++) {
			const itemIndex = centerIndex + i;
			// Bounded mode renders empty space past the ends instead of wrapping around.
			if (!infinite && (itemIndex < 0 || itemIndex >= values.length)) continue;
			const realIndex = wrapIndex(itemIndex);
			// Position relative to display center
			const visualOffset = (itemIndex - displayPos) * itemHeight;
			// Key by the absolute (unwrapped) index so each slot keeps its DOM node while
			// scrolling — only its offset moves — instead of remounting at every half-item step.
			items.push({ value: values[realIndex], realIndex, visualOffset, key: itemIndex });
		}
		return items;
	});

	const currentSelectedIndex = $derived(wrapIndex(centerIndex));

	// Commit the item nearest `pos` as the selection, notifying the consumer once.
	function commitIndex(pos: number) {
		const newIndex = wrapIndex(Math.round(pos));
		if (newIndex !== selectedIndex) {
			selectedIndex = newIndex;
			onSelected?.(values[newIndex], newIndex);
		}
	}

	// Nearest integer position to `pos` whose (wrapped) item is enabled, searching outward
	// with a bias toward `dir`. Returns Math.round(pos) when nothing is disabled (or all is).
	function nearestEnabled(pos: number, dir = 1) {
		const base = Math.round(pos);
		const n = values.length;
		if (disabledSet.size === 0 || disabledSet.size >= n) return base;
		if (!disabledSet.has(wrapIndex(base))) return base;
		const step = dir >= 0 ? 1 : -1;
		for (let d = 1; d <= n; d++) {
			if (!disabledSet.has(wrapIndex(base + d * step))) return base + d * step;
			if (!disabledSet.has(wrapIndex(base - d * step))) return base - d * step;
		}
		return base;
	}

	function startSmoothLoop() {
		if (smoothRaf) return;
		lastTime = performance.now();
		function tick(now: number) {
			const dt = Math.min(now - lastTime, 50) / 16.67; // normalize to ~60fps
			lastTime = now;

			if (inertiaVelocity !== 0) {
				// Inertia mode: apply velocity with decay
				inertiaVelocity *= Math.pow(0.93, dt);
				if (Math.abs(inertiaVelocity) < 0.01) {
					// Snap to the nearest enabled item, keeping the coasting direction.
					targetPos = nearestEnabled(displayPos, inertiaVelocity);
					inertiaVelocity = 0;
				} else {
					targetPos = clampPos(targetPos + inertiaVelocity * dt);
					displayPos = clampPos(displayPos + inertiaVelocity * dt);
				}
			}

			// Lerp displayPos toward targetPos
			const diff = targetPos - displayPos;
			if (Math.abs(diff) < 0.001) {
				displayPos = targetPos;
				commitIndex(targetPos);
				if (inertiaVelocity === 0) {
					smoothRaf = undefined;
					scrolling = false;
					return;
				}
			} else {
				displayPos += diff * Math.min(0.25 * dt, 1);
				commitIndex(displayPos);
			}

			smoothRaf = requestAnimationFrame(tick);
		}
		smoothRaf = requestAnimationFrame(tick);
	}

	function moveBy(delta: number) {
		targetPos = clampPos(nearestEnabled(targetPos + delta, delta));
		inertiaVelocity = 0;
		startSmoothLoop();
	}

	function stopSmooth() {
		if (smoothRaf) {
			cancelAnimationFrame(smoothRaf);
			smoothRaf = undefined;
		}
		inertiaVelocity = 0;
	}

	function handleWheel(e: WheelEvent) {
		e.preventDefault();
		stopSmooth();
		scrolling = true;

		const now = performance.now();
		const direction = e.deltaY > 0 ? 1 : -1;

		wheelTimestamps.push(now);
		wheelDirections.push(direction);

		// Keep only recent events
		const cutoff = now - 300;
		while (wheelTimestamps.length > 0 && wheelTimestamps[0] < cutoff) {
			wheelTimestamps.shift();
			wheelDirections.shift();
		}

		// Move directly 1 step
		targetPos = clampPos(targetPos + direction);
		displayPos = clampPos(displayPos + direction);
		commitIndex(displayPos);

		clearTimeout(wheelEndTimer);
		wheelEndTimer = setTimeout(() => {
			// Calculate inertia from recent events (only when inertia is enabled).
			if (inertia && wheelTimestamps.length >= 3) {
				const elapsed = wheelTimestamps[wheelTimestamps.length - 1] - wheelTimestamps[0];
				if (elapsed > 0) {
					const avgDir = wheelDirections.reduce((a, b) => a + b, 0) / wheelDirections.length;
					const rate = wheelTimestamps.length / elapsed; // events per ms
					const vel = avgDir * rate * 16 * 1.5; // per-frame velocity
					if (Math.abs(vel) > 0.3) {
						inertiaVelocity = vel;
						targetPos = displayPos;
						startSmoothLoop();
					} else {
						// Snap to nearest enabled item
						targetPos = clampPos(nearestEnabled(displayPos, direction));
						startSmoothLoop();
					}
				}
			} else {
				targetPos = clampPos(nearestEnabled(displayPos, direction));
				startSmoothLoop();
			}
			wheelTimestamps = [];
			wheelDirections = [];
		}, 80);
	}

	function handleTouchStart(e: TouchEvent) {
		e.preventDefault();
		stopSmooth();
		scrolling = true;
		isTouching = true;
		lastTouchY = e.touches[0].clientY;
		touchSamples = [{ t: performance.now(), pos: displayPos }];
	}

	function handleTouchMove(e: TouchEvent) {
		if (!isTouching) return;
		e.preventDefault();
		const y = e.touches[0].clientY;
		// Drag 1:1 with the finger by moving the continuous position directly.
		displayPos = clampPos(displayPos - (y - lastTouchY) / itemHeight);
		lastTouchY = y;
		commitIndex(displayPos);

		const now = performance.now();
		touchSamples.push({ t: now, pos: displayPos });
		const cutoff = now - 90;
		while (touchSamples.length > 2 && touchSamples[0].t < cutoff) touchSamples.shift();
	}

	function handleTouchEnd() {
		if (!isTouching) return;
		isTouching = false;

		// Release velocity in item-units per frame (~60fps reference) from recent samples.
		let velocity = 0;
		if (touchSamples.length >= 2) {
			const first = touchSamples[0];
			const last = touchSamples[touchSamples.length - 1];
			const dt = Math.max(1, last.t - first.t);
			velocity = ((last.pos - first.pos) / dt) * 16;
		}
		touchSamples = [];

		if (inertia && Math.abs(velocity) > 0.05) {
			// Fling: coast with momentum; the inertia loop snaps to the nearest enabled item.
			inertiaVelocity = velocity;
			targetPos = displayPos;
		} else {
			// Released at rest: snap straight to the nearest enabled item.
			inertiaVelocity = 0;
			targetPos = clampPos(nearestEnabled(displayPos, 1));
		}
		startSmoothLoop();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			moveBy(-1);
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			moveBy(1);
		}
	}

	// Attach wheel/touch listeners imperatively so they are non-passive: Svelte's declarative
	// on* handlers are passive by default for these events, which forbids preventDefault().
	function bindGestures(node: HTMLDivElement) {
		const off = [
			on(node, 'wheel', handleWheel, { passive: false }),
			on(node, 'touchstart', handleTouchStart, { passive: false }),
			on(node, 'touchmove', handleTouchMove, { passive: false }),
			on(node, 'touchend', handleTouchEnd),
			on(node, 'touchcancel', handleTouchEnd)
		];
		return () => off.forEach((remove) => remove());
	}

	// Stop any in-flight animation frame and pending wheel-inertia timer on unmount.
	$effect(() => {
		return () => {
			if (smoothRaf) cancelAnimationFrame(smoothRaf);
			clearTimeout(wheelEndTimer);
		};
	});
</script>

<div class="fs-dynamic-carousel" style:--item-height="{itemHeight}px" style:--container-height="{containerHeight}px">
	<Button class="fs-dynamic-carousel-btn" appearance="subtle" aria-label="Previous" onclick={() => moveBy(-1)}>
		<CaretUpFilled />
	</Button>
	<div
		class={['fs-dynamic-carousel-viewport', { scrolling }]}
		{@attach bindGestures}
		onkeydown={handleKeydown}
		role="listbox"
		tabindex="0"
		aria-label="Selector"
		aria-activedescendant="carousel-item-{centerIndex}"
	>
		<div class="fs-dynamic-carousel-track">
			{#each virtualItems as item (item.key)}
				<div
					id="carousel-item-{item.key}"
					class={[
						'fs-dynamic-carousel-item',
						item.realIndex === currentSelectedIndex && 'selected',
						disabledSet.has(item.realIndex) && 'disabled'
					]}
					role="option"
					tabindex="-1"
					aria-selected={item.realIndex === currentSelectedIndex}
					aria-disabled={disabledSet.has(item.realIndex)}
					style:top="{halfVisible * itemHeight + item.visualOffset}px"
					onclick={() => {
						const offset = Math.round(item.visualOffset / itemHeight);
						moveBy(offset);
					}}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							const offset = Math.round(item.visualOffset / itemHeight);
							moveBy(offset);
						}
					}}
				>
					{#if children}
						{@render children({
							value: item.value,
							index: item.realIndex,
							selected: item.realIndex === currentSelectedIndex
						})}
					{:else}
						{item.value}
					{/if}
				</div>
			{/each}
		</div>
	</div>
	<Button class="fs-dynamic-carousel-btn" appearance="subtle" aria-label="Next" onclick={() => moveBy(1)}>
		<CaretDownFilled />
	</Button>
</div>

<style>
	.fs-dynamic-carousel {
		display: flex;
		flex-direction: column;
		align-items: center;
		user-select: none;
		width: fit-content;
		position: relative;
		& :global(.fs-button.fs-dynamic-carousel-btn) {
			padding: 0.6rem;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			z-index: 10;
			justify-content: center;
			align-items: center;
			visibility: hidden;
			background: var(--fs-acrylic-background-default);
			&::before {
				content: '';
				border-radius: calc(var(--fs-control-overlay-border-radius) - 0.063rem);
				width: 100%;
				height: 100%;
				position: absolute;
				inset: 0;
				background: var(--fs-acrilic-noise);
				background-size: 2.5rem;
				opacity: 0.1;
				filter: grayscale(1);
				z-index: 0;
				pointer-events: none;
			}
			&:last-child {
				top: auto;
				bottom: 0;
			}

			& :global(svg) {
				width: 16px;
				height: 16px;
			}
		}
		&:hover :global(.fs-dynamic-carousel-btn) {
			visibility: visible !important;
		}
	}

	.fs-dynamic-carousel-viewport {
		height: var(--container-height);
		position: relative;
		touch-action: none;
		outline: none;
		overflow: hidden;
		width: 100%;
	}

	.fs-dynamic-carousel-track {
		position: relative;
		height: 100%;
	}

	.fs-dynamic-carousel-item {
		position: absolute;
		left: 0;
		right: 0;
		height: var(--item-height);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		border-radius: var(--fs-control-border-radius);
		color: var(--fs-text-secondary);

		&.selected {
			color: var(--fs-text-on-accent-primary);
		}
		&.disabled {
			color: var(--fs-text-disabled);
			pointer-events: none;
		}
		&:hover:not(.selected) {
			background: var(--fs-control-fill-secondary);
		}

		.scrolling & {
			pointer-events: none;
		}
	}
</style>
