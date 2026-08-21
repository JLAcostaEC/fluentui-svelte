<script lang="ts">
	import { Button, BadgeIcon } from '$lib/index.js';
	import DismissFilled from 'fluentui-icons-svelte/DismissFilled.svelte';
	import DismissCircleFilled from 'fluentui-icons-svelte/DismissCircleFilled.svelte';
	import InfoFilled from 'fluentui-icons-svelte/InfoFilled.svelte';
	import ErrorCircleFilled from 'fluentui-icons-svelte/ErrorCircleFilled.svelte';
	import WarningFilled from 'fluentui-icons-svelte/WarningFilled.svelte';
	import CheckmarkFilled from 'fluentui-icons-svelte/CheckmarkFilled.svelte';
	import { RenderSoC } from '$internal';
	import type { InfoBarProps } from './types.ts';

	let {
		status = 'information',
		title,
		icon: Icon,
		style = 'inline',
		hideCloseButton,
		iconSize = 20,
		children
	}: InfoBarProps = $props();

	const icons = {
		information: InfoFilled,
		attention: ErrorCircleFilled,
		warning: WarningFilled,
		critical: DismissCircleFilled,
		success: CheckmarkFilled
	};

	let closed = $state(false);
</script>

<!-- @component
  The InfoBar component is used to display a message to the user. It can have different styles and colors based on the status prop.
  It can also have an icon, a title, a message, and a button with a callback.
  - Usage:
  ```tsx
  <script>
    import { InfoBar } from 'fluentui-svelte';
    import { HomeIcon } from 'some-icon-library';
  </script>

  <InfoBar status="success" title="Success" message="The operation was successful." buttonCallback={(e) => console.log('Button clicked')}>
    This is a custom content.
  </InfoBar>
  ```
-->
{#if !closed}
	<div class={['fs-info-bar', status, style]} role={status === 'critical' ? 'alert' : 'status'}>
		<div class="icon-wrapper">
			{#if Icon}
				<RenderSoC SoC={Icon} />
			{:else}
				<BadgeIcon color={status} icon={icons[status] as any} size={iconSize} />
			{/if}
		</div>
		<div class="content">
			{#if title}<h3>{title}</h3>{/if}
			{@render children?.()}
		</div>
		{#if !hideCloseButton}
			<div class="close">
				<Button
					appearance="subtle"
					style="min-width: max-content"
					onclick={() => (closed = true)}
					aria-label="Close InfoBar"
				>
					<DismissFilled class="button-icon" />
				</Button>
			</div>
		{/if}
	</div>
{/if}

<style>
	.fs-info-bar {
		position: relative;
		display: flex;
		gap: 0.813rem;
		padding: 0.5rem 0.5rem 0.5rem 0.635rem;
		background-color: var(--fs-card-background-secondary);
		border: 1px solid var(--fs-card-stroke-default);
		border-radius: var(--fs-control-border-radius);
		color: var(--fs-text-primary);
		&.multiline {
			padding-bottom: 1rem;
			& .icon-wrapper {
				align-items: flex-start;
			}
			& .content {
				flex-direction: column;
				align-items: flex-start;
			}
			& .close {
				align-items: flex-start;
			}
			&:not(:has(.close)) .content {
				padding-right: 0.5rem;
			}
		}
		&.warning {
			background-color: var(--fs-system-caution-bg);
		}
		&.critical {
			background-color: var(--fs-system-critical-bg);
		}
		&.success {
			background-color: var(--fs-system-success-bg);
		}
		& .icon-wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 2rem;
		}
		& .content {
			display: flex;
			flex: 1 1 auto;
			align-items: center;
			gap: 0.5rem;
			width: 100%;
			& h3 {
				font-weight: semibold;
				font-size: var(--fs-body-font-size);
				line-height: var(--fs-body-line-height);
			}
		}
		& .close {
			display: flex;
			align-items: center;
			justify-content: center;
		}
		& :global(.button-icon) {
			width: 1.2rem;
			height: 1.2rem;
			color: var(--fs-text-primary);
		}
	}
</style>
