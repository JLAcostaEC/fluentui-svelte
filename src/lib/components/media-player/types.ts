import type { Component, Snippet } from 'svelte';
import type { HTMLAttributes, HTMLVideoAttributes } from 'svelte/elements';
import type { Placement } from '@floating-ui/dom';
import type { VideoPlayerElement } from '@videojs/html/video';
import type { ButtonProps } from '../button/types.ts';
import type { Sizes } from '#types';

/** The Video.js store of a player: its state and its actions. */
export type MediaPlayerStore = VideoPlayerElement['store'];

/** What custom content receives to read and drive the player. */
export type MediaPlayerRenderState = {
	/** The Video.js store, `null` until the player has loaded in the browser. */
	store: MediaPlayerStore | null;
	/** The layout of the transport controls. */
	layout: 'standard' | 'compact';
	/** Whether the player is narrower than 26rem, where the standard layout keeps only the essential buttons. */
	narrow: boolean;
	/** The texts of the player, the given ones over the English defaults, to name custom controls alike. */
	labels: MediaPlayerLabels;
};

/** The texts of a MediaPlayer: the names and tooltips of its controls, its menus and its messages. */
export type MediaPlayerLabels = {
	play: string;
	pause: string;
	previous: string;
	next: string;
	/** Receives the seconds of the button. */
	skipBackward: (seconds: number) => string;
	/** Receives the seconds of the button. */
	skipForward: (seconds: number) => string;
	seek: string;
	/** What a screen reader says for the seek bar. Receives the formatted time and duration. */
	seekValue: (time: string, duration: string) => string;
	volume: string;
	mute: string;
	unmute: string;
	repeat: string;
	subtitles: string;
	/** The item of the subtitles menu that hides them. */
	subtitlesOff: string;
	pictureInPicture: string;
	exitPictureInPicture: string;
	fullScreen: string;
	exitFullScreen: string;
	moreOptions: string;
	playbackSpeed: string;
	/** The playback speed of 1. */
	normalSpeed: string;
	/** The name of the buffering indicator. */
	loading: string;
	/** The title of the message shown when the media fails. */
	error: string;
	dismiss: string;
	/** The message shown when the scripts of the player fail to download. */
	loadError: string;
	/** The button that downloads the scripts of the player again. */
	retry: string;
};

/** Custom content for the transport controls: a snippet or a component that receives the render state. */
export type MediaPlayerContent = Snippet<[MediaPlayerRenderState]> | Component<MediaPlayerRenderState>;

/** A text track of the media, rendered as a `<track>` element. */
export type MediaPlayerTrack = {
	/** The URL of the WebVTT file. */
	src: string;
	/** What the track is used for.
	 * @default 'subtitles'
	 */
	kind?: 'subtitles' | 'captions' | 'chapters' | 'metadata' | 'descriptions';
	/** The language of the track, as a BCP 47 tag. */
	srclang?: string;
	/** The name the subtitles menu shows for the track. */
	label?: string;
	/** Shows the track when the media loads. */
	default?: boolean;
};

