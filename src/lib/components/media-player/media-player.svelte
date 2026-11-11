<script lang="ts">
	import { flushSync, tick, type Component } from 'svelte';
	import { onClickOutside } from 'runed';
	import Button from '../button/button.svelte';
	import Flyout from '../flyout/flyout.svelte';
	import InfoBar from '../info-bar/info-bar.svelte';
	import Menu from '../menu/menu.svelte';
	import MenuDivider from '../menu/menu-divider.svelte';
	import MenuGroup from '../menu/menu-group.svelte';
	import MenuItemRadio from '../menu/menu-item-radio.svelte';
	import MenuList from '../menu/menu-list.svelte';
	import MenuPopover from '../menu/menu-popover.svelte';
	import MenuTrigger from '../menu/menu-trigger.svelte';
	import ProgressRing from '../progress-ring/progress-ring.svelte';
	import Slider from '../slider/slider.svelte';
	import { RenderSoC } from '#internal';
	import ClosedCaptionRegular from 'fluentui-icons-svelte/ClosedCaptionRegular.svelte';
	import FullScreenMaximizeRegular from 'fluentui-icons-svelte/FullScreenMaximizeRegular.svelte';
	import FullScreenMinimizeRegular from 'fluentui-icons-svelte/FullScreenMinimizeRegular.svelte';
	import MoreHorizontalRegular from 'fluentui-icons-svelte/MoreHorizontalRegular.svelte';
	import NextRegular from 'fluentui-icons-svelte/NextRegular.svelte';
	import PauseFilled from 'fluentui-icons-svelte/PauseFilled.svelte';
	import PictureInPictureEnterRegular from 'fluentui-icons-svelte/PictureInPictureEnterRegular.svelte';
	import PictureInPictureExitRegular from 'fluentui-icons-svelte/PictureInPictureExitRegular.svelte';
	import PlayFilled from 'fluentui-icons-svelte/PlayFilled.svelte';
	import PreviousRegular from 'fluentui-icons-svelte/PreviousRegular.svelte';
	import SkipBack10Regular from 'fluentui-icons-svelte/SkipBack10Regular.svelte';
	import SkipBack15Regular from 'fluentui-icons-svelte/SkipBack15Regular.svelte';
	import SkipForward10Regular from 'fluentui-icons-svelte/SkipForward10Regular.svelte';
	import SkipForward15Regular from 'fluentui-icons-svelte/SkipForward15Regular.svelte';
	import SkipForward30Regular from 'fluentui-icons-svelte/SkipForward30Regular.svelte';
	import Speaker1Regular from 'fluentui-icons-svelte/Speaker1Regular.svelte';
	import Speaker2Regular from 'fluentui-icons-svelte/Speaker2Regular.svelte';
	import SpeakerMuteRegular from 'fluentui-icons-svelte/SpeakerMuteRegular.svelte';
	import ArrowRepeatAllRegular from 'fluentui-icons-svelte/ArrowRepeatAllRegular.svelte';
	import ArrowRepeatAllOffRegular from 'fluentui-icons-svelte/ArrowRepeatAllOffRegular.svelte';
	import type { MediaTextTrack } from '@videojs/html';
	import type { VideoPlayerElement } from '@videojs/html/video';
	import MediaPlayerButton from './media-player-button.svelte';
	import { MEDIA_PLAYER_LABELS, TOOLTIP_POSITION, claimMediaSession, loadVideoJs } from './utils.ts';
	import { on } from 'svelte/events';
	import type { MediaPlayerContent, MediaPlayerProps, MediaPlayerRenderState, MediaPlayerStore } from './types.ts';

	let {
		src,
		poster,
		tracks = [],
		layout = 'standard',
		deferred,
		aspectRatio = '16 / 9',
		volumeOrientation = 'horizontal',
		skipBackward = 10,
		skipForward = 30,
		loop = $bindable(false),
		showRepeat = false,
		autoHideControls = true,
		autoHideWhenPaused = false,
		subtitlesAppearance = 'acrylic',
		subtitlesSize = 'medium',
		playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
		onPrevious,
		onNext,
		startContent,
		centerContent,
		endContent,
		moreContent,
		label = 'Media player',
		labels,
		ref = $bindable(null),
		playerRef = $bindable(null),
		wrapperAttributes,
		children,
		...attributes
	}: MediaPlayerProps = $props();

	const SKIP_BACK_ICONS: Record<number, Component> = { 10: SkipBack10Regular, 15: SkipBack15Regular };
	const SKIP_FORWARD_ICONS: Record<number, Component> = {
		10: SkipForward10Regular,
		15: SkipForward15Regular,
		30: SkipForward30Regular
	};
	/** Under 26rem, the standard layout keeps only the essential buttons. */
	const NARROW_WIDTH = 416;

	/** The `<video-player>` element, set once Video.js has defined it and its store exists. */
	let playerElement: HTMLElement | null = $state(null);
	let store: MediaPlayerStore | null = $state.raw(null);

	/** A copy of the store, taken on every change: the store itself keeps its identity, and Svelte would never see it change. */
	let player = $state.raw({
		paused: true,
		waiting: false,
		autoplaying: false,
		currentTime: 0,
		duration: 0,
		bufferedEnd: 0,
		seeking: false,
		volume: 1,
		muted: false,
		volumeAvailable: false,
		fullscreen: false,
		fullscreenAvailable: false,
		pictureInPicture: false,
		pictureInPictureAvailable: false,
		controlsVisible: true,
		userActive: true,
		subtitlesShowing: false,
		subtitles: [] as MediaTextTrack[],
		playbackRate: 1,
		playbackRateAvailable: false,
		error: null as MediaPlayerStore['error']
	});

	/**
	 * The value the pointer or the keyboard set on a slider, kept until the media reports it. Reading the media
	 * meanwhile would hand the slider its old value back, which the slider would then write again.
	 */
	let scrubTime: number | null = $state(null);
	let volumeDraft: number | null = $state(null);

	const sync = () => {
		if (!store) return;
		player = {
			paused: store.paused,
			waiting: store.waiting,
			autoplaying: store.autoplaying,
			currentTime: store.currentTime,
			duration: store.duration,
			// The end of the loaded range the playback is in: what plays without waiting for the network.
			bufferedEnd:
				store.buffered.find(
					([start, end]: [number, number]) => start <= store!.currentTime + 0.5 && end >= store!.currentTime
				)?.[1] ?? 0,
			seeking: store.seeking,
			volume: store.volume,
			muted: store.muted,
			volumeAvailable: store.volumeAvailability === 'available',
			fullscreen: store.isFullscreen,
			fullscreenAvailable: store.fullscreenAvailability === 'available',
			pictureInPicture: store.isPictureInPicture,
			pictureInPictureAvailable: store.pictureInPictureAvailability === 'available',
			controlsVisible: store.controlsVisible,
			userActive: store.userActive,
			subtitlesShowing: store.subtitlesShowing,
			subtitles: store.textTrackList.filter(
				(track: MediaTextTrack) => track.kind === 'subtitles' || track.kind === 'captions'
			),
			playbackRate: store.playbackRate,
			playbackRateAvailable: store.playbackRateAvailability === 'available',
			error: store.error
		};
		if (scrubTime !== null && !player.seeking && Math.abs(player.currentTime - scrubTime) < 0.5) scrubTime = null;
		if (volumeDraft !== null && Math.round(player.volume * 100) === volumeDraft && !player.muted) volumeDraft = null;
	};

	/**
	 * Whether Video.js is defined: only then can the video join the player. Until then the poster stands in for it: a video
	 * already in the player when Video.js upgrades it would be attached before the container registers.
	 */
	let ready = $state(false);
	/** A press on the splash that came before Video.js, which starts the video once it is ready. */
	let playOnReady = false;
	/** Whether the player is on the page: from the start, or once the splash of a deferred player is pressed. */
	let activated = $state(false);
	const active = $derived(!deferred || activated);
	let splashElement: HTMLElement | null = $state(null);
	let playButtonRef: HTMLButtonElement | null = $state(null);
	/** The scripts of Video.js failed to download; a retry downloads them again. */
	let loadFailed = $state(false);
	let loadAttempt = $state(0);

	// The player reads its store once Video.js has loaded, which happens in the browser only, for a mounted player.
	$effect(() => {
		const element = playerElement;
		// A retry runs the effect again.
		void loadAttempt;
		if (!element) return;
		let unsubscribe: (() => void) | undefined;
		let mounted = true;

		loadVideoJs()
			.then(async () => {
				if (!mounted) return;
				playerRef = element as VideoPlayerElement;
				store = playerRef.store;
				sync();
				unsubscribe = store.subscribe(sync);
				// The video comes last: by the time the player attaches the media, its container is already registered.
				ready = true;
				if (!playOnReady) return;
				playOnReady = false;
				await tick();
				ref?.play().catch(() => {});
				playButtonRef?.focus();
			})
			.catch(() => {
				if (mounted) loadFailed = true;
			});

		return () => {
			mounted = false;
			unsubscribe?.();
		};
	});

	/** Downloads the scripts ahead of the press, without mounting the player. */
	const prefetch = () => {
		loadVideoJs().catch(() => {});
	};

	// `visible` downloads the scripts once the splash scrolls into view.
	$effect(() => {
		if (deferred !== 'visible' || activated || !splashElement) return;
		const observer = new IntersectionObserver((entries) => {
			if (!entries.some((entry) => entry.isIntersecting)) return;
			prefetch();
			observer.disconnect();
		});
		observer.observe(splashElement);
		return () => observer.disconnect();
	});

	/**
	 * Replaces the splash with the player and starts the video within the same press: a browser only lets a page
	 * start a video with sound from the handler of a user action, and waiting for Video.js would lose that chance.
	 */
	const activate = () => {
		activated = true;
		// With Video.js already loaded (`intent`, `visible` or an earlier player), the video starts within the press.
		// Otherwise it starts once Video.js arrives, as long as the browser still counts the press as recent.
		if (!customElements.get('video-player')) {
			playOnReady = true;
			return;
		}
		ready = true;
		flushSync();
		ref?.play().catch(() => {});
		playButtonRef?.focus();
	};

	let width = $state(0);
	const narrow = $derived(width > 0 && width < NARROW_WIDTH);

	/**
	 * Whether the transport controls are on screen. They hide while the media plays and the user rests, unless
	 * `autoHideControls` is off; a pause keeps them, unless `autoHideWhenPaused` lets them hide then too.
	 */
	const controlsShown = $derived(
		!autoHideControls || (player.paused ? !autoHideWhenPaused || player.userActive : player.controlsVisible)
	);
	let controlsHeight = $state(0);

	/**
	 * The lines of the subtitles on screen. The player draws them itself, in a Fluent panel that rises above the
	 * controls while they show: the native ones can be neither padded nor moved.
	 */
	let cueLines: string[] = $state([]);

	$effect(() => {
		const video = ref;
		if (!video || !ready) return;
		const tracks = video.textTracks;
		const update = () => {
			const lines: string[] = [];
			for (const track of tracks) {
				if (track.mode !== 'showing' || (track.kind !== 'subtitles' && track.kind !== 'captions')) continue;
				for (const cue of track.activeCues ?? []) {
					// The text of the cue without its markup, such as voice and style tags.
					const text = (cue as VTTCue).getCueAsHTML().textContent ?? '';
					lines.push(...text.split('\n'));
				}
			}
			cueLines = lines.map((line) => line.trim()).filter(Boolean);
		};
		const listen = (track: TextTrack) => track.addEventListener('cuechange', update);
		const handleAddTrack = (e: TrackEvent) => {
			if (e.track) listen(e.track as TextTrack);
			update();
		};

		for (const track of tracks) listen(track);
		tracks.addEventListener('addtrack', handleAddTrack);
		tracks.addEventListener('change', update);
		update();

		return () => {
			for (const track of tracks) track.removeEventListener('cuechange', update);
			tracks.removeEventListener('addtrack', handleAddTrack);
			tracks.removeEventListener('change', update);
		};
	});
	/** The texts of the player: the given ones over the English defaults. */
	const t = $derived({ ...MEDIA_PLAYER_LABELS, ...labels });
	const renderState: MediaPlayerRenderState = $derived({ store, layout, narrow, labels: t });

	let volumeOpen = $state(false);
	let volumeRoot: HTMLElement | null = $state(null);
	let volumeButton: HTMLButtonElement | null = $state(null);
	let captionsOpen = $state(false);
	let moreOpen = $state(false);

	onClickOutside(
		() => volumeRoot,
		() => (volumeOpen = false)
	);

	// The controls stay on screen while one of their popups is open.
	$effect(() => {
		if (store && (volumeOpen || captionsOpen || moreOpen)) return store.requestControlsLock();
	});

	/** Whether the media is paused, apart from the rest of the state: the effect below follows only this. */
	const paused = $derived(player.paused);

	// The system media controls, picture-in-picture included, offer the previous and next tracks of the playing player:
	// the last one to start, and the one before once it pauses.
	$effect(() => {
		if (paused || !('mediaSession' in navigator)) return;
		return claimMediaSession({
			previous: onPrevious ? () => onPrevious() : null,
			next: onNext ? () => onNext() : null
		});
	});

	/** Delay before the buffering indicator shows. A brief stall never makes it flicker. */
	const BUFFERING_DELAY = 500;
	let buffering = $state(false);

	// Shows while the media waits for data during playback, or tries to autoplay, once the delay has passed. Hides at once.
	$effect(() => {
		if (!((player.waiting && !player.paused) || player.autoplaying)) {
			buffering = false;
			return;
		}
		const timer = setTimeout(() => (buffering = true), BUFFERING_DELAY);
		return () => clearTimeout(timer);
	});

	const formatTime = (seconds: number) => {
		const total = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
		return [Math.floor(total / 3600), Math.floor(total / 60) % 60, total % 60]
			.map((part) => String(part).padStart(2, '0'))
			.join(':');
	};

	/** A live stream or media without metadata yet has no length to seek through. */
	const seekable = $derived(Number.isFinite(player.duration) && player.duration > 0);
	const seekMax = $derived(seekable ? player.duration : 1);
	const shownTime = $derived(scrubTime ?? Math.min(player.currentTime, seekMax));
	const volumePercent = $derived(volumeDraft ?? (player.muted ? 0 : Math.round(player.volume * 100)));
	const VolumeIcon = $derived(
		volumePercent === 0 ? SpeakerMuteRegular : volumePercent < 50 ? Speaker1Regular : Speaker2Regular
	);
	const SkipBackIcon = $derived(SKIP_BACK_ICONS[skipBackward]);
	const SkipForwardIcon = $derived(SKIP_FORWARD_ICONS[skipForward]);
	/** The speeds of the menu, each once. */
	const rates = $derived([...new Set(playbackRates)]);
	const showRates = $derived(player.playbackRateAvailable && rates.length > 0);

	/**
	 * Whether the video knows its size. Until then the container keeps `aspectRatio`, and the page does not move when
	 * a video of another shape arrives.
	 */
	let mediaSized = $state(false);
	$effect(() => {
		const video = ref;
		if (!video) return;
		const update = () => (mediaSized = video.videoWidth > 0);
		update();
		const offs = [on(video, 'loadedmetadata', update), on(video, 'emptied', update)];
		return () => offs.forEach((off) => off());
	});
	const hasMore = $derived(showRates || !!moreContent);

	const togglePaused = () => (player.paused ? store?.play() : store?.pause());
	const skip = (seconds: number) => store?.seek(Math.min(Math.max(player.currentTime + seconds, 0), seekMax));
	const toggleFullscreen = () => (player.fullscreen ? store?.exitFullscreen() : store?.requestFullscreen());
	const togglePictureInPicture = () =>
		player.pictureInPicture ? store?.exitPictureInPicture() : store?.requestPictureInPicture();

	const scrubTo = (time: number) => {
		scrubTime = time;
		store?.seek(time);
	};

	const setVolume = (percent: number) => {
		volumeDraft = percent;
		store?.setVolume(percent / 100);
		if (player.muted && percent > 0) store?.setMuted(false);
	};

	const handleVolumeButton = () => {
		// A platform that does not let pages set the volume (iOS) can still mute.
		if (player.volumeAvailable) volumeOpen = !volumeOpen;
		else store?.setMuted(!player.muted);
	};

	const closeVolume = (e: KeyboardEvent) => {
		if (e.key !== 'Escape' || !volumeOpen) return;
		// The hotkeys of the player must not see the Escape that closed the popup.
		e.stopPropagation();
		volumeOpen = false;
		volumeButton?.focus();
	};
