<script lang="ts">
	import { Avatar, Label, PillButton } from '#lib/index.js';
	import InfoRegular from 'fluentui-icons-svelte/InfoRegular.svelte';
	import type { PillButtonMediaProps, PillButtonProps } from '../types.ts';

	let {
		pillProps = {},
		checked = $bindable(undefined),
		fieldsetDisabled = false,
		external = false,
		withLabel = false,
		withIcon = false,
		withAvatar = false,
		ref = $bindable(null),
		wrapperRef = $bindable(null)
	}: {
		pillProps?: PillButtonProps;
		checked?: boolean | null;
		fieldsetDisabled?: boolean;
		external?: boolean;
		withLabel?: boolean;
		withIcon?: boolean;
		withAvatar?: boolean;
		ref?: HTMLInputElement | null;
		wrapperRef?: HTMLElement | null;
	} = $props();
</script>

{#snippet media({ shape }: PillButtonMediaProps)}
	<Avatar data-testid="avatar" name="Alex" {shape} />
{/snippet}

{#snippet pill()}
	<PillButton
		icon={withIcon ? InfoRegular : undefined}
		media={withAvatar ? media : undefined}
		{...pillProps}
		bind:checked
		bind:ref
		bind:wrapperRef
	>
		Unread
	</PillButton>
{/snippet}

<form id="pill-form" onsubmit={(e) => e.preventDefault()}>
	<fieldset disabled={fieldsetDisabled}>
		{#if !external}
			{#if withLabel}
				<Label label="Message filter">{@render pill()}</Label>
			{:else}
				{@render pill()}
			{/if}
		{/if}
	</fieldset>
	<button type="reset">Reset</button>
	<button type="submit">Submit</button>
</form>
{#if external}
	{@render pill()}
{/if}
<output data-testid="checked">{String(checked)}</output>
<button onclick={() => ref?.focus()}>Focus pill</button>
{#if withAvatar}
	<button onclick={() => (pillProps = { ...pillProps, shape: 'square' })}>Use square shape</button>
{/if}
<output data-testid="wrapper-ref">{wrapperRef?.tagName}</output>
