<script lang="ts">
	import { Card, CardPreview, CardHeader, CardFooter } from '$lib/index.js';
	import type { CardHeaderProps, CardPreviewProps, CardProps } from '$lib/components/card/types.js';

	const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

	let {
		part = 'content',
		title = 'Card title',
		image,
		imageAlt,
		description,
		logoSrc = PIXEL,
		logoAlt,
		snippetTitle = false,
		withAction = false,
		...props
	}: Partial<CardProps<'div'>> &
		Partial<Pick<CardHeaderProps, 'title' | 'image' | 'imageAlt' | 'description'>> &
		Partial<Pick<CardPreviewProps, 'logoAlt'>> & {
			part?: 'content' | 'header' | 'preview' | 'footer' | 'full';
			logoSrc?: string;
			/** Renders the title of the header as a snippet instead of a string. */
			snippetTitle?: boolean;
			/** Renders an action inside the part under test. */
			withAction?: boolean;
		} = $props();
</script>

{#snippet titleSnippet(attrs: { id: string })}
	<h4 data-testid="snippet-title" {...attrs}>Snippet title</h4>
{/snippet}

{#snippet actionSnippet()}
	<button data-testid="snippet-action">Action</button>
{/snippet}

<Card {...props}>
	{#if part === 'preview' || part === 'full'}
		<CardPreview {logoSrc} {logoAlt} data-testid="card-preview">
			<img src={PIXEL} alt="Preview" />
		</CardPreview>
	{/if}
	{#if part === 'header' || part === 'full'}
		<CardHeader
			title={snippetTitle ? titleSnippet : title}
			{image}
			{imageAlt}
			{description}
			action={withAction && part === 'header' ? actionSnippet : undefined}
			data-testid="card-header"
		/>
	{/if}
	{#if part === 'content'}
		<p data-testid="card-content">Card content</p>
	{/if}
	{#if part === 'footer' || part === 'full'}
		<CardFooter action={withAction ? actionSnippet : undefined} data-testid="card-footer" />
	{/if}
</Card>
