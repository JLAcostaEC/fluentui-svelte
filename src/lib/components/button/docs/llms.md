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

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:ButtonProps -->

| Name                | Type                                              | Default     | Description                                                                            |
| ------------------- | ------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------- |
| `ref` _bindable_    | `ButtonElementDOMType[T]`                         |             | The DOM reference of the button element.                                               |
| `as`                | `'button'` &#124; `'a'` &#124; `'div'`            | `'button'`  | The DOM element to render.                                                             |
| `disabled`          | `boolean`                                         |             | Disables the user interaction.                                                         |
| `shape`             | `'circular'` &#124; `'rounded'` &#124; `'square'` | `'rounded'` | A button can be rounded, circular, or square.                                          |
| `appearance`        | `'accent'` &#124; `'standard'` &#124; `'subtle'`  | `'accent'`  | A button can have its content and borders styled for greater emphasis or to be subtle. |
| `disabledFocusable` | `boolean`                                         | `false`     | When set, allows the button to be focusable even when it has been disabled.            |
| `isMenuButton`      | `boolean`                                         |             | Add an icon that indicates the button triggers a menu.                                 |
| `indicatorPosition` | `'before'` &#124; `'after'`                       | `'after'`   | Position of the menu indicator relative to the button content.                         |
| `indicatorIcon`     | `Snippet` &#124; `Component`                      |             | The icon used to indicate the button triggers a menu.                                  |
| HTML Attributes     |                                                   |             |                                                                                        |

<!-- /props:ButtonProps -->

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

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:SplitButtonProps -->

| Name                          | Type                                              | Default     | Description                                                                                  |
| ----------------------------- | ------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------- |
| `appearance`                  | `'accent'` &#124; `'standard'` &#124; `'subtle'`  | `'accent'`  | Both buttons can have their content and borders styled for greater emphasis or to be subtle. |
| `shape`                       | `'circular'` &#124; `'rounded'` &#124; `'square'` | `'rounded'` | Both buttons can be rounded, circular, or square.                                            |
| `disabled`                    | `boolean`                                         | `false`     | Disables the user interaction on both buttons.                                               |
| `primaryButtonProps`          | `ButtonProps`                                     |             | The props to spread on the primary button.                                                   |
| `menuTriggerProps`            | `ButtonProps`                                     |             | The props to spread on the button that opens the menu.                                       |
| `wrapperRef` _bindable_       | `HTMLDivElement`                                  |             | The DOM reference of the element wrapping both buttons.                                      |
| `primaryButtonRef` _bindable_ | `HTMLButtonElement`                               |             | The DOM reference of the primary button.                                                     |
| `menuTriggerRef` _bindable_   | `HTMLButtonElement`                               |             | The DOM reference of the button that opens the menu.                                         |
| HTML Attributes               |                                                   |             |                                                                                              |

<!-- /props:SplitButtonProps -->
