# TitleBar

A title bar is the top bar of an app shell, laid out like the one of a Windows 11 app: the identity of the app and its navigation at the start, a search that grows and shrinks at the center, and the person picture and window controls at the end. It paints no background of its own, since it sits on the component that renders the window.

To create a title bar, you will need to use the following components:

- `TitleBar`: The root component. It lays the three areas out, keeps the search between its width limits and collapses it when asked.
- `TitleBarLeftControls`: The controls at the start of the bar: a back button, a global navigation button, and the icon, the name and the release tag of the app.
- `TitleBarRightControls`: The controls at the end of the bar: custom menus, the person picture, and the minimize, maximize and close buttons of the window.

## Usage

Compose the bar from its three areas through the `leftControls`, `search` and `rightControls` snippets. Every area is optional. `TitleBarLeftControls` and `TitleBarRightControls` read the context of the bar, so they must be rendered inside a `TitleBar`: anywhere else they throw an error. The window buttons only report the press, since minimizing, maximizing and closing the window is up to the host of your app.

```svelte
<script>
	import { TitleBar, TitleBarLeftControls, TitleBarRightControls } from 'fluentui-svelte';
	import { AppsRegular } from 'fluentui-icons-svelte';

	let maximized = $state(false);
</script>

<TitleBar>
	{#snippet leftControls()}
		<TitleBarLeftControls back globalNav appIcon={AppsRegular} appName="FluentUI App" releaseTag="PREVIEW" />
	{/snippet}
	{#snippet rightControls()}
		<TitleBarRightControls
			{maximized}
			personPic={{ name: 'Ada Lovelace' }}
			onMinimize={() => appWindow.minimize()}
			onWindowToggle={() => appWindow.toggleMaximize()}
			onClose={() => appWindow.close()}
		/>
	{/snippet}
</TitleBar>
```

## Examples

### Left Controls

`back` and `globalNav` show a button each and report the press through `onBack` and `onGlobalNav`. Set `globalNavExpanded` while the navigation is open, or pass a snippet to `globalNav` to draw the button yourself.

```svelte
<TitleBar>
	{#snippet leftControls()}
		<TitleBarLeftControls
			back
			globalNav
			globalNavExpanded={navExpanded}
			onBack={() => history.back()}
			onGlobalNav={() => (navExpanded = !navExpanded)}
			appIcon={AppsRegular}
			appName="FluentUI App"
		/>
	{/snippet}
</TitleBar>
```

### App Icon

`appIcon` takes the URL of an image, a Fluent icon component, or a snippet that draws a custom SVG. It is decorative, so the name of the app is what identifies it.

```svelte
<TitleBar>
	{#snippet leftControls()}
		<TitleBarLeftControls appIcon="/logo.png" appName="Image URL" />
	{/snippet}
</TitleBar>

<TitleBar>
	{#snippet leftControls()}
		<TitleBarLeftControls appIcon={AppsRegular} appName="Fluent icon" />
	{/snippet}
</TitleBar>

<TitleBar>
	{#snippet leftControls()}
		<TitleBarLeftControls appName="Custom SVG">
			{#snippet appIcon(props)}
				<svg {...props} viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="currentColor" /></svg>
			{/snippet}
		</TitleBarLeftControls>
	{/snippet}
</TitleBar>
```

### Release Tag

`releaseTag` marks the release status of the app, such as PREVIEW or BETA, in a badge next to its name. It takes a string or a snippet.

```svelte
<TitleBar>
	{#snippet leftControls()}
		<TitleBarLeftControls appIcon={AppsRegular} appName="FluentUI App" releaseTag="PREVIEW" />
	{/snippet}
</TitleBar>

<TitleBar>
	{#snippet leftControls()}
		<TitleBarLeftControls appIcon={AppsRegular} appName="FluentUI App" releaseTag="BETA" />
	{/snippet}
</TitleBar>
```

### Search

The `search` snippet sits at the center of the bar and takes up the width the bar gives it, growing and shrinking with the window. A bar with a search is `tall` by default, which leaves the search room to breathe.

