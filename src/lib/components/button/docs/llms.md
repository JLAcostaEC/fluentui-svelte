# Button

A button triggers an action or event when activated and supports three visual appearances: accent, standard, and subtle.

## Usage

```svelte
<script>
	import { Button } from 'fluentui-svelte';
</script>

<Button>I am a Button</Button>
```

## Component API

A brief explanation of the props that really need explaining. You can see the rest of the props in the Component Props table below.

## Examples

### As

You can control which tag the button component should use: button, a, or div.

```svelte
<Button>I am a Button</Button>
<Button as="a" href="/">I am a Anchor</Button>
<Button as="div">I am a Div</Button>
```

### Shape

A button can be rounded, circular, or square. Default: rounded.

```svelte
<Button shape="circular" />
<Button />
<Button shape="square" />
```

### Appearance

A button can have its content and borders styled for greater emphasis or to be subtle.

```svelte
<Button appearance="accent" />
<Button appearance="standard" />
<Button appearance="subtle" />
```

## Component Props

| Name                | Type                   | Description                                                                                       |
| ------------------- | ---------------------- | ------------------------------------------------------------------------------------------------- |
| `ref`               | `HTMLElement`          | The DOM reference of the button element.                                                          |
| `as`                | `string`               | The DOM element to render. Possible values: 'button', 'a', 'div'.                                 |
| `disabled`          | `boolean`              | Disables user interaction.                                                                        |
| `shape`             | `string`               | The shape of the button or buttons. Possible values: 'circular', 'rounded', 'square'.             |
| `appearance`        | `string`               | The appearance of the button or buttons. Possible values: 'accent', 'standard', 'subtle'.         |
| `disabledFocusable` | `boolean`              | Allows the button to be focusable even when disabled.                                             |
| `isMenuButton`      | `boolean`              | Adds an icon that indicates the button triggers a menu.                                           |
| `indicatorPosition` | `'before' \| 'after'`  | The position of the icon. Possible values: 'before', 'after'.                                     |
| `indicatorIcon`     | `Snippet \| Component` | The icon used as the menu indicator. Defaults to a chevron-down icon.                             |
| Element Attributes  |                        | Based on the chosen component tag, you will get autocomplete for all HTML attributes of that tag. |

## Split Button

A split button is a special type of button that combines a standard button with a menu button to provide users with a primary action and additional options.

### Usage

```svelte
<script>
	import { SplitButton } from 'fluentui-svelte';
</script>

<SplitButton />
<SplitButton appearance="standard" />
<SplitButton appearance="subtle" />
<SplitButton shape="circular" />
<SplitButton shape="circular" appearance="standard" />
<SplitButton shape="circular" appearance="subtle" />
```

### Adding a Menu

To add a menu to the split button, please refer to the Menu documentation for details on how to create menus and pass them as a prop to the SplitButton component.

### Component Props

| Name                      | Type                    | Description                                                                               |
| ------------------------- | ----------------------- | ----------------------------------------------------------------------------------------- |
| `wrapperRef`              | `HTMLDivElement`        | The DOM reference of the split button wrapper element.                                    |
| `primaryButtonRef`        | `HTMLButtonElement`     | The DOM reference of the primary button element.                                          |
| `primaryButtonProps`      | `ButtonProps<'button'>` | Additional props to pass to the primary button.                                           |
| `menuTriggerRef`          | `HTMLButtonElement`     | The DOM reference of the menu trigger button element.                                     |
| `menuTriggerProps`        | `ButtonProps<'button'>` | Additional props to pass to the menu trigger button.                                      |
| `class`                   | `string`                | Additional classes to add to the split button wrapper element.                            |
| `shape`                   | `string`                | The shape of the button or buttons. Possible values: 'circular', 'rounded', 'square'.     |
| `appearance`              | `string`                | The appearance of the button or buttons. Possible values: 'accent', 'standard', 'subtle'. |
| `disabled`                | `boolean`               | Disables user interaction.                                                                |
| WrapperElement Attributes | HTMLElement Attributes  | All other attributes can be applied to the split button wrapper element.                  |
