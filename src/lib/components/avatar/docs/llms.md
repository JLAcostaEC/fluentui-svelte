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

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:AvatarProps -->

| Name               | Type                                                                           | Default       | Description                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------ | ------------- | --------------------------------------------------------------------------------------------------------------- |
| `name`             | `string`                                                                       | `'Avatar'`    | The name of the person or entity represented by this Avatar. This should always be provided if it is available. |
| `image`            | `{ src: string; }`                                                             |               | The Avatar's image                                                                                              |
| `ref` _bindable_   | `HTMLDivElement`                                                               |               | The DOM reference of the avatar element.                                                                        |
| `size`             | `number`                                                                       | `48`          | Size of the avatar in pixels.                                                                                   |
| `shape`            | `'circular'` &#124; `'rounded'` &#124; `'square'`                              | `'circular'`  | The avatar can have a circular, rounded or square shape.                                                        |
| `color`            | [`Colors`](https://fluentui-svelte.dev/docs/types/#colors) &#124; `'colorful'` | `'attention'` | The color when displaying either an icon or initials. For now it only supports system colors (plus colorful).   |
| `active`           | `'active'` &#124; `'inactive'`                                                 |               | Optional activity indicator                                                                                     |
| `activeAppearance` | `'ring'` &#124; `'shadow'` &#124; `'ring-shadow'`                              | `'ring'`      | The appearance when `active="active"`                                                                           |
| `initials`         | `string`                                                                       | `name`        | Custom initials by default they will be derived from the `name` prop.                                           |
| `idForColor`       | `string`                                                                       |               | Specify a string to be used instead of the name, to determine which color to use when color="colorful".         |
| `icon`             | `Snippet` &#124; `Component`                                                   |               | Icon to be displayed when the avatar doesn't have an image or initials.                                         |
| `badge`            | `BadgePresence`                                                                |               | The badge to display as a status indicator. (you can use with a custom icon)                                    |
| HTML Attributes    |                                                                                |               |                                                                                                                 |

<!-- /props:AvatarProps -->
