# Rating

A rating lets users give a value to an item by selecting one of a row of stars. It supports half-filled stars, four sizes and a custom number of items.

## Usage

```svelte
<script>
	import { Rating } from 'fluentui-svelte';

	let value = $state(3);
</script>

<Rating bind:value />
```

## Component API

A rating lets users give a value to an item, using a row of symbols such as stars. It supports half-filled items and four sizes.

## Examples

### Bind the value

Use `bind:value` to read the rating the user picks.

```svelte
<script>
	let value = $state(3);
</script>

<Rating bind:value />
```

### Half stars

Set `step={0.5}` to let users pick half-filled stars.

```svelte
<Rating value={2.5} step={0.5} />
```

### Quarter stars

Until the user rates, a fractional `value` is drawn in quarters, which is handy to show an average. Once the user picks a star, the rating snaps to the `step`.

```svelte
<Rating value={3.75} />
```

### Size

Use `size` to choose between `small`, `medium`, `large` and `extra-large`.

```svelte
<Rating value={3} size="small" />
<Rating value={3} size="medium" />
<Rating value={3} size="large" />
<Rating value={3} size="extra-large" />
```

### Shape

Use `iconFilled` and `iconOutline` to replace the stars with any other icon component. Both fall back to the star when omitted, and partially filled items are clipped, so custom shapes also work with `step={0.5}`.

```svelte
<script>
	import { HeartFilled, HeartRegular } from 'fluentui-icons-svelte';
</script>

<Rating value={3} iconFilled={HeartFilled} iconOutline={HeartRegular} />
```

### Max

Use `max` to change the number of stars.

```svelte
<Rating value={4} max={10} />
```

### Item label

Use `itemLabel` to customize the accessible label of each radio input.

```svelte
<Rating value={3} itemLabel={(rating) => `${rating} out of 5 stars`} />
```

## Component Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:RatingProps -->

| Name                                                | Type                                                                | Default                       | Description                                                                                                                   |
| --------------------------------------------------- | ------------------------------------------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `value` _bindable_                                  | `number`                                                            | `0`                           | The current rating. Fractions are drawn in quarters until the user rates.                                                     |
| `max`                                               | `number`                                                            | `5`                           | The number of items displayed. Must be a whole number greater than 1.                                                         |
| `step`                                              | `1` &#124; `0.5`                                                    | `1`                           | The precision of the rating. `0.5` allows half-filled items.                                                                  |
| `size`                                              | `'small'` &#124; `'medium'` &#124; `'large'` &#124; `'extra-large'` | `'extra-large'`               | The size of the rating items.                                                                                                 |
| `iconFilled`                                        | `Component`                                                         |                               | The icon of a filled item. Falls back to a filled star. Partially filled items are clipped, so it also works with half steps. |
| `iconOutline`                                       | `Component`                                                         |                               | The icon of an empty item. Falls back to an outlined star.                                                                    |
| `name`                                              | `string`                                                            |                               | The name of the radio inputs. Generated when not provided.                                                                    |
| `itemLabel`                                         | `(rating: number) => string`                                        | `` (rating) => `${rating}` `` | Generates the accessible label of the radio input for a rating value.                                                         |
| `onChange`                                          | `(value: number) => void`                                           |                               | Called when the user changes the rating.                                                                                      |
| `class`                                             | `string`                                                            |                               | The class to apply to the rating.                                                                                             |
| `ref` _bindable_                                    | `HTMLElement`                                                       |                               | The DOM reference of the rating element.                                                                                      |
| `HTMLAttributes<HTMLDivElement>` without `onchange` |                                                                     |                               |                                                                                                                               |

<!-- /props:RatingProps -->
