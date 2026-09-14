# Radio Button

The Radio Button component lets users choose a single option from a set of mutually exclusive choices.

## Usage

```svelte
<script>
	import { RadioButton } from 'fluentui-svelte';
</script>

<RadioButton label="Option 1" />
```

## Component API

A brief explanation of the props that really need explaining. You can see the rest of the props in the Component Props section below.

## Examples

### Grouping

While you can use name="inputName" to group items and have only one checked, you can use bind:group={someVariable} to update that variable with the value of the selected input and inspect it in your console. (Read More: https://svelte.dev/tutorial/svelte/group-inputs)

```svelte
<script>
	import { RadioButton } from 'fluentui-svelte';
	let groupValue = $state('');
	$inspect(groupValue);
</script>

<RadioButton label="Option 1" name="group1" value="$1" bind:group={groupValue} />
<RadioButton label="Option 2" name="group1" value="$2" bind:group={groupValue} />
<RadioButton label="Option 3" name="group1" value="$3" disabled bind:group={groupValue} />
```

### Disabled

The disabled prop can be used to disable a radio button, preventing user interaction.

```svelte
<RadioButton label="Enabled Option" value="D" />
<RadioButton label="Disabled Option" value="E" disabled />
```

### Checked

The checked prop allows you to control the checked state of the radio button. This is useful for controlled components.

```svelte
<RadioButton label="Checked Option" value="F" checked />
<RadioButton label="Unchecked Option" value="G" />
```

## Component Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:RadioButtonProps -->

| Name                         | Type               | Default | Description                                                                          |
| ---------------------------- | ------------------ | ------- | ------------------------------------------------------------------------------------ |
| `label`                      | `string`           |         | The label displayed next to the radio button.                                        |
| `group` _bindable_           | `unknown`          |         | Bindable value representing a group of radio inputs that the input will be bound to. |
| `checked` _bindable_         | `boolean`          | `false` | Whether the radio button is selected.                                                |
| `ref` _bindable_             | `HTMLInputElement` |         | The DOM reference of the radio button element.                                       |
| `labelAttributes`            | `PolymorphicProps` |         | The attributes to spread on the label wrapping the radio button.                     |
| Element Attributes (`input`) |                    |         |                                                                                      |

<!-- /props:RadioButtonProps -->
