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

| Name           | Type                     | Description                                                                                            |
| -------------- | ------------------------ | ------------------------------------------------------------------------------------------------------ |
| `size`         | `number`                 | The size of the badge in pixels.                                                                       |
| `shape`        | `string`                 | The shape of the badge. Possible values: 'circular', 'rounded', 'square'.                              |
| `appearance`   | `string`                 | The appearance of the badge. Possible values: 'filled', 'outline', 'ghost', 'tint'.                    |
| `iconPosition` | `string`                 | The position of the icon inside the badge. Possible values: 'before', 'after'.                         |
| `color`        | `string`                 | The color of the badge. Possible values: 'information', 'attention', 'warning', 'success', 'critical'. |
| `icon`         | `Snippet` \| `Component` | The icon to display inside the badge.                                                                  |
| `ref`          | `HTMLSpanElement`        | The DOM reference of the badge element.                                                                |
| `children`     | `Snippet`                | The children elements to render inside the badge.                                                      |

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

| Name    | Type                     | Description                                                                                            |
| ------- | ------------------------ | ------------------------------------------------------------------------------------------------------ |
| `size`  | `number`                 | The size of the badge in pixels.                                                                       |
| `color` | `string`                 | The color of the badge. Possible values: 'information', 'attention', 'warning', 'success', 'critical'. |
| `icon`  | `Snippet` \| `Component` | The icon to display inside the badge.                                                                  |
| `ref`   | `HTMLSpanElement`        | The DOM reference of the badge element.                                                                |