</script>

<!-- @component
  A media player that plays a video with Fluent transport controls. Video.js runs the playback: state, keyboard
  shortcuts, gestures, buffering, full screen and picture-in-picture.
  - Usage:
    ```tsx
    <script>
      import { MediaPlayer } from 'fluentui-svelte';
    </script>

    <MediaPlayer src="video.mp4" poster="poster.jpg" />
    ```
-->
{#if !active}
	<!-- The splash of a deferred player: the poster and a play button, and no media or script yet. -->
	<div
		{...wrapperAttributes}
		class={['fs-media-player', 'fs-media-player-splash', wrapperAttributes?.class]}
		style:aspect-ratio={aspectRatio}
		role="region"
		aria-label={label}
		bind:this={splashElement}
	>
		{#if poster}
			<img class="fs-media-player-splash-poster" src={poster} alt="" />
		{/if}
		<Button
			appearance="accent"
			shape="circular"
			class="fs-media-player-splash-button"
			aria-label={t.play}
			onclick={activate}
			onpointerenter={deferred === 'intent' ? prefetch : undefined}
			onfocus={deferred === 'intent' ? prefetch : undefined}
		>
			<PlayFilled />
		</Button>
	</div>
{:else}
	<video-player
		{...wrapperAttributes}
		class={['fs-media-player', `layout-${layout}`, { narrow }, wrapperAttributes?.class]}
		bind:this={playerElement}
		bind:clientWidth={width}
	>
		<media-container
			class="fs-media-player-container"
			style:aspect-ratio={ready && mediaSized ? undefined : aspectRatio}
			role="region"
			aria-label={label}
		>
			{#if !ready && poster}
				<img class="fs-media-player-placeholder" src={poster} alt="" />
			{/if}
			{#if ready}
				<video {...attributes} {src} {poster} {loop} playsinline bind:this={ref}>
					{#each tracks as track (track)}
						<track
							src={track.src}
							kind={track.kind ?? 'subtitles'}
							srclang={track.srclang}
							label={track.label}
							default={track.default}
						/>
					{/each}
					{@render children?.()}
				</video>
			{/if}

			<media-hotkey keys="Space" action="togglePaused"></media-hotkey>
			<media-hotkey keys="k" action="togglePaused"></media-hotkey>
			<media-hotkey keys="ArrowLeft" action="seekStep"></media-hotkey>
			<media-hotkey keys="ArrowRight" action="seekStep"></media-hotkey>
			<media-hotkey keys="j" action="seekStep"></media-hotkey>
			<media-hotkey keys="l" action="seekStep"></media-hotkey>
			<media-hotkey keys="ArrowUp" action="volumeStep"></media-hotkey>
			<media-hotkey keys="ArrowDown" action="volumeStep"></media-hotkey>
			<media-hotkey keys="m" action="toggleMuted"></media-hotkey>
			<media-hotkey keys="f" action="toggleFullscreen"></media-hotkey>
			<media-hotkey keys="c" action="toggleSubtitles"></media-hotkey>
			<media-hotkey keys="i" action="togglePictureInPicture"></media-hotkey>
			<media-hotkey keys="Home" action="seekToPercent" value="0"></media-hotkey>
			<media-hotkey keys="End" action="seekToPercent" value="100"></media-hotkey>
			<media-gesture type="tap" action="togglePaused" pointer="mouse" region="center"></media-gesture>
			<media-gesture type="tap" action="toggleControls" pointer="touch"></media-gesture>
			<media-gesture type="doubletap" action="toggleFullscreen" region="center"></media-gesture>

			{#if buffering}
				<div class="fs-media-player-overlay fs-media-player-buffering">
					<ProgressRing indeterminate size={48} aria-label={t.loading} />
				</div>
			{/if}

			{#if loadFailed}
				<div class="fs-media-player-overlay fs-media-player-alert" data-interactive>
					<InfoBar status="critical" title={t.error} style="multiline" hideCloseButton>
						{t.loadError}
						<Button
							appearance="standard"
							onclick={() => {
								loadFailed = false;
								loadAttempt++;
							}}>{t.retry}</Button
						>
					</InfoBar>
				</div>
			{/if}

			{#if player.error}
				<div class="fs-media-player-overlay fs-media-player-alert" data-interactive>
					<InfoBar status="critical" title={t.error} style="multiline" hideCloseButton>
						{player.error.message}
						<Button appearance="standard" onclick={() => store?.dismissError()}>{t.dismiss}</Button>
					</InfoBar>
				</div>
			{/if}

			{#if cueLines.length}
				<!-- The subtitles stay out of the accessibility tree: the audio already says the same. -->
				<div
					class={['fs-media-player-captions', `appearance-${subtitlesAppearance}`, `size-${subtitlesSize}`]}
					style:bottom="{controlsShown ? controlsHeight + 16 : 16}px"
					aria-hidden="true"
				>
					{#each cueLines as line, index (index)}
						<span>{line}</span>
					{/each}
				</div>
			{/if}

			<!-- `data-interactive`: a tap on the controls or their popups is not a tap on the video for the gestures. -->
			<div
				class="fs-media-player-controls"
				data-interactive
				data-visible={controlsShown || undefined}
				bind:clientHeight={controlsHeight}
			>
				{#snippet custom(content: MediaPlayerContent | undefined)}
					{#if content}
						<RenderSoC SoC={content} args={renderState} />
					{/if}
				{/snippet}

				{#snippet playButton()}
					<MediaPlayerButton
						class="play"
						label={player.paused ? t.play : t.pause}
						bind:ref={playButtonRef}
						onclick={togglePaused}
					>
						{#if player.paused}<PlayFilled />{:else}<PauseFilled />{/if}
					</MediaPlayerButton>
				{/snippet}

				{#snippet previousButton()}
					{#if onPrevious}
						<MediaPlayerButton class="optional" label={t.previous} onclick={() => onPrevious()}>
							<PreviousRegular />
						</MediaPlayerButton>
					{/if}
				{/snippet}

				{#snippet nextButton()}
					{#if onNext}
						<MediaPlayerButton class="optional" label={t.next} onclick={() => onNext()}>
							<NextRegular />
						</MediaPlayerButton>
					{/if}
				{/snippet}

				{#snippet seekBar()}
					<Slider
						wrapperAttributes={{ class: 'fs-media-player-seek' }}
						aria-label={t.seek}
						aria-valuetext={t.seekValue(formatTime(shownTime), formatTime(player.duration))}
						min={0}
						max={seekMax}
						step={Math.min(1, seekMax)}
						disabled={!seekable}
						buffer={seekable ? Math.min(player.bufferedEnd, seekMax) : undefined}
						tooltipContent={formatTime(shownTime)}
						tooltipPositionConfig={TOOLTIP_POSITION}
						bind:value={() => shownTime, scrubTo}
					/>
				{/snippet}

				{#snippet volume()}
					<span class="fs-media-player-volume" bind:this={volumeRoot} onkeydown={closeVolume} role="presentation">
						<MediaPlayerButton
							bind:ref={volumeButton}
							hideTooltip={volumeOpen}
							label={player.volumeAvailable ? t.volume : player.muted ? t.unmute : t.mute}
							aria-expanded={player.volumeAvailable ? volumeOpen : undefined}
							onclick={handleVolumeButton}
						>
							<VolumeIcon />
						</MediaPlayerButton>
						{#if volumeOpen && volumeButton}
							<Flyout
								class={['fs-media-player-volume-flyout', `orientation-${volumeOrientation}`]}
								floating
								reference={volumeButton}
								placement={volumeOrientation === 'vertical' ? 'top' : 'top-start'}
								placementConfig={{
									allowedPlacements:
										volumeOrientation === 'vertical' ? ['top', 'bottom'] : ['top-start', 'top', 'bottom-start']
								}}
							>
								<MediaPlayerButton
									label={player.muted ? t.unmute : t.mute}
									tooltipPlacement={volumeOrientation === 'vertical' ? 'right' : 'top'}
									aria-pressed={player.muted}
									onclick={() => store?.setMuted(!player.muted)}
								>
									<VolumeIcon />
								</MediaPlayerButton>
								<Slider
									wrapperAttributes={{ class: 'fs-media-player-volume-slider' }}
									aria-label={t.volume}
									orientation={volumeOrientation}
									tooltip={false}
									bind:value={() => volumePercent, setVolume}
								/>
								<span class="fs-media-player-volume-value" aria-hidden="true">{volumePercent}</span>
							</Flyout>
						{/if}
					</span>
				{/snippet}

				{#snippet repeat(optional: boolean)}
					{#if showRepeat}
						<MediaPlayerButton class={{ optional }} label={t.repeat} aria-pressed={loop} onclick={() => (loop = !loop)}>
							{#if loop}<ArrowRepeatAllRegular />{:else}<ArrowRepeatAllOffRegular />{/if}
						</MediaPlayerButton>
					{/if}
				{/snippet}

				{#snippet captions(optional: boolean)}
					{#if player.subtitles.length === 1}
						<MediaPlayerButton
							class={{ optional }}
							label={t.subtitles}
							aria-pressed={player.subtitlesShowing}
							onclick={() => store?.toggleSubtitles()}
						>
							<ClosedCaptionRegular />
						</MediaPlayerButton>
					{:else if player.subtitles.length > 1}
						<Menu
							hasCheckmarks
							onOpenChange={(_, open) => (captionsOpen = open)}
							checkedValues={{
								subtitles: [player.subtitles.find((track) => track.mode === 'showing')?.id ?? 'off']
							}}
							onCheckedValueChange={(_, values) => {
								const id = values.subtitles?.[0];
								store?.selectSubtitlesTrack(!id || id === 'off' ? null : id);
							}}
						>
							<MenuTrigger>
								{#snippet children({ state, menuTriggerProps })}
									<MediaPlayerButton
										{...menuTriggerProps}
										class={{ optional }}
										label={t.subtitles}
										hideTooltip={captionsOpen}
										bind:ref={() => state.ref as HTMLButtonElement | null, (v) => (state.ref = v)}
									>
										<ClosedCaptionRegular />
									</MediaPlayerButton>
								{/snippet}
							</MenuTrigger>
							<MenuPopover placement="top">
								<MenuList>
									<MenuGroup header={t.subtitles}>
										<MenuItemRadio name="subtitles" value="off">{t.subtitlesOff}</MenuItemRadio>
										{#each player.subtitles as track (track.id)}
											<MenuItemRadio name="subtitles" value={track.id}>
												{track.label || track.language || track.id}
											</MenuItemRadio>
										{/each}
									</MenuGroup>
								</MenuList>
							</MenuPopover>
						</Menu>
					{/if}
				{/snippet}

				{#snippet pictureInPicture()}
					{#if player.pictureInPictureAvailable}
						<MediaPlayerButton
							label={player.pictureInPicture ? t.exitPictureInPicture : t.pictureInPicture}
							onclick={togglePictureInPicture}
						>
							{#if player.pictureInPicture}
								<PictureInPictureExitRegular />
							{:else}
								<PictureInPictureEnterRegular />
							{/if}
						</MediaPlayerButton>
					{/if}
				{/snippet}

				{#snippet fullscreen()}
					{#if player.fullscreenAvailable}
						<MediaPlayerButton label={player.fullscreen ? t.exitFullScreen : t.fullScreen} onclick={toggleFullscreen}>
							{#if player.fullscreen}<FullScreenMinimizeRegular />{:else}<FullScreenMaximizeRegular />{/if}
						</MediaPlayerButton>
					{/if}
				{/snippet}

				{#snippet more(optional: boolean)}
					{#if hasMore}
						<Menu
							hasCheckmarks
							onOpenChange={(_, open) => (moreOpen = open)}
							checkedValues={{ rate: [String(player.playbackRate)] }}
							onCheckedValueChange={(_, values) => {
								const rate = Number(values.rate?.[0]);
								if (rate) store?.setPlaybackRate(rate);
							}}
						>
							<MenuTrigger>
								{#snippet children({ state, menuTriggerProps })}
									<MediaPlayerButton
										{...menuTriggerProps}
										class={{ optional }}
										label={t.moreOptions}
										hideTooltip={moreOpen}
										bind:ref={() => state.ref as HTMLButtonElement | null, (v) => (state.ref = v)}
									>
										<MoreHorizontalRegular />
									</MediaPlayerButton>
								{/snippet}
							</MenuTrigger>
							<MenuPopover placement="top-end">
								<MenuList>
									{#if showRates}
										<MenuGroup header={t.playbackSpeed}>
											{#each rates as rate (rate)}
												<MenuItemRadio name="rate" value={String(rate)}>
													{rate === 1 ? t.normalSpeed : `${rate}×`}
												</MenuItemRadio>
											{/each}
										</MenuGroup>
									{/if}
									{#if showRates && moreContent}
										<MenuDivider />
									{/if}
									{@render custom(moreContent)}
								</MenuList>
							</MenuPopover>
						</Menu>
					{/if}
				{/snippet}

				{#if layout === 'compact'}
					<div class="fs-media-player-row">
						{@render previousButton()}
						{@render playButton()}
						{@render nextButton()}
						{@render custom(centerContent)}
						{@render seekBar()}
						{@render volume()}
						{@render captions(false)}
						{@render repeat(false)}
						{@render custom(startContent)}
						{@render custom(endContent)}
						{@render more(false)}
						{@render fullscreen()}
					</div>
				{:else}
					{@render seekBar()}
					<div class="fs-media-player-time" aria-hidden="true">
						<span>{formatTime(shownTime)}</span>
						<span>{formatTime(player.duration)}</span>
					</div>
					<div class="fs-media-player-row">
						<div class="fs-media-player-group start">
							{@render volume()}
							{@render captions(true)}
							{@render repeat(true)}
							{@render custom(startContent)}
						</div>
						<div class="fs-media-player-group center">
							{@render previousButton()}
							{#if SkipBackIcon}
								<MediaPlayerButton
									class="optional"
									label={t.skipBackward(skipBackward)}
									disabled={!seekable}
									onclick={() => skip(-skipBackward)}
								>
									<SkipBackIcon />
								</MediaPlayerButton>
							{/if}
							{@render playButton()}
							{#if SkipForwardIcon}
								<MediaPlayerButton
									class="optional"
									label={t.skipForward(skipForward)}
									disabled={!seekable}
									onclick={() => skip(skipForward)}
								>
									<SkipForwardIcon />
								</MediaPlayerButton>
							{/if}
							{@render nextButton()}
							{@render custom(centerContent)}
						</div>
						<div class="fs-media-player-group end">
							{@render custom(endContent)}
							{@render pictureInPicture()}
							{@render fullscreen()}
							{@render more(true)}
						</div>
					</div>
				{/if}
			</div>
		</media-container>
	</video-player>
{/if}

<style>
	/* No `overflow: hidden`: the popups of the controls may reach past the video, and a focused menu item would
	   otherwise scroll the clipped player. The video rounds its own corners instead. */
	.fs-media-player {
		display: block;
		position: relative;
		width: 100%;
		color: var(--fs-text-primary);
		font-size: var(--fs-body-font-size);
		line-height: var(--fs-body-line-height);
	}

	.fs-media-player-splash {
		display: grid;
		place-items: center;
		border-radius: var(--fs-control-overlay-border-radius);
		background: var(--fs-solid-background-tertiary);
		& :global(.fs-button.fs-media-player-splash-button) {
			z-index: 1;
			width: 4rem;
			min-width: 4rem;
			height: 4rem;
			padding: 0;
			box-shadow: var(--fs-shadow-flyout);
			& :global(svg) {
				width: 1.75rem;
				height: 1.75rem;
			}
		}
	}

	.fs-media-player-placeholder,
	.fs-media-player-splash-poster {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: inherit;
	}

	.fs-media-player-container {
		display: block;
		position: relative;
		width: 100%;
		height: 100%;
		border-radius: var(--fs-control-overlay-border-radius);
		&:focus-visible {
			outline: 0.125rem solid var(--fs-focus-stroke-outer);
			outline-offset: 0.125rem;
		}
		& video {
			display: block;
			width: 100%;
			height: 100%;
			object-fit: contain;
			border-radius: inherit;
		}
	}

	/* A message stays above the controls: in a short player they would cover its buttons. */
	.fs-media-player-alert {
		z-index: 2;
	}

	.fs-media-player-overlay {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		padding: 1rem;
		pointer-events: none;
		& > :global(*) {
			pointer-events: auto;
		}
	}

	.fs-media-player-buffering > :global(*) {
		pointer-events: none;
	}

	/*
	 * Acrylic bar over the bottom of the video. The blur sits on a layer behind the controls: a `backdrop-filter`
	 * on the bar itself would become the containing block of the fixed popups inside it and move them.
	 */
	.fs-media-player-controls {
		position: absolute;
		inset: auto 0.5rem 0.5rem;
		z-index: 1;
		isolation: isolate;
		display: flex;
		flex-direction: column;
		padding: 0.25rem 0.5rem;
		border-radius: var(--fs-control-overlay-border-radius);
		border: 1px solid var(--fs-control-surface-stroke-flyout);
		box-shadow: var(--fs-shadow-flyout);
		transition: opacity var(--fs-fast-duration) var(--fs-point-to-point);
		&::before {
			content: '';
			position: absolute;
			inset: 0;
			z-index: -1;
			border-radius: inherit;
			background: var(--fs-acrylic-background-default);
			backdrop-filter: blur(10px) saturate(125%);
		}
		/*
		 * The controls stay while the keyboard is in them, whatever the activity of the pointer. Hidden, they let the
		 * pointer through to the video, for its gestures: the bar of the controls ignores the presses that start on it.
		 */
		&:not([data-visible]):not(:has(:focus-visible)) {
			opacity: 0;
			pointer-events: none;
		}
		@media (prefers-reduced-motion: reduce) {
			transition: none;
		}
	}

	/* The native subtitles give way to the ones the player draws. */
	.fs-media-player-container video::cue {
		visibility: hidden;
		color: transparent;
		background: transparent;
		text-shadow: none;
	}

	.fs-media-player-captions {
		position: absolute;
		inset-inline: 0.5rem;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		text-align: center;
		pointer-events: none;
		transition: bottom var(--fs-normal-duration) var(--fs-point-to-point);
		/* Each size takes one step down in a narrow player. */
		&.size-small {
			--subtitles-font-size: var(--fs-body2-font-size);
			.narrow & {
				--subtitles-font-size: var(--fs-caption-font-size);
			}
		}
		&.size-medium {
			--subtitles-font-size: var(--fs-body-font-size);
			.narrow & {
				--subtitles-font-size: var(--fs-body2-font-size);
			}
		}
		&.size-large {
			--subtitles-font-size: var(--fs-subtitle2-font-size);
			.narrow & {
				--subtitles-font-size: var(--fs-body-font-size);
			}
		}
		& span {
			max-width: 100%;
			padding: 0.125rem 0.5rem;
			border-radius: var(--fs-control-border-radius);
			background-clip: padding-box;
			font-size: var(--subtitles-font-size);
			line-height: 1.4;
		}
		/* A translucent layer of the theme, blurred like the controls. */
		&.appearance-acrylic span {
			border: 1px solid var(--fs-control-surface-stroke-flyout);
			background: var(--fs-layer-default);
			backdrop-filter: blur(20px) saturate(150%);
			box-shadow: var(--fs-shadow-tooltip);
			color: var(--fs-text-secondary);
		}
		/* Light text on a dark veil in either theme, as the native subtitles look. */
		&.appearance-translucent span {
			background: var(--fs-smoke-background-default);
			backdrop-filter: blur(6px);
			color: var(--fs-text-on-accent-selected);
			text-shadow: 0 1px 2px var(--fs-smoke-background-default);
		}
		@media (prefers-reduced-motion: reduce) {
			transition: none;
		}
	}

	.layout-standard .fs-media-player-controls {
		padding-top: 0.5rem;
	}

	.fs-media-player-time {
		display: flex;
		justify-content: space-between;
		padding: 0 0.25rem;
		font-size: var(--fs-caption-font-size);
		line-height: var(--fs-caption-line-height);
		color: var(--fs-text-secondary);
		font-variant-numeric: tabular-nums;
	}

	.fs-media-player-row {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		& :global(.fs-media-player-seek) {
			flex: 1 1 auto;
			margin: 0 0.5rem;
		}
	}

	.fs-media-player-group {
		display: flex;
		flex: 1 1 0;
		align-items: center;
		gap: 0.25rem;
		&.center {
			flex: 0 0 auto;
			justify-content: center;
		}
		&.end {
			justify-content: flex-end;
		}
	}

	.fs-media-player-volume {
		display: inline-flex;
		& :global(.fs-media-player-volume-flyout) {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			width: max-content;
			padding: 0.25rem 0.75rem 0.25rem 0.25rem;
			z-index: 3;
		}
		& :global(.fs-media-player-volume-flyout.orientation-vertical) {
			flex-direction: column-reverse;
			padding: 0.5rem 0.25rem 0.25rem;
		}
		& :global(.fs-media-player-volume-slider) {
			flex: none;
		}
		& :global(.orientation-horizontal .fs-media-player-volume-slider) {
			width: 8rem;
		}
		& :global(.orientation-vertical .fs-media-player-volume-slider) {
			height: 7.5rem;
		}
	}

	.fs-media-player-volume-value {
		min-width: 3ch;
		text-align: center;
		font-variant-numeric: tabular-nums;
	}

	/* A narrow player keeps the volume, play, picture-in-picture and full screen buttons. */
	.narrow :global(.fs-media-player-button.optional) {
		display: none;
	}
</style>
