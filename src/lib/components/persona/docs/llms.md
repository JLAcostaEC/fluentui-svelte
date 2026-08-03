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

| Name            | Type             | Description                                                                                                                                                                  |
| --------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`          | `string`         | The full name of the person.                                                                                                                                                 |
| `primaryText`   | `string`         | Main text, usually the person's role or title.                                                                                                                               |
| `secondaryText` | `string`         | Secondary text, for example location or status.                                                                                                                              |
| `tertiaryText`  | `string`         | Tertiary text, for example team or department.                                                                                                                               |
| `size`          | `number`         | Size in pixels for the avatar and text.                                                                                                                                      |
| `textAlign`     | `string`         | Alignment of the text. Possible values are 'left', 'center', and 'right'.                                                                                                    |
| `textPosition`  | `string`         | Position of the text relative to the avatar. Possible values are 'top', 'bottom', 'left', and 'right'.                                                                       |
| `avatarAlign`   | `string`         | Cross-axis alignment of the avatar relative to the text. Possible values are 'start', 'center', and 'end'.                                                                   |
| `avatar`        | `object`         | Avatar props object. See the Avatar component for details.                                                                                                                   |
| `presence`      | `object`         | Presence object, for example { status: 'available' }. Status values are 'available', 'away', 'busy', 'do-not-disturb', 'offline', 'out-of-office', 'blocked', and 'unknown'. |
| `presenceOnly`  | `boolean`        | Shows only the presence indicator, with no avatar or text.                                                                                                                   |
| `element`       | `HTMLDivElement` | The DOM reference of the persona root element.                                                                                                                               |
