# Skeleton

The skeleton component provides a placeholder for content that is loading, giving users a visual indication of where content will appear once it has loaded.

## Usage

The skeleton renders a placeholder element and sizes itself via standard HTML/CSS. Use the `style`, `class`, `width` and `height` attributes (or the `justify` prop) to control its dimensions.

```svelte
<script>
	import { Skeleton } from 'fluentui-svelte';
</script>

<Skeleton style="width: 42px;" />
<Skeleton justify style="height: 12px;" />
```

## Component API

A brief explanation of the props that really need explaining. You can see the rest of the props in the Component Props table below.

## Examples

### Animation

The `animation` prop controls which type of animation is used for the skeleton. It can be set to `pulse` or `wave`. The default is `wave`.

```svelte
<Skeleton style="width: 72px;" animation="pulse" />
```

### Justify

Control if the skeleton should take the full width of its container or not. The default is `false`, meaning it will only take the `1:1` ratio of its width.

```svelte
<Skeleton style="width: 120px;" justify />
```

### Shape

The `shape` prop allows you to change the shape of the skeleton. It can be set to `circle`, `square`, or `rounded`. The default is `rounded`.

```svelte
<Skeleton style="width: 72px;" shape="circle" />
<Skeleton style="width: 72px;" shape="rounded" />
<Skeleton style="width: 72px;" shape="square" />
```

### As

The `as` prop lets you choose the HTML tag used to render the skeleton. Possible values: `'div'` (default) or `'span'`.

```svelte
<Skeleton as="span" style="width: 72px;" />
```

## Component Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:SkeletonProps -->

| Name             | Type                                              | Default     | Description                                                   |
| ---------------- | ------------------------------------------------- | ----------- | ------------------------------------------------------------- |
| `as`             | `'div'` &#124; `'span'`                           | `'div'`     | The HTML element to render the skeleton as.                   |
| `animation`      | `'wave'` &#124; `'pulse'`                         | `'wave'`    | The animation played while the content is loading.            |
| `shape`          | `'circular'` &#124; `'rounded'` &#124; `'square'` | `'rounded'` | The skeleton can have a circular, rounded or square shape.    |
| `justify`        | `boolean`                                         |             | The skeleton is justified to the full width of the container. |
| `ref` _bindable_ | `HTMLElement`                                     |             | The DOM reference of the skeleton element.                    |
| HTML Attributes  |                                                   |             |                                                               |

<!-- /props:SkeletonProps -->
