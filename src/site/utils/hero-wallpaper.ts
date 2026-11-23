import { on } from 'svelte/events';
import type { generateAccentRamp } from './accent-ramp.js';

type Ramp = ReturnType<typeof generateAccentRamp>;
const frameInterval = 1000 / 30;
const samples = 72;
const waveCount = 28;
const bandStops = [5, 4, 3, 2, 1, 0];

function wave(progress: number, layer: number, phase: number) {
	return (
		Math.sin(progress * 3.4 + phase + layer * 0.31) * 0.15 +
		Math.sin(progress * 7.1 - phase * 1.3 + layer * 0.18) * 0.042 -
		progress * 0.16
	);
}

const rgba = (color: Ramp[number], alpha: number) => 'rgba(' + color.join(', ') + ', ' + alpha + ')';

export function startWallpaper(bands: HTMLCanvasElement, lines: HTMLCanvasElement) {
	const background = bands.getContext('2d');
	const foreground = lines.getContext('2d');
	let colors: Ramp = [];
	let visible = false;
	let still = true;
	let frame: number | undefined;
	let lastFrame: number | undefined;
	let phase = 0.95;

	function paint() {
		if (!background || !foreground || !colors.length) return;

		const { width: bw, height: bh } = bands;
		const { width: fw, height: fh } = lines;
		background.clearRect(0, 0, bw, bh);
		foreground.clearRect(0, 0, fw, fh);

		for (const [layer, index] of bandStops.entries()) {
			const baseline = 0.48 + layer * 0.072;
			const thickness = bh * (0.19 - layer * 0.017);
			const color = colors[index];
			const opacity = 0.82 - layer * 0.092;
			const y = (progress: number) => bh * (baseline + wave(progress, layer, phase + layer * 0.6));
			const wash = background.createLinearGradient(0, 0, bw, 0);
			wash.addColorStop(0, rgba(color, opacity * 0.62));
			wash.addColorStop(0.44, rgba(color, opacity));
			wash.addColorStop(1, rgba(color, opacity * 0.7));

			background.beginPath();
			background.moveTo(0, y(0));
			for (let step = 1; step <= samples; step++) {
				const progress = step / samples;
				background.lineTo(progress * bw, y(progress));
			}
			for (let step = samples; step >= 0; step--) {
				const progress = step / samples;
				background.lineTo(
					progress * bw,
					y(progress) + thickness * (0.8 + Math.cos(progress * 5 + phase + layer) * 0.2)
				);
			}
			background.closePath();
			background.fillStyle = wash;
			background.fill();
		}

		const highlight = foreground.createLinearGradient(0, 0, fw, 0);
		highlight.addColorStop(0, rgba(colors[0], 0));
		highlight.addColorStop(0.55, rgba(colors[0], 0.28));
		highlight.addColorStop(1, rgba(colors[0], 0));
		foreground.strokeStyle = highlight;
		foreground.lineWidth = 1.15;

		for (let i = 0; i < waveCount; i++) {
			const baseline = 0.48 + i * 0.016;
			const y = (progress: number) => fh * (baseline + wave(progress, i * 0.18, phase) * (1.05 + i * 0.018));
			foreground.globalAlpha = 1 - 0.55 * Math.abs((i / (waveCount - 1)) * 2 - 1);
			foreground.beginPath();
			foreground.moveTo(0, y(0));
			for (let step = 1; step <= samples; step++) {
				const progress = step / samples;
				foreground.lineTo(progress * fw, y(progress));
			}
			foreground.stroke();
		}
		foreground.globalAlpha = 1;
	}

	function fit() {
		const { width, height } = lines.getBoundingClientRect();
		const scale = Math.min(window.devicePixelRatio, 1.5, 1800 / Math.max(width, 1));
		bands.width = Math.max(1, Math.round(width / 4));
		bands.height = Math.max(1, Math.round(height / 4));
		lines.width = Math.max(1, Math.round(width * scale));
		lines.height = Math.max(1, Math.round(height * scale));
		paint();
	}

	function tick(timestamp: number) {
		const elapsed = lastFrame === undefined ? frameInterval : timestamp - lastFrame;
		if (elapsed >= frameInterval - 1) {
			phase += Math.min(elapsed, 100) * 0.00015;
			paint();
			lastFrame = timestamp;
		}
		frame = requestAnimationFrame(tick);
	}

	function sync() {
		const animate = !still && visible && !document.hidden && !!background && !!foreground;
		if (animate && frame === undefined) frame = requestAnimationFrame(tick);
		if (!animate && frame !== undefined) {
			cancelAnimationFrame(frame);
			frame = undefined;
			lastFrame = undefined;
		}
	}

	const size = new ResizeObserver(fit);
	const visibility = new IntersectionObserver(([entry]) => {
		visible = entry.isIntersecting;
		sync();
	});
	const stopListening = on(document, 'visibilitychange', sync);
	size.observe(lines);
	visibility.observe(lines);
	fit();

	return {
		update(next: Ramp, reduced: boolean) {
			colors = next;
			still = reduced;
			paint();
			sync();
		},
		destroy() {
			size.disconnect();
			visibility.disconnect();
			stopListening();
			if (frame !== undefined) cancelAnimationFrame(frame);
		}
	};
}
