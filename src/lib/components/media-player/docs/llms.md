# Media Player

> Part of fluentui-svelte. Read the global guide first (setup, rules and pitfalls): https://fluentui-svelte.dev/docs/llms.md, also shipped as node_modules/fluentui-svelte/skills/fluentui-svelte/SKILL.md

A video player with Fluent transport controls: a seek bar with the time, volume, subtitles, previous and next, skip back and forward, play and pause, picture-in-picture, full screen and playback speed, each with a tooltip. Video.js (`@videojs/html`) runs the playback underneath: the player state, keyboard shortcuts, touch and mouse gestures, and when the controls hide. It loads in the browser only, the first time a player mounts.

## Usage

```svelte
<script>
	import { MediaPlayer } from 'fluentui-svelte';
</script>

<MediaPlayer src="video.mp4" poster="poster.jpg" />
```

## Examples

### Deferred loading

`deferred` shows a light splash in place of the player: the poster and a large play button, with no `<video>` and no Video.js. The player, its scripts and the media load when the play button is pressed, and the video starts within that same press. `click` downloads everything on the press, `intent` starts downloading the scripts when the pointer or the focus reaches the button, and `visible` when the splash scrolls into view. Set `aspectRatio` to the shape of the media: nothing moves when the player replaces the splash.

```svelte
<MediaPlayer src="video.mp4" poster="poster.jpg" deferred="intent" aspectRatio="16 / 9" />
```

### Compact layout

`layout="compact"` puts the play button, the seek bar and the essential buttons in a single row.

```svelte
<MediaPlayer src="video.mp4" layout="compact" />
```

### Narrow players

Under 26rem wide, the standard layout keeps only the volume, play, picture-in-picture and full screen buttons.

### Controls that hide

The transport controls hide while the media plays and the user rests, and come back on any activity or keyboard focus. A pause keeps them on screen. `autoHideWhenPaused` lets them hide during a pause too, and `autoHideControls={false}` keeps them on screen always.

```svelte
<MediaPlayer src="video.mp4" autoHideWhenPaused />
<MediaPlayer src="video.mp4" autoHideControls={false} />
```

### Vertical video

A vertical video fills the height its width allows. Give the player a width and set `aspectRatio` to the shape of the media to reserve its space while it loads.

```svelte
<MediaPlayer
	src="vertical.mp4"
	poster="vertical-poster.jpg"
	aspectRatio="9 / 16"
	wrapperAttributes={{ style: 'max-width: 20rem' }}
/>
```

### Repeat

`showRepeat` adds a repeat button to the start group, which toggles `loop`. Bind `loop` to follow it.

```svelte
<MediaPlayer src="video.mp4" showRepeat bind:loop />
```

### Subtitles

Pass WebVTT files in `tracks`. The player draws the subtitles itself, in a Fluent panel that rises above the controls while they show. One track shows a toggle button; several show a menu to pick one. Media from another origin needs `crossorigin="anonymous"` for its tracks to load.

```svelte
<MediaPlayer
	src="video.mp4"
	tracks={[
		{ src: '/subtitles-en.vtt', srclang: 'en', label: 'English', default: true },
		{ src: '/subtitles-es.vtt', srclang: 'es', label: 'Español' }
	]}
/>
```

`subtitlesAppearance` sets how the subtitles look: `acrylic` (default), a translucent panel of the theme like the controls, or `translucent`, light text on a dark veil in either theme, close to the native subtitles. `subtitlesSize` takes `small`, `medium` (default) or `large`; a narrow player takes one step down.

```svelte
<MediaPlayer src="video.mp4" subtitlesAppearance="translucent" subtitlesSize="small" tracks={[/* ... */]} />
```

### Vertical volume

`volumeOrientation="vertical"` shows the volume slider upright above its button.

### Skip buttons and playback speed

`skipBackward` takes `10` or `15` seconds and `skipForward` takes `10`, `15` or `30`. `0` hides the button. `playbackRates` sets the speeds of the more options menu; an empty list removes them.

```svelte
<MediaPlayer src="video.mp4" skipBackward={15} skipForward={15} playbackRates={[1, 1.5, 2]} />
```

### Previous and next

`onPrevious` and `onNext` show the previous and next buttons around the playback buttons. The system media controls, picture-in-picture included, call them too. Leave one `undefined` to hide its button.

```svelte
<script>
	const playlist = ['intro.mp4', 'chapter-1.mp4', 'chapter-2.mp4'];
	let index = $state(0);
</script>

<MediaPlayer
	src={playlist[index]}
	autoplay={index > 0}
	onPrevious={index > 0 ? () => index-- : undefined}
	onNext={index < playlist.length - 1 ? () => index++ : undefined}
	onended={() => index < playlist.length - 1 && index++}
/>
```

