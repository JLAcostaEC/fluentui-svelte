<script lang="ts">
	import { pxToRem, capitalize, RenderSoC } from '$internal';
	import { colors, getIconBadge } from './utils.svelte.ts';
	import type { BadgeIconProps } from './types.ts';

	let {
		size = 20,
		status = 'available',
		outOfOffice = false,
		icon: Icon,
		class: classes,
		color,
		style,
		ref = $bindable(),
		...attributes
	}: BadgeIconProps = $props();

	const arialabel = $derived(capitalize(status));
</script>

<!-- 
  @component
  Fluent UI Badge: You can use this component to paint icons that act as Badges. It does not support children. You can use any icon library you prefer.
  
  Note that a scaling property is applied since FluentUI icons have around 20% padding. If you are using another library that doesn't add padding to its icons, you can reverse this by applying:

  ```css
  :global(.fs-badge-icon){
    transform: scale(1);
  }
  ```
  
  - Usage:
  ```tsx
  <script>
    import { BadgeIcon } from 'fluentui-svelte';
    import { HomeIcon } from 'some-icon-library';
  </script>

  <BadgeIcon size={24} shape="rounded" appearance="outline" color="success" icon={HomeIcon} />
  ```
 -->
<span
	bind:this={ref}
	aria-label={arialabel}
	role="img"
	class="fs-badge-icon {color || colors[status]} {classes}"
	style="--badge-size: {pxToRem(size)}; {style}"
	{...attributes}
>
	{#if Icon}
		<RenderSoC
			SoC={Icon}
			args={[{ 'aria-hidden': true, width: size, height: size }]}
			aria-hidden="true"
			width="{size}px"
			height="{size}px"
		/>
	{:else}
		<RenderSoC SoC={getIconBadge(outOfOffice, status)} aria-hidden="true" width="{size}px" height="{size}px" />
	{/if}
</span>

<style>
	.fs-badge-icon {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		padding: 0rem;
		user-select: none;
		border-radius: var(--badge-shapes);
		color: var(--fs-text-on-accent-primary);
		line-height: var(--fs-caption-line-height);
		font-size: calc(var(--badge-size) / 2);
		font-weight: 600;
		width: var(--badge-size);
		min-width: max-content;
		height: var(--badge-size);
		& :global(svg) {
			max-width: calc(var(--badge-size));
			/* FluentUI icons have about 20% padding, but to keep the positioning consistent, we use a scale transform.  */
			transform: scale(1.25);
			& :global(path) {
				fill: currentColor;
			}
		}
		&.information {
			color: var(--fs-system-neutral-text);
		}
		&.attention {
			color: var(--fs-accent-fill-default);
		}
		&.warning {
			color: var(--fs-system-caution);
		}
		&.success {
			color: var(--fs-system-success);
		}
		&.critical {
			color: var(--fs-system-critical);
		}
	}
</style>