```svelte
<TitleBar searchMinWidth={120}>
	{#snippet leftControls()}
		<TitleBarLeftControls appIcon={AppsRegular} appName="FluentUI App" />
	{/snippet}
	{#snippet search()}
		<AutoSuggestBox placeholder="Search" aria-label="Search">
			<AutoSuggestBoxOption index={0} value="Documents">Documents</AutoSuggestBoxOption>
			<AutoSuggestBoxOption index={1} value="Pictures">Pictures</AutoSuggestBoxOption>
		</AutoSuggestBox>
	{/snippet}
	{#snippet rightControls()}
		<TitleBarRightControls />
	{/snippet}
</TitleBar>
```

### Search Width

`searchMinWidth` and `searchMaxWidth` set how far the search shrinks and grows. A number is in pixels and a string is any CSS length.

```svelte
<TitleBar searchMinWidth={100} searchMaxWidth={180}>...</TitleBar>
<TitleBar searchMinWidth="30%" searchMaxWidth="60%">...</TitleBar>
```

### Collapsed Search

`searchCollapsed` folds the search into a button, for a window too narrow to hold it. Pressing the button expands the search and moves the focus into it. Bind it to follow the state.

```svelte
<script>
	let collapsed = $state(false);
</script>

<TitleBar searchMinWidth={120} bind:searchCollapsed={collapsed}>
	{#snippet search()}
		<AutoSuggestBox placeholder="Search" aria-label="Search" />
	{/snippet}
	...
</TitleBar>
```

### Window Controls

`hideMinimize`, `hideWindowToggle` and `hideClose` each take a window button out of the bar. `onMinimize`, `onWindowToggle` and `onClose` report the press.

```svelte
<TitleBar>
	{#snippet rightControls()}
		<TitleBarRightControls />
	{/snippet}
</TitleBar>

<TitleBar>
	{#snippet rightControls()}
		<TitleBarRightControls hideMinimize />
	{/snippet}
</TitleBar>

<TitleBar>
	{#snippet rightControls()}
		<TitleBarRightControls hideWindowToggle />
	{/snippet}
</TitleBar>

<TitleBar>
	{#snippet rightControls()}
		<TitleBarRightControls hideClose />
	{/snippet}
</TitleBar>

<TitleBar>
	{#snippet rightControls()}
		<TitleBarRightControls hideMinimize hideWindowToggle />
	{/snippet}
</TitleBar>
```

### Maximized

While `maximized` is set, the maximize button becomes a restore button, with the icon and the label that go with it.

```svelte
<script>
	let maximized = $state(false);
</script>

<TitleBar>
	{#snippet rightControls()}
		<TitleBarRightControls {maximized} onWindowToggle={() => (maximized = !maximized)} />
	{/snippet}
</TitleBar>
```

### Person Picture

`personPic` takes the props of an `Avatar`, such as its `image`, drawn at 24 pixels unless you set a size. Add `onPersonPicClick` to turn the picture into a button, such as the one that opens an account.

```svelte
<TitleBar>
	{#snippet rightControls()}
		<TitleBarRightControls personPic={{ name: 'Ada Lovelace', image: { src: 'https://placehold.co/120x120/jpeg' } }} />
	{/snippet}
</TitleBar>

<TitleBar>
	{#snippet rightControls()}
		<TitleBarRightControls
			personPic={{ name: 'Grace Hopper', image: { src: 'https://placehold.co/120x120/jpeg' }, size: 28 }}
			onPersonPicClick={() => openAccount()}
		/>
	{/snippet}
</TitleBar>
```

### Custom Menu

The `customMenu` snippet places your own actions before the person picture, such as a settings menu.

```svelte
<TitleBar>
	{#snippet rightControls()}
		<TitleBarRightControls personPic={{ name: 'Ada Lovelace', image: { src: 'https://placehold.co/120x120/jpeg' } }}>
			{#snippet customMenu()}
				<Menu>
					<MenuTrigger>
						{#snippet children({ state, menuTriggerProps })}
							<Button bind:ref={state.ref} {...menuTriggerProps} appearance="subtle" aria-label="Settings">
								<SettingsRegular width="1rem" height="1rem" />
							</Button>
						{/snippet}
					</MenuTrigger>
					<MenuPopover>
						<MenuList>
							<MenuItem>Preferences</MenuItem>
							<MenuItem>Keyboard shortcuts</MenuItem>
						</MenuList>
					</MenuPopover>
				</Menu>
			{/snippet}
		</TitleBarRightControls>
	{/snippet}
</TitleBar>
```

