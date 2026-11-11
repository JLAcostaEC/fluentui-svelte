import { page, userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { MediaPlayer } from '#lib/index.js';
import MediaPlayerTestWrapper from './MediaPlayerTestWrapper.svelte';

const TRACK = 'data:text/vtt,WEBVTT%0A%0A00:00.000 --> 00:01.000%0AHello';

/** Wide enough for the standard layout to keep every button. */
const WIDE = { wrapperAttributes: { style: 'width: 40rem' } };

const button = (name: string) => page.getByRole('button', { name, exact: true });
const video = () => page.selector('video');

/** One second of silent WAV audio: a media with a timeline, for the cues to become active. */
function silence() {
	const rate = 8000;
	const view = new DataView(new ArrayBuffer(44 + rate));
	const text = (offset: number, value: string) =>
		[...value].forEach((char, index) => view.setUint8(offset + index, char.charCodeAt(0)));
	text(0, 'RIFF');
	view.setUint32(4, 36 + rate, true);
	text(8, 'WAVEfmt ');
	view.setUint32(16, 16, true);
	view.setUint16(20, 1, true);
	view.setUint16(22, 1, true);
	view.setUint32(24, rate, true);
	view.setUint32(28, rate, true);
	view.setUint16(32, 1, true);
	view.setUint16(34, 8, true);
	text(36, 'data');
	view.setUint32(40, rate, true);
	for (let index = 0; index < rate; index++) view.setUint8(44 + index, 128);
	return URL.createObjectURL(new Blob([view], { type: 'audio/wav' }));
}

/** Seeks into the first cue of a loaded media: the cues become active once the time moves. */
async function showFirstCue() {
	await expect.element(video()).toBeInTheDocument();
	const media = video().element() as HTMLVideoElement;
	await expect.poll(() => media.readyState).toBeGreaterThan(0);
	media.currentTime = 0.5;
}

describe('rendering', () => {
	it('renders a named region around a native video', async () => {
		render(MediaPlayer);
		await expect.element(page.getByRole('region', { name: 'Media player' })).toBeInTheDocument();
		await expect.element(video()).toBeInTheDocument();
	});

	it('takes its accessible name from label', async () => {
		render(MediaPlayer, { label: 'Trailer' });
		await expect.element(page.getByRole('region', { name: 'Trailer' })).toBeInTheDocument();
	});

	it('applies the other attributes to the video', async () => {
		render(MediaPlayer, { src: 'movie.mp4', poster: 'poster.jpg', preload: 'none' });
		await expect.element(video()).toHaveAttribute('src', 'movie.mp4');
		await expect.element(video()).toHaveAttribute('poster', 'poster.jpg');
		await expect.element(video()).toHaveAttribute('preload', 'none');
		await expect.element(video()).not.toHaveAttribute('controls');
	});

	it('shows the time at zero before the media loads', async () => {
		render(MediaPlayer);
		await expect.element(page.getByText('00:00:00').first()).toBeInTheDocument();
	});
});

describe('the standard layout', () => {
	it('shows the play button between the skip buttons', async () => {
		render(MediaPlayer, WIDE);
		await expect.element(button('Play')).toBeInTheDocument();
		await expect.element(button('Skip back 10 seconds')).toBeInTheDocument();
		await expect.element(button('Skip forward 30 seconds')).toBeInTheDocument();
	});

	it('names the skip buttons after their seconds', async () => {
		render(MediaPlayer, { ...WIDE, skipBackward: 15, skipForward: 15 });
		await expect.element(button('Skip back 15 seconds')).toBeInTheDocument();
		await expect.element(button('Skip forward 15 seconds')).toBeInTheDocument();
	});

	it('hides a skip button set to 0', async () => {
		render(MediaPlayer, { ...WIDE, skipBackward: 0 });
		await expect.element(button('Play')).toBeInTheDocument();
		await expect.element(button('Skip back 10 seconds')).not.toBeInTheDocument();
	});

	it('disables the seek bar until the media has a duration', async () => {
		render(MediaPlayer);
		await expect.element(page.getByRole('slider', { name: 'Seek' })).toBeDisabled();
	});
});

describe('the compact layout', () => {
	it('keeps play and the seek bar, without the skip buttons', async () => {
		render(MediaPlayer, { layout: 'compact' });
		await expect.element(button('Play')).toBeInTheDocument();
		await expect.element(page.getByRole('slider', { name: 'Seek' })).toBeInTheDocument();
		await expect.element(button('Skip back 10 seconds')).not.toBeInTheDocument();
	});
});

describe('volume', () => {
	it('opens a volume slider and closes it with Escape', async () => {
		render(MediaPlayer);
		const volume = button('Volume');

		await volume.click();
		await expect.element(page.getByRole('slider', { name: 'Volume' })).toBeInTheDocument();
		await expect.element(volume).toHaveAttribute('aria-expanded', 'true');

		await userEvent.keyboard('{Escape}');
		await expect.element(page.getByRole('slider', { name: 'Volume' })).not.toBeInTheDocument();
		await expect.element(volume).toHaveFocus();
	});

	it('mutes the video from the volume popup', async () => {
		render(MediaPlayer);
		await button('Volume').click();

		await button('Mute').click();

		await expect.poll(() => (document.querySelector('video') as HTMLVideoElement).muted).toBe(true);
		await expect.element(button('Unmute')).toHaveAttribute('aria-pressed', 'true');
	});
});

describe('subtitles', () => {
	it('shows no subtitles button without tracks', async () => {
		render(MediaPlayer);
		await expect.element(button('Play')).toBeInTheDocument();
		await expect.element(button('Subtitles')).not.toBeInTheDocument();
	});

	it('toggles a single track', async () => {
		render(MediaPlayer, { ...WIDE, tracks: [{ src: TRACK, srclang: 'en', label: 'English' }] });
		const subtitles = button('Subtitles');

		await expect.element(subtitles).toHaveAttribute('aria-pressed', 'false');
		await subtitles.click();
		await expect.element(subtitles).toHaveAttribute('aria-pressed', 'true');
	});

	it('picks one of several tracks from a menu', async () => {
		render(MediaPlayer, {
			...WIDE,
			tracks: [
				{ src: TRACK, srclang: 'en', label: 'English' },
				{ src: TRACK, srclang: 'es', label: 'Español' }
			]
		});

		await button('Subtitles').click();

		// Off, then one item per track. The items are matched by their text: their accessible name comes from Menu.
		await expect.element(page.getByRole('menuitemradio').nth(2)).toBeInTheDocument();
		await expect.element(page.getByRole('menuitemradio').first()).toHaveTextContent('Off');
		await expect.element(page.getByRole('menuitemradio').first()).toHaveAttribute('aria-checked', 'true');
		await expect.element(page.getByRole('menuitemradio').nth(2)).toHaveTextContent('Español');
	});

	it('draws the cues in an acrylic panel of medium size by default', async () => {
		render(MediaPlayer, {
			src: silence(),
			tracks: [{ src: TRACK, srclang: 'en', label: 'English', default: true }]
		});
		await showFirstCue();
		const captions = page.selector('.fs-media-player-captions');

		await expect.element(captions).toHaveTextContent('Hello');
		await expect.element(captions).toHaveClass('appearance-acrylic', 'size-medium');
	});

	it('takes the appearance and the size of the subtitles', async () => {
		render(MediaPlayer, {
			src: silence(),
			subtitlesAppearance: 'translucent',
			subtitlesSize: 'small',
			tracks: [{ src: TRACK, srclang: 'en', label: 'English', default: true }]
		});
		await showFirstCue();

		await expect
			.element(page.selector('.fs-media-player-captions'))
			.toHaveClass('appearance-translucent', 'size-small');
	});
});

describe('Video.js', () => {
	it('gives the player a store once it has loaded', async () => {
		render(MediaPlayer);
		await expect
			.poll(() => (document.querySelector('video-player') as { store?: unknown } | null)?.store)
			.toBeDefined();
	});
});

describe('dragging the volume slider', () => {
	it('keeps the value it is dragged to', async () => {
		render(MediaPlayer);
		await button('Volume').click();
		const slider = page.getByRole('slider', { name: 'Volume' });
		await expect.element(slider).toBeInTheDocument();

		const thumb = document.querySelector('.fs-media-player-volume-slider .slider-thumb') as HTMLElement;
		const rail = (document.querySelector('.fs-media-player-volume-slider') as HTMLElement).getBoundingClientRect();
		const at = (x: number) => ({ clientX: x, clientY: rail.top + rail.height / 2, bubbles: true });
		thumb.dispatchEvent(new MouseEvent('mousedown', at(rail.right)));
		window.dispatchEvent(new MouseEvent('mousemove', at(rail.left + rail.width * 0.6)));
		window.dispatchEvent(new MouseEvent('mousemove', at(rail.left + rail.width * 0.3)));
		window.dispatchEvent(new MouseEvent('mouseup', at(rail.left + rail.width * 0.3)));

		await expect.poll(() => (document.querySelector('video') as HTMLVideoElement).volume).toBeLessThan(0.5);
		await expect.element(slider).not.toHaveValue('100');
	});
});

describe('vertical volume', () => {
	it('draws the volume slider upright', async () => {
		render(MediaPlayer, { volumeOrientation: 'vertical' });
		await button('Volume').click();
		await expect.element(page.selector('.fs-media-player-volume-flyout.orientation-vertical')).toBeInTheDocument();
	});
});

describe('tooltips', () => {
	it('shows the name of a control on hover', async () => {
		render(MediaPlayer, WIDE);
		await button('Play').hover();
		await expect.element(page.getByRole('tooltip')).toHaveTextContent('Play');
	});
});

describe('previous and next', () => {
	it('shows no buttons without callbacks', async () => {
		render(MediaPlayer, WIDE);
		await expect.element(button('Play')).toBeInTheDocument();
		await expect.element(button('Previous')).not.toBeInTheDocument();
		await expect.element(button('Next')).not.toBeInTheDocument();
	});

	it('calls onPrevious and onNext', async () => {
		const onPrevious = vi.fn();
		const onNext = vi.fn();
		render(MediaPlayer, { ...WIDE, onPrevious, onNext });

		await button('Previous').click();
		await button('Next').click();

		expect(onPrevious).toHaveBeenCalledOnce();
		expect(onNext).toHaveBeenCalledOnce();
	});
});

describe('more options', () => {
	it('lists the playback speeds it is given', async () => {
		render(MediaPlayer, { ...WIDE, playbackRates: [1, 2] });
		await button('More options').click();
		await expect.element(page.getByRole('menuitemradio')).toHaveLength(2);
	});

	it('disappears without speeds or custom items', async () => {
		render(MediaPlayer, { ...WIDE, playbackRates: [] });
		await expect.element(button('Play')).toBeInTheDocument();
		await expect.element(button('More options')).not.toBeInTheDocument();
	});
});

describe('custom content', () => {
	it('renders custom controls in every group', async () => {
		render(MediaPlayerTestWrapper);
		await expect.element(button('Repeat')).toBeInTheDocument();
		await expect.element(button('Chapters')).toBeInTheDocument();
		await expect.element(button('Share')).toBeInTheDocument();
	});

	it('hands the store to custom controls', async () => {
		const onShare = vi.fn();
		render(MediaPlayerTestWrapper, { onShare });
		await expect
			.poll(() => (document.querySelector('video-player') as { store?: unknown } | null)?.store)
			.toBeDefined();

		await button('Share').click();

		expect(onShare).toHaveBeenCalledWith(0);
	});

	it('adds custom items to the more options menu', async () => {
		render(MediaPlayerTestWrapper, { playbackRates: [] });
		await button('More options').click();
		await expect.element(page.getByRole('menuitem')).toHaveTextContent('Download');
	});
});

describe('gestures', () => {
	it('marks the controls as interactive: a tap on them is not a tap on the video', async () => {
		render(MediaPlayer);
		await expect.element(page.selector('.fs-media-player-controls')).toHaveAttribute('data-interactive');
	});
});

describe('labels', () => {
	it('names the controls with the given texts', async () => {
		render(MediaPlayer, {
			...WIDE,
			labels: { play: 'Reproducir', skipBackward: (seconds: number) => `Retroceder ${seconds} segundos` }
		});
		await expect.element(button('Reproducir')).toBeInTheDocument();
		await expect.element(button('Retroceder 10 segundos')).toBeInTheDocument();
	});

	it('falls back to English for the texts left out', async () => {
		render(MediaPlayer, { ...WIDE, labels: { play: 'Reproducir' } });
		await expect.element(button('Skip forward 30 seconds')).toBeInTheDocument();
	});

	it('shows the given text in the tooltip', async () => {
		render(MediaPlayer, { ...WIDE, labels: { play: 'Reproducir' } });
		await button('Reproducir').hover();
		await expect.element(page.getByRole('tooltip')).toHaveTextContent('Reproducir');
	});

	it('hands the final texts to custom content', async () => {
		render(MediaPlayerTestWrapper, { labels: { next: 'Siguiente' } });
		await expect.element(page.getByText('labels: Siguiente / Previous')).toBeInTheDocument();
	});
});

describe('deferred', () => {
	it('shows a splash with a play button and no video', async () => {
		render(MediaPlayer, { src: 'movie.mp4', poster: 'poster.jpg', deferred: 'click' });
		await expect.element(page.getByRole('region', { name: 'Media player' })).toBeInTheDocument();
		await expect.element(button('Play')).toBeInTheDocument();
		expect(document.querySelector('video')).toBeNull();
		expect(document.querySelector('.fs-media-player-splash-poster')?.getAttribute('src')).toBe('poster.jpg');
	});

	it('keeps the aspect ratio it is given', async () => {
		render(MediaPlayer, { deferred: 'click', aspectRatio: '4 / 3' });
		await expect.element(page.selector('.fs-media-player-splash')).toHaveStyle({ aspectRatio: '4 / 3' });
	});

	it('replaces the splash with the player on press, and moves the focus to its play button', async () => {
		render(MediaPlayer, { src: 'movie.mp4', deferred: 'click' });

		await button('Play').click();

		await expect.element(video()).toBeInTheDocument();
		await expect.element(video()).toHaveAttribute('src', 'movie.mp4');
		expect(document.querySelector('.fs-media-player-splash')).toBeNull();
		await expect.element(page.selector('.fs-button.play')).toHaveFocus();
	});

	it('names the splash button with the given texts', async () => {
		render(MediaPlayer, { deferred: 'intent', label: 'Tráiler', labels: { play: 'Reproducir' } });
		await expect.element(page.getByRole('region', { name: 'Tráiler' })).toBeInTheDocument();
		await expect.element(button('Reproducir')).toBeInTheDocument();
	});
});

describe('repeat', () => {
	it('shows no repeat button by default', async () => {
		render(MediaPlayer, WIDE);
		await expect.element(button('Play')).toBeInTheDocument();
		await expect.element(button('Repeat')).not.toBeInTheDocument();
	});

	it('toggles loop on the video', async () => {
		render(MediaPlayer, { ...WIDE, showRepeat: true });
		const repeat = button('Repeat');

		await expect.element(repeat).toHaveAttribute('aria-pressed', 'false');
		await repeat.click();

		await expect.element(repeat).toHaveAttribute('aria-pressed', 'true');
		await expect.poll(() => (document.querySelector('video') as HTMLVideoElement | null)?.loop).toBe(true);
	});
});

describe('loading', () => {
	it('shows the poster until Video.js has loaded, then the video', async () => {
		render(MediaPlayer, { src: 'movie.mp4', poster: 'poster.jpg' });
		await expect.element(video()).toBeInTheDocument();
		expect(document.querySelector('.fs-media-player-placeholder')).toBeNull();
	});

	it('loads without the container warning of Video.js', async () => {
		const warn = vi.spyOn(console, 'warn');
		render(MediaPlayer, { src: 'movie.mp4' });
		await expect
			.poll(() => (document.querySelector('video-player') as { store?: unknown } | null)?.store)
			.toBeDefined();
		await expect.element(video()).toBeInTheDocument();
		expect(warn.mock.calls.flat().join(' ')).not.toContain('requires a container element');
		warn.mockRestore();
	});
});

describe('deferred focus', () => {
	it('moves the focus to the play button without opening its tooltip', async () => {
		render(MediaPlayer, { src: 'movie.mp4', deferred: 'click' });
		await expect.element(button('Play')).toBeInTheDocument();
		// Video.js is loaded by an earlier test or now: either way the press ends on the play button of the controls.
		await button('Play').click();

		await expect.element(page.selector('.fs-button.play')).toHaveFocus();
		await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
		expect([...document.querySelectorAll('.fs-tooltip:not(.tooltip-hidden)')].map((t) => t.textContent)).not.toContain(
			'Pause'
		);
	});
});

describe('controls visibility', () => {
	it('keeps the controls of a paused media on screen by default', async () => {
		render(MediaPlayer);
		await expect.element(page.selector('.fs-media-player-controls')).toHaveAttribute('data-visible');
	});

	it('keeps the controls on screen when they do not hide', async () => {
		render(MediaPlayer, { autoHideControls: false, autoHideWhenPaused: true });
		await expect.element(page.selector('.fs-media-player-controls')).toHaveAttribute('data-visible');
	});
});
