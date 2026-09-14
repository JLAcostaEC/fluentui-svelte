# Badge

A badge is a visual decoration for UI elements used to display notifications, status indicators, or counts. It supports different colors and styles to match various UI needs.

## Usage

```svelte
<script>
	import { Badge } from 'fluentui-svelte';
</script>

<Badge>36</Badge>
```

## Badge API

A brief explanation of the props that really need explaining. You can see the rest of the props here.

## Examples

### Appearance

Use the appearance prop to switch between filled, outline, tint, and ghost styles.

```svelte
<Badge size={46} color="attention">5</Badge>
<Badge size={46} color="attention" appearance="outline">5</Badge>
<Badge size={46} color="attention" appearance="tint">5</Badge>
<Badge size={46} color="attention" appearance="ghost">5</Badge>
```

### Sizes

Use the size prop to control the badge dimensions.

```svelte
<Badge size={42} color="attention">46</Badge>
<Badge size={56} color="attention">56</Badge>
<Badge size={64} color="attention">64</Badge>
<Badge size={96} color="attention">96</Badge>
```

### Shapes

Use the shape prop to render circular, rounded, or square badges.

```svelte
<Badge size={36} color="attention">36</Badge>
<Badge size={36} color="attention" shape="rounded">36</Badge>
<Badge size={36} color="attention" shape="square">36</Badge>
```

### Color

Use the color prop to communicate different statuses and priorities.

```svelte
<Badge size={36} color="information">I</Badge>
<Badge size={36} color="attention">A</Badge>
<Badge size={36} color="warning">W</Badge>
<Badge size={36} color="critical">C</Badge>
<Badge size={36} color="success">S</Badge>
```

### Icon

Use the icon prop to render an icon inside the badge. You can pass the icon as a snippet or as a component.

> **Only icon?** If you use this component and notice padding between the wrapper and the icon, use the BadgeIcon component instead to avoid it.

```svelte
<script>
	import { Badge } from 'fluentui-svelte';
	import { AccessibilityRegular } from 'fluentui-icons-svelte';
</script>

<Badge color="attention" size={96} icon={AccessibilityRegular} />
```

## Badge Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:BadgeProps -->

| Name             | Type                                                           | Default         | Description                                                                               |
| ---------------- | -------------------------------------------------------------- | --------------- | ----------------------------------------------------------------------------------------- |
| `size`           | `number`                                                       | `20`            | The size of the badge in pixels.                                                          |
| `shape`          | `'circular'` &#124; `'rounded'` &#124; `'square'`              | `'circular'`    | The badge can have a circular, rounded or square shape.                                   |
| `appearance`     | `'filled'` &#124; `'outline'` &#124; `'ghost'` &#124; `'tint'` | `'filled'`      | The badge can have its background and border styled for greater emphasis or to be subtle. |
| `iconPosition`   | `'before'` &#124; `'after'`                                    | `'before'`      | The position of the icon relative to the badge content.                                   |
| `color`          | [`Colors`](https://fluentui-svelte.dev/docs/types/#colors)     | `'information'` | The color of the badge. For now it only supports system colors.                           |
| `icon`           | `Snippet` &#124; `Component`                                   |                 | Icon to render inside the badge.                                                          |
| `ref` _bindable_ | `HTMLSpanElement`                                              |                 | The DOM reference of the badge element.                                                   |
| HTML Attributes  |                                                                |                 |                                                                                           |

<!-- /props:BadgeProps -->

## BadgeIcon API

This component is useful when you want to show an icon in the form of a Badge somewhere in your app.

### Usage

```svelte
<script>
	import { BadgeIcon } from 'fluentui-svelte';
	import { AccessibilityRegular } from 'fluentui-icons-svelte';
</script>

<BadgeIcon size={96} icon={AccessibilityRegular} />
```

One example is using this component inside Avatar:

By default, Avatar uses an instance of BadgeIcon. As you can see, the first example on the left uses the Badge component, which adds unwanted padding inside it. In Avatar, you can use one of the predefined BadgeIcon options, or set a custom icon by passing it as a property. When you use the component option, the styles are applied automatically, but with #snippet you need to make sure you pass the arguments to the icon like this:

```svelte
<script>
	import { Avatar, Badge } from 'fluentui-svelte';
	import { AccessibilityRegular } from 'fluentui-icons-svelte';
</script>

<!-- args: [size: number, shape: string] -->
{#snippet customBadge(args)}
	<Badge color="attention" size={args.width} aria-hidden={args['aria-hidden']} icon={AccessibilityRegular} />
{/snippet}

<Avatar active="active" size={96} name="FluentUI Svelte" badge={{ icon: customBadge }} />
```

### BadgeIcon Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:BadgeIconProps -->

| Name             | Type                                                           | Default       | Description                                                                        |
| ---------------- | -------------------------------------------------------------- | ------------- | ---------------------------------------------------------------------------------- |
| `status`         | [`Statuses`](https://fluentui-svelte.dev/docs/types/#statuses) | `'available'` | The presence status to display. It picks both the icon and the color of the badge. |
| `outOfOffice`    | `boolean`                                                      | `false`       | Decorates the presence icon to signal that the person is out of office.            |
| `size`           | `number`                                                       | `20`          | The size of the badge in pixels.                                                   |
| `color`          | [`Colors`](https://fluentui-svelte.dev/docs/types/#colors)     |               | Overrides the color the status would pick on its own.                              |
| `icon`           | `Snippet` &#124; `Component`                                   |               | Custom icon, rendered instead of the one the status would pick on its own.         |
| `ref` _bindable_ | `HTMLSpanElement`                                              |               | The DOM reference of the badge element.                                            |
| HTML Attributes  |                                                                |               |                                                                                    |

<!-- /props:BadgeIconProps -->