### Labels

The accessible names of the buttons default to English. Pass `backLabel`, `globalNavLabel`, `searchLabel`, `minimizeLabel`, `maximizeLabel`, `restoreLabel` and `closeLabel` to translate them.

```svelte
<TitleBar>
	{#snippet leftControls()}
		<TitleBarLeftControls back globalNav backLabel="Atrás" globalNavLabel="Menú de navegación" />
	{/snippet}
	{#snippet rightControls()}
		<TitleBarRightControls
			minimizeLabel="Minimizar"
			maximizeLabel="Maximizar"
			restoreLabel="Restaurar"
			closeLabel="Cerrar"
		/>
	{/snippet}
</TitleBar>
```

### Tab Order

The buttons of the bar are out of the tab order by default, like the ones of a window title bar, though they can still be pressed with the pointer. Set `tabbable` to let the Tab key reach them. The content you place in the snippets is yours to manage, so it keeps the tab order it has.

```svelte
<TitleBar tabbable>
	{#snippet leftControls()}
		<TitleBarLeftControls back globalNav appName="Contoso" />
	{/snippet}
	{#snippet rightControls()}
		<TitleBarRightControls />
	{/snippet}
</TitleBar>
```

### Drag Region

`dragRegionProps` is spread on the bar and on its start and end areas, so a host that moves the window can tell where to grab the bar. Use `data-tauri-drag-region` for Tauri, or a pointer handler for any other host.

```svelte
<TitleBar dragRegionProps={{ 'data-tauri-drag-region': true }}>...</TitleBar>

<TitleBar dragRegionProps={{ onpointerdown: (e) => e.target === e.currentTarget && appWindow.startDragging() }}>
	...
</TitleBar>
```

## Component Props (TitleBar)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:TitleBarProps -->

