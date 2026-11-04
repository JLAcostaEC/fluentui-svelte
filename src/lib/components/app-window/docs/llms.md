# AppWindow

> Part of fluentui-svelte. Read the global guide first (setup, rules and pitfalls): https://fluentui-svelte.dev/docs/llms.md, also shipped as node_modules/fluentui-svelte/skills/fluentui-svelte/SKILL.md

An app window is the surface of an app: a Mica window with its own border and a shell shadow that tells the active window from the inactive ones. It is built on the Flyout, so it takes its content the same way, and it fills the space around it unless you give it a size.

## Usage

Start with a `TitleBar` if the window has one, then place page content in an `AppSurface` or another scrollable container. The window itself clips overflow. It is `100%` wide and tall unless you give it a `width` and a `height`.

```svelte
<script>
	import {
		AppSurface,
		AppWindow,
		AutoSuggestBox,
		TitleBar,
		TitleBarLeftControls,
		TitleBarRightControls
	} from 'fluentui-svelte';
	import AppsRegular from 'fluentui-icons-svelte/AppsRegular.svelte';
</script>

<AppWindow width={400} height={200}>
	<TitleBar>
		{#snippet leftControls()}
			<TitleBarLeftControls appIcon={AppsRegular} appName="FluentUI App" />
		{/snippet}
		{#snippet rightControls()}
			<TitleBarRightControls />
		{/snippet}
	</TitleBar>
	<AppSurface style="padding: 1rem">This is the content of the window.</AppSurface>
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
			<TitleBarLeftControls appIcon={AppsRegular} appName="FluentUI App" />
		{/snippet}
		{#snippet search()}
			<AutoSuggestBox placeholder="Search" aria-label="Search" />
		{/snippet}
		{#snippet rightControls()}
			<TitleBarRightControls />
		{/snippet}
	</TitleBar>
	<AppSurface style="padding: 1rem">This is the content of the window.</AppSurface>
</AppWindow>
```

## Shared window context

AppWindow creates a context per instance. Descendant components can call the exported `getAppWindowContext()` during initialization; it returns null outside AppWindow. Call it inside a child component, rather than in the parent that renders AppWindow.

`config.width` and `config.height` expose window dimensions. `state` contains the window `ref`, `active`, `maximized`, `minimized`, and registered `sideNav`, `titleBar`, `globalNav` and `appSurface` parts. Parts are null until mounted and are cleared on unmount. SideNav exposes live `collapsed`, `floating`, `position` and `ref` getters, and `setCollapsed(event, collapsed)`. `globalNav` is the global navigation button of the TitleBar (`TitleBarLeftControls`): its `ref` and `enabled`, which tells SideNav to hide its own hamburger. Nested AppWindow instances have independent contexts.

The host reports maximized/minimized through AppWindow props; these flags do not invoke native APIs or hide the window. TitleBarRightControls inherits maximized unless explicitly overridden. AppSurface inherits active unless overridden and removes its corner radii while its window's SideNav is floating and collapsed.

```svelte
<!-- WindowStatus.svelte -->
<script>
	import { getAppWindowContext } from 'fluentui-svelte';
	const appWindow = getAppWindowContext();
</script>

<p>Maximized: {appWindow?.state.maximized ?? false}</p>
<p>Minimized: {appWindow?.state.minimized ?? false}</p>
<p>Navigation collapsed: {appWindow?.state.sideNav?.collapsed ?? false}</p>
```

## Component Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:AppWindowProps -->

| Name                                                | Type                        | Default  | Description                                                                                                                                           |
| --------------------------------------------------- | --------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ref` _bindable_                                    | `HTMLElement` &#124; `null` |          | The DOM reference of the window element.                                                                                                              |
| `width`                                             | `number` &#124; `string`    | `'100%'` | The width of the window. A number is in pixels, a string is any CSS length.                                                                           |
| `height`                                            | `number` &#124; `string`    | `'100%'` | The height of the window. A number is in pixels, a string is any CSS length.                                                                          |
| `active`                                            | `boolean`                   | `false`  | Whether the window is the active one, which picks the shell shadow it casts: a deeper one while active, a lighter one while inactive.                 |
| `maximized` _bindable_                              | `boolean`                   | `false`  | The maximized state reported by the host. Shared through AppWindow context and inherited by TitleBarRightControls when its maximized prop is omitted. |
| `minimized` _bindable_                              | `boolean`                   | `false`  | The minimized state reported by the host. Shared with window descendants; it does not call a native window API or hide the component.                 |
| `children`                                          | `Snippet`                   |          | The content of the window, such as a `TitleBar` and the page below it.                                                                                |
| `HTMLAttributes<HTMLDivElement>` without `children` |                             |          |                                                                                                                                                       |

<!-- /props:AppWindowProps -->
