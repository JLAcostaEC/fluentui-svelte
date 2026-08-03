# Avatar

An Avatar is a graphical representation of a user, team, or entity.

Avatar can display an image, icon, or initials, and supports different sizes, shapes, and status indicators.

## Usage

```svelte
<script>
	import { Avatar } from 'fluentui-svelte';
</script>

<Avatar size={40} name="FluentUI Svelte" />
```

## Component API

A brief explanation of the props that really need explaining. You can see the rest of the props in the Component Props table below.

## Examples

### Image

An avatar can display an image. It is recommended to also include a name in addition to the image: the initials from the name are displayed while the image is loading, and the name makes the Avatar accessible to screen readers.

```svelte
<Avatar
	active="active"
	size={56}
	name="FluentUI Svelte"
	image={{ src: 'https://placehold.co/120x120/jpeg' }}
	badge={{ status: 'do-not-disturb' }}
/>
```

### Icon

An avatar can display an icon. The icon will only be shown when there is no image or initials available.

```svelte
<script>
	import { ClockRegular } from 'fluentui-icons-svelte';
</script>

<Avatar active="active" size={56} name="FluentUI Svelte" icon={ClockRegular} color="information" />
```

### Badge

An avatar can have a badge to indicate presence status. See the PresenceBadge component for more info.

```svelte
<Avatar active="active" size={56} name="FluentUI Svelte" badge={{ status: 'available' }} />
```

### Shape

An avatar can have a square, circular, or rounded shape.

```svelte
<Avatar active="active" size={56} name="FluentUI Svelte" badge={{ status: 'available' }} />
<Avatar active="active" size={56} name="FluentUI Svelte" badge={{ status: 'available' }} shape="rounded" />
<Avatar active="active" size={56} name="FluentUI Svelte" badge={{ status: 'available' }} shape="square" />
```

### Color: colorful

An avatar can have its color automatically picked based on the name prop, or idForColor can be used if a name is not available.

```svelte
<Avatar active="active" size={56} name="FluentUI Svelte" color="colorful" />
<Avatar active="active" size={56} name="FluentUI Svelte" color="colorful" />
<Avatar active="active" size={56} name="FluentUI Svelte" color="colorful" />
```

## Component Props

| Name               | Type                     | Description                                                                                                                                                                              |
| ------------------ | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`             | `string`                 | The name of the person or entity represented by this Avatar. Used to determine initials and for accessibility tools.                                                                     |
| `image`            | `{ src: string }`        | The Avatar image. It can only be a single image URL.                                                                                                                                     |
| `ref`              | `HTMLDivElement`         | The DOM reference of the avatar element.                                                                                                                                                 |
| `size`             | `number`                 | Size of the avatar in pixels.                                                                                                                                                            |
| `shape`            | `string`                 | The shape of the avatar. Possible values: 'circular', 'rounded', 'square'.                                                                                                               |
| `color`            | `string`                 | The color used when displaying either an icon or initials. Supports system colors. Possible values: 'information', 'attention', 'warning', 'success', 'critical', 'colorful'.            |
| `active`           | `string`                 | Optional activity indicator. Possible values: 'active', 'inactive'. Active decorates the avatar according to activeAppearance. Inactive reduces size and makes it partially transparent. |
| `activeAppearance` | `string`                 | The appearance used when active is set to active. Possible values: 'ring', 'shadow', 'ring-shadow'.                                                                                      |
| `initials`         | `string`                 | Custom initials. By default, initials are derived from the name prop using the getInitials function. They are displayed when there is no image.                                          |
| `idForColor`       | `string`                 | A string used instead of the name to determine the color when color is set to colorful. Useful when a name is unavailable but another unique identifier exists.                          |
| `icon`             | `Snippet` \| `Component` | The icon to display when the avatar does not have an image or initials.                                                                                                                  |
| `badge`            | `object`                 | The badge to display as a status indicator. It can include a custom icon.                                                                                                                |
