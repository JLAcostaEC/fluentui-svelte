# Persona

A Persona is a visual representation of a person that combines an avatar, presence status, and up to three lines of descriptive text.

## Usage

```svelte
<script>
	import { Persona } from 'fluentui-svelte';
</script>

<Persona
	name="John Doe"
	primaryText="Software Engineer"
	secondaryText="Intranet"
	tertiaryText="Team A"
	presence={{ status: 'available' }}
	avatar={{ color: 'colorful' }}
/>
```

## Component API

### Text Align

A Persona supports three text alignments, with 'left' as the default position.

```svelte
<Persona name="Alex Johnson" avatar={{ initials: 'AJ' }} secondaryText="Available" />
<Persona name="Alex Johnson" avatar={{ initials: 'AJ' }} secondaryText="Available" textAlign="center" />
<Persona name="Alex Johnson" avatar={{ initials: 'AJ' }} secondaryText="Available" textAlign="right" />
```

### Text Position

A Persona supports four text positions: 'top', 'bottom', 'left', and 'right'. The default position is 'right'.

```svelte
<Persona name="Alex Johnson" avatar={{ initials: 'AJ' }} secondaryText="Available" />
<Persona
	name="Alex Johnson"
	avatar={{ initials: 'AJ' }}
	secondaryText="Available"
	textPosition="bottom"
	textAlign="center"
/>
<Persona name="Alex Johnson" avatar={{ initials: 'AJ' }} secondaryText="Available" textPosition="left" />
<Persona
	name="Alex Johnson"
	avatar={{ initials: 'AJ' }}
	secondaryText="Available"
	textPosition="top"
	textAlign="center"
/>
```

### Size

A Persona supports custom sizes, with a default of 42px. You can set the size using the size prop. This applies to both the avatar or presence-only display and all text.

```svelte
<Persona name="John Doe" size={24} />
<Persona name="John Doe" size={32} />
<Persona name="John Doe" size={56} />
```

### Avatar

A Persona wraps an avatar inside it, which can be customized with all the props available to the Avatar component.

```svelte
<Persona name="John Doe" avatar={{ color: 'attention' }} />
<Persona name="John Doe" avatar={{ color: 'colorful', idForColor: '' }} />
<Persona name="John Doe" avatar={{ image: { src: 'https://placehold.co/96x96/jpeg', alt: 'Placeholder Image' } }} />
```

### Presence

A Persona can display presence information, such as online status or availability. This is controlled through the presence prop, which accepts an object with a status key.

```svelte
<Persona name="John Doe" presence={{ status: 'available' }} />
<Persona name="John Doe" presence={{ status: 'away' }} />
<Persona name="John Doe" presence={{ status: 'busy' }} />
<Persona name="John Doe" presence={{ status: 'do-not-disturb' }} />
<Persona name="John Doe" presence={{ status: 'offline' }} />
<Persona name="John Doe" presence={{ status: 'out-of-office' }} />
<Persona name="John Doe" presence={{ status: 'blocked' }} />
<Persona name="John Doe" presence={{ status: 'unknown' }} />
```

## Component Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:PersonaProps -->

| Name                 | Type                                                       | Default    | Description                                                                                                   |
| -------------------- | ---------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------- |
| `name`               | `string`                                                   |            | The name of the person or entity represented by this Persona. It is also used by the avatar for its initials. |
| `size`               | `number`                                                   | `42`       | The size of the avatar in pixels. The text scales with it.                                                    |
| `primaryText`        | `string`                                                   |            | Text to display below the name.                                                                               |
| `secondaryText`      | `string`                                                   |            | Text to display below the primary text.                                                                       |
| `tertiaryText`       | `string`                                                   |            | Text to display below the secondary text.                                                                     |
| `textAlign`          | `'left'` &#124; `'center'` &#124; `'right'`                | `'left'`   | How the text block is aligned.                                                                                |
| `textPosition`       | `'top'` &#124; `'bottom'` &#124; `'left'` &#124; `'right'` | `'right'`  | Where the text block sits relative to the avatar.                                                             |
| `presenceOnly`       | `boolean`                                                  |            | Renders the presence badge on its own, without the avatar behind it.                                          |
| `avatarAlign`        | `'start'` &#124; `'center'` &#124; `'end'`                 | `'center'` | How the avatar is aligned against the text block.                                                             |
| `element` _bindable_ | `HTMLDivElement`                                           |            | The DOM reference of the persona element.                                                                     |
| `avatar`             | `AvatarProps`                                              |            | The props to spread on the avatar.                                                                            |
| `presence`           | `BadgePresence`                                            |            | The presence badge to display as a status indicator.                                                          |

<!-- /props:PersonaProps -->