/** @propsmith MediaPlayerProps */
export type MediaPlayerProps = {
	/** The URL of the media to play. */
	src?: string;
	/** The image shown until the media plays. */
	poster?: string;
	/** The text tracks of the media: subtitles, captions or chapters.
	 * @type MediaPlayerTrack[]
	 */
	tracks?: MediaPlayerTrack[];
	/** How the transport controls are laid out.
	 *
	 * `standard`: the seek bar on top, with the time, and three groups of buttons under it. A narrow player keeps only the essential buttons.
	 *
	 * `compact`: a single row with the play button, the seek bar and the essential buttons.
	 * @default 'standard'
	 */
	layout?: 'standard' | 'compact';
	/** Shows a light splash in place of the player, with the poster and a play button, and loads the player, its
	 * scripts and the media only when the play button is pressed. Video.js and the media download nothing before.
	 *
	 * `click`: everything starts downloading on the press.
	 *
	 * `intent`: the scripts start downloading when the pointer or the focus reaches the play button, for a quicker start on the press.
	 *
	 * `visible`: the scripts start downloading when the splash scrolls into view.
	 */
	deferred?: 'click' | 'intent' | 'visible';
	/** The shape of the player until its media loads, and of the splash of a deferred player, as a CSS `aspect-ratio`. Match it to the media and nothing moves once the video arrives.
	 * @default '16 / 9'
	 */
	aspectRatio?: string;
	/** The direction of the volume slider in its popup.
	 * @default 'horizontal'
	 */
	volumeOrientation?: 'horizontal' | 'vertical';
	/** Hides the transport controls while the media plays and the user rests, and shows them again on any activity.
	 * `false` keeps them on screen.
	 * @default true
	 */
	autoHideControls?: boolean;
	/** Hides the transport controls of a paused media too, once the user rests. Without it, a pause keeps them on screen. */
	autoHideWhenPaused?: boolean;
	/** How the subtitles look.
	 *
	 * `acrylic`: a translucent panel of the theme, like the controls.
	 *
	 * `translucent`: light text on a dark veil in either theme, close to the native subtitles.
	 * @default 'acrylic'
	 */
	subtitlesAppearance?: 'acrylic' | 'translucent';
	/** The size of the subtitles text. A narrow player takes one step down.
	 * @default 'medium'
	 */
	subtitlesSize?: Sizes;
	/** Plays the media again from the start when it ends. The repeat button toggles it.
	 * @bindable
	 */
	loop?: boolean;
	/** Shows a repeat button, which toggles `loop`. */
	showRepeat?: boolean;
	/** How many seconds the skip back button rewinds. `0` hides the button.
	 * @default 10
	 */
	skipBackward?: 0 | 10 | 15;
	/** How many seconds the skip forward button advances. `0` hides the button.
	 * @default 30
	 */
	skipForward?: 0 | 10 | 15 | 30;
	/** The speeds of the more options menu. An empty list removes the playback speed group.
	 * @default [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
	 */
	playbackRates?: number[];
	/** Shows a previous button and calls this when it is pressed, or when the system media controls ask for the previous track. */
	onPrevious?: () => void;
	/** Shows a next button and calls this when it is pressed, or when the system media controls ask for the next track. */
	onNext?: () => void;
	/** Custom controls at the start of the button row, after the volume and subtitles buttons.
	 * @type Snippet | Component
	 */
	startContent?: MediaPlayerContent;
	/** Custom controls in the middle of the button row, after the next button.
	 * @type Snippet | Component
	 */
	centerContent?: MediaPlayerContent;
	/** Custom controls at the end of the button row, before the picture-in-picture button.
	 * @type Snippet | Component
	 */
	endContent?: MediaPlayerContent;
	/** Custom items for the more options menu, after the playback speed group. Use the Menu items.
	 * @type Snippet | Component
	 */
	moreContent?: MediaPlayerContent;
	/** The accessible name of the player.
	 * @default 'Media player'
	 */
	label?: string;
	/** The texts of the controls, their tooltips and menus. The ones left out fall back to English.
	 * @type Partial<MediaPlayerLabels>
	 */
	labels?: Partial<MediaPlayerLabels>;
	/** The DOM reference of the native video element. The other attributes of the player are applied to it.
	 * @bindable
	 */
	ref?: HTMLVideoElement | null;
	/** The `<video-player>` element of Video.js. Its `store` holds the state and the actions of the player.
	 * @type VideoPlayerElement
	 * @bindable
	 */
	playerRef?: VideoPlayerElement | null;
	/** The attributes to spread on the element that draws the player.
	 * @type HTMLAttributes
	 */
	wrapperAttributes?: HTMLAttributes<HTMLElement>;
	/** Extra `<source>` or `<track>` elements for the video. */
	children?: Snippet;
} & Omit<HTMLVideoAttributes, 'src' | 'poster' | 'controls' | 'children' | 'loop'>;

/** @propsmith MediaPlayerButtonProps */
export type MediaPlayerButtonProps = {
	/** The accessible name of the button, also shown in its tooltip. */
	label: string;
	/** Where the tooltip is placed relative to the button.
	 * @default 'top'
	 */
	tooltipPlacement?: Placement;
	/** Keeps the tooltip closed, for a button whose popup is open. */
	hideTooltip?: boolean;
	/** The DOM reference of the button element.
	 * @bindable
	 */
	ref?: HTMLButtonElement | null;
	/** The icon of the button. */
	children?: Snippet;
} & Omit<ButtonProps<'button'>, 'ref' | 'children' | 'appearance'>;
