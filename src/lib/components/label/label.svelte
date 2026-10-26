<script lang="ts">
	import InfoRegular from 'fluentui-icons-svelte/InfoRegular.svelte';
	import type { Attachment } from 'svelte/attachments';
	import type { LabelProps } from './types.ts';
	import { PREFIX } from '$constants';
	import { RenderSoC } from '$internal';
	import { Tooltip } from '$lib/index.js';
	import { setLabelContext } from './label-context.ts';

	const FALLBACK_ID = $props.id();

	let {
		id = `${PREFIX}-label-${FALLBACK_ID}`,
		for: htmlFor,
		ref = $bindable(),
		as = 'div',
		wrapperRef = $bindable(),
		wrapperAttributes,
		class: classes,
		disabled,
		required,
		size = 'medium',
		weight = 'regular',
		label = 'Label Element',
		labelPosition = 'above',
		tooltipContent,
		tooltipBadge = InfoRegular,
		tooltipProps,
		tooltipButtonAttributes,
		children,
		...attributes
	}: LabelProps = $props();

	/** The field inside the label, used to get its id */
	let field = $state<() => string | null | undefined>();

	const fieldId = $derived(htmlFor ?? `${id}-field`);

	const INFO_ID = $derived(tooltipButtonAttributes?.id ?? `${id}-info`);

	setLabelContext({
		get labelId() {
			return id;
		},
		get fieldId() {
			return fieldId;
		},
		claim(report) {
			if (field) return false;
			field = report;
			return true;
		}
	});
</script>

<svelte:element
	this={as}
	{...wrapperAttributes}
	class={[
		'fs-label',
		`size-${size}`,
		{ disabled, required },
		(labelPosition === 'above' || labelPosition === 'below') && 'column',
		wrapperAttributes?.class
	]}
	bind:this={wrapperRef}
>
	{#if labelPosition === 'before' || labelPosition === 'above'}
		{@render labelText()}
	{/if}

	{@render children?.()}

	{#if labelPosition === 'after' || labelPosition === 'below'}
		{@render labelText()}
	{/if}
</svelte:element>

{#snippet labelText()}
	{#if tooltipContent}
		<!-- The badge sits beside the label text, not in it, or its name would join the name of the field. -->
		<span class={['fs-label-heading', `size-${size}`]}>
			{@render text()}
			<Tooltip
				withArrow
				placement="top"
				{...tooltipProps}
				content={tooltipContent}
				relationship="description"
				children={badge}
			/>
		</span>
	{:else}
		{@render text()}
	{/if}
{/snippet}

{#snippet badge(attrs: { 'aria-describedby'?: string }, attach: Attachment)}
	<button
		type="button"
		aria-label="More information"
		{...tooltipButtonAttributes}
		{...attrs}
		id={INFO_ID}
		aria-labelledby={tooltipButtonAttributes?.['aria-labelledby'] ?? `${id} ${INFO_ID}`}
		class={['fs-label-info', tooltipButtonAttributes?.class]}
		{@attach attach}
	>
		<RenderSoC SoC={tooltipBadge} />
	</button>
{/snippet}

{#snippet text()}
	<label
		{...attributes}
		{id}
		for={field ? field() : fieldId}
		class={['fs-label-text', `size-${size}`, `weight-${weight}`, classes]}
		bind:this={ref}
	>
		{label}
		{#if required}
			<abbr aria-hidden="true" title={required.message || label}>{required.abbr ?? '*'}</abbr>
		{/if}
	</label>
{/snippet}

<style>
	.fs-label {
		display: inline-flex;
		align-items: center;
		user-select: none;
		&.column {
			flex-direction: column;
			align-items: flex-start;
		}
		&.size-small {
			gap: 0.25rem;
		}
		&.size-medium {
			gap: 0.375rem;
		}
		&.size-large {
			gap: 0.5rem;
		}
		&.disabled {
			color: var(--fs-text-disabled);
			pointer-events: none;
		}
		&.required {
			& abbr {
				text-decoration: none;
				color: var(--fs-system-critical);
				font-size: inherit;
				line-height: 0;
			}
			&.disabled abbr {
				color: var(--fs-text-disabled);
			}
		}
		& .fs-label-heading {
			display: inline-flex;
			align-items: center;
			gap: 0.25rem;
			&.size-small .fs-label-info {
				font-size: 0.75rem;
			}
			&.size-large .fs-label-info {
				font-size: 1.25rem;
			}
		}
		& .fs-label-info {
			display: inline-flex;
			align-items: center;
			padding: 0;
			border: none;
			border-radius: var(--fs-control-border-radius);
			background: none;
			color: var(--fs-text-secondary);
			font-size: 1rem;
			cursor: pointer;
			&:hover {
				color: var(--fs-text-primary);
			}
			&:focus-visible {
				outline: 0.125rem var(--fs-focus-stroke-outer) solid;
				outline-offset: 0.063rem;
			}
			& :global(svg) {
				inline-size: 1em;
				block-size: 1em;
			}
		}
		& .fs-label-text {
			&.size-small {
				font-size: var(--fs-caption-font-size);
				letter-spacing: 0.04em;
			}
			&.size-medium {
				font-size: var(--fs-body-font-size);
			}
			&.size-large {
				font-size: var(--fs-subtitle2-font-size);
			}
			&.weight-regular {
				font-weight: 400;
			}
			&.weight-semibold {
				font-weight: 600;
			}
		}
		&:global(:has(*:user-invalid)) {
			& .fs-label-text {
				color: var(--fs-system-critical);
			}
		}
	}
</style>
