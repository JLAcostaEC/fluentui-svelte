<script lang="ts">
	import type { LabelProps } from './types.ts';

	let {
		ref = $bindable(),
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

<label
	class={[
		'fs-label',
		`size-${size}`,
		`weight-${weight}`,
		classes,
		{ disabled, required },
		(labelPosition === 'above' || labelPosition === 'below') && 'column'
	]}
	bind:this={ref}
	{...attributes}
>
	{#if labelPosition === 'before' || labelPosition === 'above'}
		<span>
			{label}
			{#if required}
				<abbr title={required.message || label}>{required.abbr ?? '*'}</abbr>
			{/if}
		</span>
	{/if}

	{@render children?.()}

	{#if labelPosition === 'after' || labelPosition === 'below'}
		<span>
			{label}
			{#if required}
				<abbr title={required.message || label}>{required.abbr ?? '*'}</abbr>
			{/if}
		</span>
	{/if}
</label>

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
			font-size: var(--fs-caption-font-size);
			letter-spacing: 0.04em;
			gap: 0.25rem;
		}
		&.size-medium {
			font-size: var(--fs-body-font-size);
			gap: 0.375rem;
		}
		&.size-large {
			font-size: var(--fs-subtitle2-font-size);
			gap: 0.5rem;
		}
		&.weight-regular {
			font-weight: 400;
		}
		&.weight-semibold {
			font-weight: 600;
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
	}
</style>
