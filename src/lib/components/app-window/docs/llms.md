# AppWindow

An app window is the surface of an app: a Mica window with its own border and a shell shadow that tells the active window from the inactive ones. It is built on the Flyout, so it takes its content the same way, and it fills the space around it unless you give it a size.

## Usage

Put the content of the window inside it, starting with a `TitleBar` if it has one. The window is `100%` wide and tall unless you give it a `width` and a `height`.

```svelte
<script>
	import { AppWindow, TitleBar, TitleBarLeftControls, TitleBarRightControls } from 'fluentui-svelte';
	import { AppsRegular } from 'fluentui-icons-svelte';
</script>

<AppWindow width={400} height={200}>
	<TitleBar>
		{#snippet leftControls()}
			<TitleBarLeftControls appIcon={AppsRegular} appName="Contoso" />
		{/snippet}
		{#snippet rightControls()}
			<TitleBarRightControls />
		{/snippet}
	</TitleBar>
	<p>This is the content of the window.</p>
</AppWindow>
```

## Examples

### Size

`width` and `height` take a number in pixels or any CSS length. By default they take `100%` of their container.

```svelte
<AppWindow width={200} height={100} />
<AppWindow width="14rem" height="6rem" />

<div style="width: 260px; height: 120px">
	<AppWindow />
</div>
```

### Active and Inactive

`active` picks the shell shadow the window casts: the lighter one of an inactive window, which is the default, or the deeper one of the active window. Set it from the focus state of the window your app lives in.

```svelte
<script>
	let active = $state(false);
</script>

<AppWindow {active} width={400} height={160} />
```

### With a Title Bar

The window paints the Mica background, so a `TitleBar` inside it stays transparent and sits right on it.

```svelte
<AppWindow width={400} height={220}>
	<TitleBar searchMinWidth={120}>
		{#snippet leftControls()}
			<TitleBarLeftControls appIcon={AppsRegular} appName="Contoso" />
		{/snippet}
		{#snippet search()}
			<AutoSuggestBox placeholder="Search" aria-label="Search" />
		{/snippet}
		{#snippet rightControls()}
			<TitleBarRightControls />
		{/snippet}
	</TitleBar>
	<p style="padding: 1rem">This is the content of the window.</p>
</AppWindow>
```

## Component Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:AppWindowProps -->

| Name                                                | Type                     | Default  | Description                                                                                                                           |
| --------------------------------------------------- | ------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `ref` _bindable_                                    | `HTMLElement`            |          | The DOM reference of the window element.                                                                                              |
| `width`                                             | `number` &#124; `string` | `'100%'` | The width of the window. A number is in pixels, a string is any CSS length.                                                           |
| `height`                                            | `number` &#124; `string` | `'100%'` | The height of the window. A number is in pixels, a string is any CSS length.                                                          |
| `active`                                            | `boolean`                | `false`  | Whether the window is the active one, which picks the shell shadow it casts: a deeper one while active, a lighter one while inactive. |
| `children`                                          | `Snippet`                |          | The content of the window, such as a `TitleBar` and the page below it.                                                                |
| `HTMLAttributes<HTMLDivElement>` without `children` |                          |          |                                                                                                                                       |

<!-- /props:AppWindowProps -->
