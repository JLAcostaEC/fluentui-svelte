# AppSurface

An app surface is the area of an app that holds its content, next to the navigation. It rounds its top-left and bottom-right corners, and it is either a `layer` over the window or the `mica` of the window itself, in the colors of an active or an inactive window.

## Usage

Put the content of the app inside the surface, usually in the space an `AppWindow` has left once the navigation takes its place. The surface grows to fill the room its container leaves it, scrolls its content when it does not fit, and is a `layer` unless you set another `mode`.

```svelte
<script>
	import { AppSurface, AppWindow } from 'fluentui-svelte';
</script>

<AppWindow width={400} height={160}>
	<AppSurface style="padding: 1rem">This is the content of the app.</AppSurface>
</AppWindow>
```

## Examples

### Mode

`layer`, the default, is a layer over the window, with the stroke of a card. `mica` paints the base of the window itself, with the stroke of a control surface.

```svelte
<AppWindow width={400} height={120}>
	<div style="display: flex; flex: 1; min-height: 0">
		<div style="flex: none; width: 3rem"></div>
		<AppSurface mode="layer" style="padding: 1rem">Layer</AppSurface>
	</div>
</AppWindow>

<AppWindow width={400} height={120}>
	<div style="display: flex; flex: 1; min-height: 0">
		<div style="flex: none; width: 3rem"></div>
		<AppSurface mode="mica" style="padding: 1rem">Mica</AppSurface>
	</div>
</AppWindow>
```

### Active and Inactive

`active` tells whether the window the surface lives in is the active one. A `layer` is solid while active and translucent while inactive, which is the default; `mica` paints the same base in both states. Set it from the same focus state as the window.

```svelte
<script>
	let active = $state(false);
</script>

<AppWindow {active} width={400} height={120}>
	<div style="display: flex; flex: 1; min-height: 0">
		<div style="flex: none; width: 3rem"></div>
		<AppSurface {active} style="padding: 1rem">Layer</AppSurface>
	</div>
</AppWindow>
```

## Component Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:AppSurfaceProps -->

| Name                                                | Type                      | Default   | Description                                                                                      |
| --------------------------------------------------- | ------------------------- | --------- | ------------------------------------------------------------------------------------------------ |
| `ref` _bindable_                                    | `HTMLElement`             |           | The DOM reference of the surface element.                                                        |
| `mode`                                              | `'layer'` &#124; `'mica'` | `'layer'` | The material of the surface: a `layer` over the window, or the `mica` of the window itself.      |
| `active`                                            | `boolean`                 | `false`   | Whether the window the surface lives in is the active one, which picks the color of the surface. |
| `children`                                          | `Snippet`                 |           | The content of the surface.                                                                      |
| `HTMLAttributes<HTMLDivElement>` without `children` |                           |           |                                                                                                  |

<!-- /props:AppSurfaceProps -->