### Custom controls and menu items

`startContent`, `centerContent` and `endContent` add controls to the start, middle and end groups of the button row; `moreContent` adds items, such as `MenuItem`, to the more options menu. Each is a snippet or a component that receives `{ store, layout, narrow, labels }`. `MediaPlayerButton` draws an icon button like the built-in ones: `label` names it and shows in its tooltip, and the `optional` class hides it in a narrow player.

```svelte
<MediaPlayer src="video.mp4">
	{#snippet endContent({ store })}
		<MediaPlayerButton label="Share this moment" class="optional" onclick={() => share(store?.currentTime)}>
			<ShareRegular />
		</MediaPlayerButton>
	{/snippet}
	{#snippet moreContent()}
		<MenuItem icon={ArrowDownloadRegular}>Download</MenuItem>
	{/snippet}
</MediaPlayer>
```

### Controlling the player from code

`playerRef` is the `<video-player>` element of Video.js. Its `store` holds the state (`paused`, `currentTime`, `volume`, `muted`, `isFullscreen` and more) and the actions (`play()`, `pause()`, `seek(time)`, `setVolume(volume)` and more), and `store.subscribe(callback)` reports every change. It is `null` until the player has loaded in the browser.

```svelte
<script>
	let player = $state(null);
</script>

<MediaPlayer src="video.mp4" bind:playerRef={player} />
<button onclick={() => player?.store.seek(0)}>Restart</button>
```

### Texts and translations

`labels` sets the names and tooltips of the controls, their menus and messages: `play`, `pause`, `previous`, `next`, `skipBackward(seconds)`, `skipForward(seconds)`, `seek`, `seekValue(time, duration)`, `volume`, `mute`, `unmute`, `repeat`, `subtitles`, `subtitlesOff`, `pictureInPicture`, `exitPictureInPicture`, `fullScreen`, `exitFullScreen`, `moreOptions`, `playbackSpeed`, `normalSpeed`, `loading`, `error` and `dismiss`. The texts left out fall back to the English ones of `MEDIA_PLAYER_LABELS`. Custom content receives the final texts as `labels`, to name its own controls alike. `label` names the player itself.

```svelte
<MediaPlayer
	src="video.mp4"
	label="Reproductor multimedia"
	labels={{
		play: 'Reproducir',
		pause: 'Pausar',
		fullScreen: 'Pantalla completa',
		moreOptions: 'Más opciones',
		skipBackward: (seconds) => `Retroceder ${seconds} segundos`
	}}
/>
```

## Keyboard

With the focus in the player: Space or K plays and pauses, the left and right arrows (J and L) seek, the up and down arrows change the volume, M mutes, F toggles full screen, C toggles subtitles, I toggles picture-in-picture, Home and End jump to the start and the end.

With the mouse, a click on the video plays and pauses and a double click toggles full screen. Clicks on the controls and their popups never do.

The root is the native `<video>` element: HTML attributes such as `autoplay`, `muted`, `loop`, `preload` and `crossorigin` apply to it, and so does `ref`. `wrapperAttributes` styles the element that draws the player.

## Component Props

<!-- props:MediaPlayerProps -->

