# Card

A card is a container that groups content and actions about a single topic, and can optionally be selected.

## Usage

```svelte
<script>
	import { Card, CardPreview, CardHeader, CardFooter, Button } from 'fluentui-svelte';
</script>

{#snippet footerActions()}
	<Button>Like</Button>
	<Button appearance="standard">Share</Button>
{/snippet}

<Card orientation="vertical">
	<CardPreview logoSrc="/logo.png">
		<img src="/preview.png" alt="Preview" />
	</CardPreview>
	<CardHeader title="FluentUI Svelte" description="5h ago · About us - Overview" />
	<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
	<CardFooter action={footerActions} />
</Card>
```

## Component API

A card is built out of the following components:

- `Card`: the root component. It creates all the state, provides context to its parts and handles the selection.
- `CardPreview`: the media shown at one edge of the card, with an optional logo overlaid on it.
- `CardHeader`: the title of the card, with an optional image, description and action.
- `CardFooter`: the actions shown at the bottom of the card.

`CardPreview`, `CardHeader` and `CardFooter` read the card context, so they throw when rendered outside a `Card`.
They are all optional, and the card renders any other content passed to it as is.

The following combinations are rejected at runtime, because they cannot be resolved visually:

- `showFloatingAction` without `selectable`.
- `selected` without `selectable`.
- `as="a"` together with `selectable`.
- `action` on `CardHeader` or `CardFooter` inside a selectable card.

## Examples

### Appearance

A card can have its background and borders styled for greater emphasis or to be subtle.

```svelte
<Card appearance="filled">Filled</Card>
<Card appearance="outlined">Outlined</Card>
<Card appearance="subtle">Subtle</Card>
```

### Orientation

A card lays its parts out horizontally by default. Set `orientation` to `vertical` to stack them instead.

```svelte
<Card orientation="horizontal">
	<CardPreview logoSrc="/logo.png">
		<img src="/preview.png" alt="Preview" />
	</CardPreview>
	<CardHeader title="Horizontal" description="The default orientation" />
</Card>

<Card orientation="vertical">
	<CardPreview logoSrc="/logo.png">
		<img src="/preview.png" alt="Preview" />
	</CardPreview>
	<CardHeader title="Vertical" description="Stacks every part" />
</Card>
```

### Selection

A selectable card toggles its selection when clicked anywhere, and reports it through `onSelectionChange`. Set
`showFloatingAction` to float a checkbox over the top right corner.

```svelte
<script>
	let selected = $state(false);
</script>

<Card selectable showFloatingAction bind:selected onSelectionChange={(id, selected) => console.log(id, selected)}>
	<CardHeader title="Selectable card" description={selected ? 'Selected' : 'Not selected'} />
</Card>
```

### Header

The header takes a `title`, and optionally an `image`, a `description` and an `action`. A string title renders inside
a heading; a snippet or a component receives the id the floating checkbox is labelled by.

```svelte
<script>
	import { Card, CardHeader, Button } from 'fluentui-svelte';
	import { MoreHorizontalRegular } from 'fluentui-icons-svelte';
</script>

{#snippet title(attrs)}
	<h4 class="body" {...attrs}><b>FluentUI Svelte</b> mentioned you</h4>
{/snippet}

{#snippet action()}
	<Button appearance="subtle" aria-label="More actions"><MoreHorizontalRegular width="1em" height="1em" /></Button>
{/snippet}

<Card>
	<CardHeader image="/logo.png" {title} description="5h ago · About us - Overview" {action} />
</Card>
```

### Preview

The preview holds the media of the card and rounds the corners it sits against. The `logoSrc` prop overlays a logo on
the bottom left corner.

```svelte
<Card orientation="vertical">
	<CardPreview logoSrc="/logo.png">
		<img src="/preview.png" alt="Preview" />
	</CardPreview>
</Card>
```

### Footer

The footer renders the actions of the card at the bottom, spread across the available width.

```svelte
<script>
	import { Card, CardHeader, CardFooter, Button } from 'fluentui-svelte';
</script>

{#snippet action()}
	<Button>Like</Button>
	<Button appearance="standard">Share</Button>
{/snippet}

<Card orientation="vertical">
	<CardHeader title="FluentUI Svelte" description="5h ago · About us - Overview" />
	<CardFooter {action} />
</Card>
```

