# InfoBar

The InfoBar control is for displaying app-wide status messages to users that are highly visible yet non-intrusive. There are built-in severity levels to easily indicate the type of message shown, as well as the option to include your own call to action or hyperlink button. Since the InfoBar is inline with other UI content, it can remain visible or be dismissed by the user.

## Usage

```svelte
<script lang="ts">
	import { InfoBar } from 'fluentui-svelte';
</script>

<InfoBar status="information" title="Information">
	<p>This is an informational message.</p>
</InfoBar>
```

## Component API

A brief explanation of the props that really need explaining. You can see the rest of the props in the Component Props table below.

## Examples

### Status

The status prop determines the visual style and meaning of the InfoBar.

```svelte
<InfoBar status="information" title="Information">
	<p>This is an informational message.</p>
</InfoBar>
<InfoBar status="attention" title="Attention">
	<p>This is an attention message.</p>
</InfoBar>
<InfoBar status="warning" title="Warning">
	<p>This is a warning message.</p>
</InfoBar>
<InfoBar status="critical" title="Critical">
	<p>This is a critical message.</p>
</InfoBar>
<InfoBar status="success" title="Success">
	<p>This is a success message.</p>
</InfoBar>
```

### Style

The style prop determines the layout of the InfoBar.

```svelte
<InfoBar status="information" style="inline" title="Inline Style">
	<p>This is an inline styled InfoBar.</p>
</InfoBar>
<InfoBar status="information" style="multiline" title="Multiline Style">
	<p>This is a multiline styled InfoBar.</p>
</InfoBar>
```

### Hide Close Button

The hideCloseButton prop allows you to hide the close button in the InfoBar.

```svelte
<InfoBar status="information" title="Without Close Button" hideCloseButton>
	<p>This InfoBar does not have a close button.</p>
</InfoBar>
<InfoBar status="information" title="With Close Button">
	<p>This InfoBar has a close button.</p>
</InfoBar>
```

## Component Props

| Name | Type | Description |
| --- | --- | --- |
| `status` | `string` | The status of the InfoBar. Possible values: 'information', 'attention', 'warning', 'critical', 'success'. |
| `style` | `string` | The style of the InfoBar. Possible values: 'inline', 'multiline'. |
| `title` | `string` | The title of the InfoBar. |
| `icon` | `Snippet \| Component` | The icon to display in the InfoBar. |
| `iconSize` | `number` | The size of the icon in pixels. Default: 20. |
| `hideCloseButton` | `boolean` | Whether to hide the close button. Default: false. |
| `children` | `Snippet` | The child elements to render inside the InfoBar. |