| Name                                                                          | Type                                           | Default                              | Description                                                                                                                                                                                                           |
| ----------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src`                                                                         | `string`                                       |                                      | The URL of the media to play.                                                                                                                                                                                         |
| `poster`                                                                      | `string`                                       |                                      | The image shown until the media plays.                                                                                                                                                                                |
| `tracks`                                                                      | `MediaPlayerTrack[]`                           |                                      | The text tracks of the media: subtitles, captions or chapters.                                                                                                                                                        |
| `layout`                                                                      | `'standard'` &#124; `'compact'`                | `'standard'`                         | How the transport controls are laid out.                                                                                                                                                                              |
| `deferred`                                                                    | `'click'` &#124; `'intent'` &#124; `'visible'` |                                      | Shows a light splash in place of the player, with the poster and a play button, and loads the player, its scripts and the media only when the play button is pressed. Video.js and the media download nothing before. |
| `aspectRatio`                                                                 | `string`                                       | `'16 / 9'`                           | The shape of the player until its media loads, and of the splash of a deferred player, as a CSS `aspect-ratio`. Match it to the media and nothing moves once the video arrives.                                       |
| `volumeOrientation`                                                           | `'horizontal'` &#124; `'vertical'`             | `'horizontal'`                       | The direction of the volume slider in its popup.                                                                                                                                                                      |
| `autoHideControls`                                                            | `boolean`                                      | `true`                               | Hides the transport controls while the media plays and the user rests, and shows them again on any activity. `false` keeps them on screen.                                                                            |
| `autoHideWhenPaused`                                                          | `boolean`                                      |                                      | Hides the transport controls of a paused media too, once the user rests. Without it, a pause keeps them on screen.                                                                                                    |
| `subtitlesAppearance`                                                         | `'acrylic'` &#124; `'translucent'`             | `'acrylic'`                          | How the subtitles look.                                                                                                                                                                                               |
| `subtitlesSize`                                                               | `'small'` &#124; `'medium'` &#124; `'large'`   | `'medium'`                           | The size of the subtitles text. A narrow player takes one step down.                                                                                                                                                  |
| `loop` _bindable_                                                             | `boolean`                                      |                                      | Plays the media again from the start when it ends. The repeat button toggles it.                                                                                                                                      |
| `showRepeat`                                                                  | `boolean`                                      |                                      | Shows a repeat button, which toggles `loop`.                                                                                                                                                                          |
| `skipBackward`                                                                | `0` &#124; `10` &#124; `15`                    | `10`                                 | How many seconds the skip back button rewinds. `0` hides the button.                                                                                                                                                  |
| `skipForward`                                                                 | `0` &#124; `10` &#124; `15` &#124; `30`        | `30`                                 | How many seconds the skip forward button advances. `0` hides the button.                                                                                                                                              |
| `playbackRates`                                                               | `number[]`                                     | `[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]` | The speeds of the more options menu. An empty list removes the playback speed group.                                                                                                                                  |
| `onPrevious`                                                                  | `() => void`                                   |                                      | Shows a previous button and calls this when it is pressed, or when the system media controls ask for the previous track.                                                                                              |
| `onNext`                                                                      | `() => void`                                   |                                      | Shows a next button and calls this when it is pressed, or when the system media controls ask for the next track.                                                                                                      |
| `startContent`                                                                | `Snippet` &#124; `Component`                   |                                      | Custom controls at the start of the button row, after the volume and subtitles buttons.                                                                                                                               |
| `centerContent`                                                               | `Snippet` &#124; `Component`                   |                                      | Custom controls in the middle of the button row, after the next button.                                                                                                                                               |
| `endContent`                                                                  | `Snippet` &#124; `Component`                   |                                      | Custom controls at the end of the button row, before the picture-in-picture button.                                                                                                                                   |
| `moreContent`                                                                 | `Snippet` &#124; `Component`                   |                                      | Custom items for the more options menu, after the playback speed group. Use the Menu items.                                                                                                                           |
| `label`                                                                       | `string`                                       | `'Media player'`                     | The accessible name of the player.                                                                                                                                                                                    |
| `labels`                                                                      | `Partial<MediaPlayerLabels>`                   |                                      | The texts of the controls, their tooltips and menus. The ones left out fall back to English.                                                                                                                          |
| `ref` _bindable_                                                              | `HTMLVideoElement` &#124; `null`               |                                      | The DOM reference of the native video element. The other attributes of the player are applied to it.                                                                                                                  |
| `playerRef` _bindable_                                                        | `VideoPlayerElement`                           |                                      | The `<video-player>` element of Video.js. Its `store` holds the state and the actions of the player.                                                                                                                  |
| `wrapperAttributes`                                                           | `HTMLAttributes`                               |                                      | The attributes to spread on the element that draws the player.                                                                                                                                                        |
| `children`                                                                    | `Snippet`                                      |                                      | Extra `<source>` or `<track>` elements for the video.                                                                                                                                                                 |
| `HTMLVideoAttributes` without `src`, `poster`, `controls`, `children`, `loop` |                                                |                                      |                                                                                                                                                                                                                       |

<!-- /props:MediaPlayerProps -->

### MediaPlayerButton Props

<!-- props:MediaPlayerButtonProps -->

| Name                                                            | Type                              | Default | Description                                                   |
| --------------------------------------------------------------- | --------------------------------- | ------- | ------------------------------------------------------------- |
| `label`                                                         | `string`                          |         | The accessible name of the button, also shown in its tooltip. |
| `tooltipPlacement`                                              | `Placement`                       | `'top'` | Where the tooltip is placed relative to the button.           |
| `hideTooltip`                                                   | `boolean`                         |         | Keeps the tooltip closed, for a button whose popup is open.   |
| `ref` _bindable_                                                | `HTMLButtonElement` &#124; `null` |         | The DOM reference of the button element.                      |
| `children`                                                      | `Snippet`                         |         | The icon of the button.                                       |
| `ButtonProps<'button'>` without `ref`, `children`, `appearance` |                                   |         |                                                               |

<!-- /props:MediaPlayerButtonProps -->
