<script lang="ts">
	import type { LabelProps } from './types.ts';
	import { PREFIX } from '$constants';

	const FALLBACK_ID = $props.id();

	let {
		id = `${PREFIX}-label-${FALLBACK_ID}`,
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
		labelPosition = 'after',
		children,
		...attributes
	}: LabelProps = $props();
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
	<label {...attributes} {id} class={['fs-label-text', `size-${size}`, `weight-${weight}`, classes]} bind:this={ref}>
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
	}
</style>