| Name                                             | Type                     | Default    | Description                                                                                                                                                                                                                            |
| ------------------------------------------------ | ------------------------ | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ref` _bindable_                                 | `HTMLElement`            |            | The DOM reference of the title bar element.                                                                                                                                                                                            |
| `leftControls`                                   | `Snippet`                |            | The controls at the start of the bar: back, navigation, and the identity of the app. Render a `TitleBarLeftControls` here, which only works inside a `TitleBar`.                                                                       |
| `search`                                         | `Snippet`                |            | The search at the center of the bar, which grows and shrinks with the window between `searchMinWidth` and `searchMaxWidth`.                                                                                                            |
| `rightControls`                                  | `Snippet`                |            | The controls at the end of the bar: custom menus, the person picture, and the window buttons. Render a `TitleBarRightControls` here, which only works inside a `TitleBar`.                                                             |
| `tall`                                           | `boolean`                |            | Uses the tall bar, which leaves a search room to breathe. It is on by default when `search` is provided.                                                                                                                               |
| `searchMinWidth`                                 | `number` &#124; `string` | `200`      | The narrowest the search gets while the window shrinks. A number is in pixels, a string is any CSS length.                                                                                                                             |
| `searchMaxWidth`                                 | `number` &#124; `string` | `480`      | The widest the search gets while the window grows. A number is in pixels, a string is any CSS length.                                                                                                                                  |
| `searchCollapsed` _bindable_                     | `boolean`                | `false`    | Collapses the search into a button. Pressing the button expands the search again and moves the focus into it.                                                                                                                          |
| `searchLabel`                                    | `string`                 | `'Search'` | The accessible name of the button that stands in for a collapsed search.                                                                                                                                                               |
| `tabbable`                                       | `boolean`                | `false`    | Lets the Tab key reach the buttons of the bar, which are skipped by default, as the buttons of a window title bar are. They can still be pressed and focused with the pointer. The content you render in the snippets is not affected. |
| `dragRegionProps`                                | `HTMLAttributes`         |            | The attributes that make the bar draggable for the host that moves the window, such as `data-tauri-drag-region` for Tauri. They are spread on the bar and on its start and end areas.                                                  |
| `HTMLAttributes<HTMLElement>` without `children` |                          |            |                                                                                                                                                                                                                                        |

<!-- /props:TitleBarProps -->

## Component Props (TitleBarLeftControls)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:TitleBarLeftControlsProps -->

| Name                                                | Type                                         | Default             | Description                                                                                        |
| --------------------------------------------------- | -------------------------------------------- | ------------------- | -------------------------------------------------------------------------------------------------- |
| `ref` _bindable_                                    | `HTMLDivElement`                             |                     | The DOM reference of the controls element.                                                         |
| `back`                                              | `boolean`                                    | `false`             | Shows the back button.                                                                             |
| `backDisabled`                                      | `boolean`                                    | `false`             | Disables the back button, for when there is nowhere to go back to.                                 |
| `onBack`                                            | `MouseEventHandler<HTMLButtonElement>`       |                     | Called when the back button is pressed.                                                            |
| `backLabel`                                         | `string`                                     | `'Back'`            | The accessible name of the back button.                                                            |
| `globalNav`                                         | `boolean` &#124; `Snippet`                   | `false`             | Shows the global navigation button, or replaces it with the snippet you provide.                   |
| `globalNavExpanded`                                 | `boolean`                                    | `false`             | Whether the navigation the global navigation button controls is expanded.                          |
| `onGlobalNav`                                       | `MouseEventHandler<HTMLButtonElement>`       |                     | Called when the global navigation button is pressed.                                               |
| `globalNavLabel`                                    | `string`                                     | `'Navigation menu'` | The accessible name of the global navigation button.                                               |
| `appIcon`                                           | `string` &#124; `Snippet` &#124; `Component` |                     | The icon of the app: the URL of an image, an icon component, or a snippet that draws a custom SVG. |
| `appName`                                           | `string`                                     |                     | The name of the app.                                                                               |
| `releaseTag`                                        | `string` &#124; `Snippet`                    |                     | The release status of the app, such as `PREVIEW` or `BETA`.                                        |
| `children`                                          | `Snippet`                                    |                     | More content after the release tag, such as a subtitle.                                            |
| `HTMLAttributes<HTMLDivElement>` without `children` |                                              |                     |                                                                                                    |

<!-- /props:TitleBarLeftControlsProps -->

## Component Props (TitleBarRightControls)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:TitleBarRightControlsProps -->

| Name                                                | Type                                   | Default      | Description                                                                             |
| --------------------------------------------------- | -------------------------------------- | ------------ | --------------------------------------------------------------------------------------- |
| `ref` _bindable_                                    | `HTMLDivElement`                       |              | The DOM reference of the controls element.                                              |
| `hideMinimize`                                      | `boolean`                              | `false`      | Hides the minimize button.                                                              |
| `hideWindowToggle`                                  | `boolean`                              | `false`      | Hides the maximize and restore button.                                                  |
| `hideClose`                                         | `boolean`                              | `false`      | Hides the close button.                                                                 |
| `maximized`                                         | `boolean`                              | `false`      | Whether the window is maximized, which turns the maximize button into a restore button. |
| `onMinimize`                                        | `MouseEventHandler<HTMLButtonElement>` |              | Called when the minimize button is pressed.                                             |
| `onWindowToggle`                                    | `MouseEventHandler<HTMLButtonElement>` |              | Called when the maximize or restore button is pressed.                                  |
| `onClose`                                           | `MouseEventHandler<HTMLButtonElement>` |              | Called when the close button is pressed.                                                |
| `minimizeLabel`                                     | `string`                               | `'Minimize'` | The accessible name of the minimize button.                                             |
| `maximizeLabel`                                     | `string`                               | `'Maximize'` | The accessible name of the maximize button.                                             |
| `restoreLabel`                                      | `string`                               | `'Restore'`  | The accessible name of the restore button.                                              |
| `closeLabel`                                        | `string`                               | `'Close'`    | The accessible name of the close button.                                                |
| `personPic`                                         | `AvatarProps`                          |              | The props of the `Avatar` that shows the person. Its size is 24 unless you set one.     |
| `onPersonPicClick`                                  | `MouseEventHandler<HTMLButtonElement>` |              | Called when the person picture is pressed, which turns it into a button.                |
| `customMenu`                                        | `Snippet`                              |              | The custom menus or actions placed before the person picture.                           |
| `HTMLAttributes<HTMLDivElement>` without `children` |                                        |              |                                                                                         |

<!-- /props:TitleBarRightControlsProps -->