## Component Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:CardProps -->

| Name                  | Type                                                       | Default        | Description                                                                             |
| --------------------- | ---------------------------------------------------------- | -------------- | --------------------------------------------------------------------------------------- |
| `ref` _bindable_      | `CardElementDOMType[Tag]`                                  |                | The DOM reference of the card element.                                                  |
| `as`                  | `'div'` &#124; `'article'` &#124; `'section'` &#124; `'a'` | `'div'`        | The DOM element to render.                                                              |
| `orientation`         | `'horizontal'` &#124; `'vertical'`                         | `'horizontal'` | The axis the card lays its parts out on.                                                |
| `selectable`          | `boolean`                                                  | `false`        | Lets the user select the card by clicking anywhere on it.                               |
| `showFloatingAction`  | `boolean`                                                  | `false`        | Floats the selection checkbox over the top right corner of the card.                    |
| `id`                  | `string`                                                   |                | The id of the card element. Falls back to a generated one.                              |
| `selected` _bindable_ | `boolean`                                                  | `false`        | Whether the card is selected. Only available on selectable cards.                       |
| `disabled`            | `boolean`                                                  | `false`        | Disables the user interaction.                                                          |
| `appearance`          | `'filled'` &#124; `'outlined'` &#124; `'subtle'`           | `'filled'`     | A card can have its background and borders styled for greater emphasis or to be subtle. |
| `onSelectionChange`   | `(id: string, selected: boolean) => void`                  |                | Called with the id of the card whenever its selection changes.                          |
| HTML Attributes       |                                                            |                |                                                                                         |

<!-- /props:CardProps -->

## CardPreview

The media shown at one edge of the card, with an optional logo overlaid on it.

### Component Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:CardPreviewProps -->

| Name                                                | Type             | Default | Description                                                                             |
| --------------------------------------------------- | ---------------- | ------- | --------------------------------------------------------------------------------------- |
| `ref` _bindable_                                    | `HTMLDivElement` |         | The DOM reference of the preview element.                                               |
| `logoSrc`                                           | `string`         |         | The URL of the logo overlaid on the bottom left corner of the preview.                  |
| `logoAlt`                                           | `string`         | `''`    | The alternative text of the logo. Empty by default, which marks the logo as decorative. |
| `children`                                          | `Snippet`        |         | The media to preview, usually an image.                                                 |
| `HTMLAttributes<HTMLDivElement>` without `children` |                  |         |                                                                                         |

<!-- /props:CardPreviewProps -->

## CardHeader

The title of the card, with an optional image, description and action.

### Component Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:CardHeaderProps -->

| Name                                                         | Type                                         | Default | Description                                                                                           |
| ------------------------------------------------------------ | -------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------- |
| `ref` _bindable_                                             | `HTMLDivElement`                             |         | The DOM reference of the header element.                                                              |
| `title`                                                      | `Snippet` &#124; `Component` &#124; `string` |         | The title of the card. A snippet or a component receives the id the floating checkbox is labelled by. |
| `image`                                                      | `Snippet` &#124; `Component` &#124; `string` |         | The image rendered before the title. A string is used as the `src` of an `<img>`.                     |
| `imageAlt`                                                   | `string`                                     | `''`    | The alternative text of a string image. Empty by default, which marks the image as decorative.        |
| `description`                                                | `Snippet` &#124; `Component` &#124; `string` |         | A second line of text below the title.                                                                |
| `action`                                                     | `Snippet` &#124; `Component`                 |         | The action rendered at the end of the header. Not available on selectable cards.                      |
| `HTMLAttributes<HTMLDivElement>` without `children`, `title` |                                              |         |                                                                                                       |

<!-- /props:CardHeaderProps -->

## CardFooter

The actions shown at the bottom of the card.

### Component Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:CardFooterProps -->

| Name                                                | Type                         | Default | Description                                                                |
| --------------------------------------------------- | ---------------------------- | ------- | -------------------------------------------------------------------------- |
| `ref` _bindable_                                    | `HTMLDivElement`             |         | The DOM reference of the footer element.                                   |
| `action`                                            | `Snippet` &#124; `Component` |         | The actions rendered inside the footer. Not available on selectable cards. |
| `HTMLAttributes<HTMLDivElement>` without `children` |                              |         |                                                                            |

<!-- /props:CardFooterProps -->
