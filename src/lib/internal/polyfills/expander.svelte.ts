import { on } from 'svelte/events';
import { DURATION } from '$constants';
import type { EASING, YDirection } from '$types';

// Thanks to CSS-Tricks for the Expander example. https://css-tricks.com/how-to-animate-the-details-element/
export class Expander {
	details: HTMLDetailsElement;
	summary: HTMLElement | null;
	content: HTMLElement | null;
	animation: Animation | null;
	isClosing: boolean;
	isExpanding: boolean;
	duration: number;
	easing: EASING | string;
	direction: YDirection;
	cleanEvent: () => void;
	reducedMotion: () => boolean;
	get effectiveDuration(): number {
		return this.reducedMotion() ? DURATION.REDUCED : this.duration;
	}

	constructor(
		element: HTMLDetailsElement | null,
		direction: YDirection = 'down',
		duration: number = DURATION.NORMAL,
		easing: EASING | string = 'ease-out',
		reducedMotion: () => boolean = () => false
	) {
		if (!element) {
			throw new Error('Expander: Missing details element');
		}
		this.details = element;
		this.summary = element.querySelector('summary');
		this.content = element.querySelector('.content');
		this.animation = null;
		this.isClosing = false;
		this.isExpanding = false;
		this.duration = duration;
		this.easing = easing;
		this.direction = direction;
		this.reducedMotion = reducedMotion;
		if (!this.summary || !this.content) {
			throw new Error('Expander: Missing summary or content element');
		}
		this.cleanEvent = on(this.summary, 'click', (e) => this.onClick(e));
	}

	onClick(e: MouseEvent) {
		e.preventDefault();
		// Add an overflow on the <details> to avoid content overflowing
		this.details.style.overflow = 'hidden';
		if (this.isClosing || !this.details.open) {
			this.open();
		} else if (this.isExpanding || this.details.open) {
			this.shrink();
		}
	}

	shrink() {
		this.isClosing = true;

		const startHeight = `${this.details.offsetHeight}px`;
		const endHeight = `${this.summary?.offsetHeight}px`;

		if (this.animation) {
			// If there is already an animation running, cancel the current animation
			this.animation.cancel();
		}

		// Start a WAAPI animation
		this.animation = this.details.animate(
			{
				// Set the keyframes from the startHeight to endHeight
				height: [startHeight, endHeight]
			},
			{
				duration: this.effectiveDuration,
				easing: this.easing
			}
		);

		this.animation.onfinish = () => this.onAnimationFinish(false);
		this.animation.oncancel = () => (this.isClosing = false);
	}

	open() {
		this.details.style.height = `${this.details.offsetHeight}px`;
		this.details.open = true;
		window.requestAnimationFrame(() => this.expand());
	}

	expand() {
		this.isExpanding = true;
		const startHeight = `${this.details.offsetHeight}px`;
		const endHeight = `${this.summary!.offsetHeight + this.content!.offsetHeight}px`;

		if (this.animation) {
			this.animation.cancel();
		}

		this.animation = this.details.animate(
			{
				height: [startHeight, endHeight]
			},
			{
				duration: this.effectiveDuration,
				easing: this.easing
			}
		);
		this.animation.onfinish = () => this.onAnimationFinish(true);
		this.animation.oncancel = () => (this.isExpanding = false);
	}

	onAnimationFinish(open: boolean) {
		this.details.open = open;
		this.animation = null;
		this.isClosing = false;
		this.isExpanding = false;
		this.details.style.height = this.details.style.overflow = '';
	}
}
