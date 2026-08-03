<script lang="ts">
	import { BadgeIcon } from '$lib/index.js';
	import { pickColorByWord } from '$css/utils.js';
	import { getInitials, pxToRem, RenderSoC } from '$internal';
	import type { AvatarProps } from './type.ts';

	let {
		size = 48,
		name = 'Avatar',
		image,
		initials = name && getInitials(name),
		shape = 'circular',
		icon: Icon,
		active,
		color = 'attention',
		style,
		activeAppearance = 'ring',
		ref = $bindable(),
		idForColor,
		badge,
		...attributes
	}: AvatarProps = $props();

	const avatarStyle = $derived(
		`--av-size: ${pxToRem(size)}; ${color === 'colorful' ? '--av-color: ' + pickColorByWord(idForColor ?? name) + ';' : ''}`
	);

	const badgeSize = $derived((size / 2).toFixed(0) + 'px');

	let hideBg = $state(false);
</script>

<!-- 
@component

  This is a implementation of Fluen UI Avatar component. 

  An Avatar is a graphical representation of a user, team, or entity.

  Avatar can display an image, icon, or initials, and supports various sizes and shapes.

- Usage:
  ```tsx
  <script>
    import { Avatar } from 'fluentui-svelte';
  </script>

  <Avatar name="John Doe" size={48} />
  ```
-->
<div
	role="img"
	aria-label={name}
	bind:this={ref}
	style="{avatarStyle} {style}"
	class={[
		'fs-avatar',
		color,
		activeAppearance,
		active,
		shape,
		hideBg && 'hide-bg',
		(badge?.status || badge?.icon) && 'mask'
	]}
	{...attributes}
>
	<span class="content">
		{#if image}
			<img
				class="fs-avatar-image {shape}"
				src={image.src}
				width={size}
				height={size}
				alt={name}
				onload={() => (hideBg = true)}
			/>
		{/if}
		{#if Icon}
			<RenderSoC SoC={Icon} args={[{ width: badgeSize, height: badgeSize }]} width={badgeSize} height={badgeSize} />
		{:else}
			{initials}
		{/if}
	</span>
	{#if badge}
		<BadgeIcon
			size={Number((size / 3.25).toFixed(0))}
			icon={badge?.icon || undefined}
			status={badge?.status}
			outOfOffice={badge?.outOfOffice}
		/>
	{/if}
</div>

<style>
	.fs-avatar {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		position: relative;
		width: var(--av-size);
		height: var(--av-size);
		font-size: calc(var(--av-size) / 2.4);
		line-height: 1.4em;
		font-weight: 500;
		z-index: 0;
		& :global(.fs-avatar-image) {
			position: absolute;
			inset: 0;
			z-index: 1;
		}
		& > :global(.fs-badge-icon),
		& > :global(.fs-badge),
		& > :global(svg) {
			position: absolute;
			bottom: 0;
			right: 0;
			z-index: 1;
		}
		& .content {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: inherit;
			width: 100%;
			height: 100%;
			z-index: 1;
			color: var(--fs-text-on-accent-primary);
		}
		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			border-radius: inherit;
		}
		&.ring::after,
		&.ring-shadow::after {
			font-size: calc(var(--av-size) / 4);
			content: '';
			position: absolute;
			top: 50%;
			left: 50%;
			width: calc(100% + 1em);
			height: calc(100% + 1em);
			transform: translate(-50%, -50%);
			border: max(1px, 0.3em) solid transparent;
			opacity: 0;
			transition: opacity 0.1s;
			z-index: 0;
		}
		&.circular,
		& :global(.circular),
		&.circular::after {
			border-radius: 9999rem;
		}
		&.rounded {
			border-radius: var(--fs-control-border-radius);
		}
		&.rounded::after {
			border-radius: calc(var(--fs-control-border-radius) + 0.325rem);
		}
		&.shadow,
		&.ring-shadow {
			filter: drop-shadow(var(--fs-shadow-flyout));
		}
		&.information {
			color: var(--fs-system-neutral-text);
			&::before {
				background: var(--fs-system-neutral);
			}
			&:after {
				border-color: var(--fs-system-neutral);
			}
		}
		&.attention {
			color: var(--fs-system-attention-text);
			&::before {
				background: var(--fs-system-attention);
			}
			&:after {
				border-color: var(--fs-system-attention);
			}
		}
		&.warning {
			color: var(--fs-system-caution-text);
			&::before {
				background: var(--fs-system-caution);
			}
			&:after {
				border-color: var(--fs-system-caution);
			}
		}
		&.success {
			color: var(--fs-system-success-text);
			&::before {
				background: var(--fs-system-success);
			}
			&:after {
				border-color: var(--fs-system-success);
			}
		}
		&.critical {
			color: var(--fs-system-critical-text);
			&::before {
				background: var(--fs-system-critical);
			}
			&:after {
				border-color: var(--fs-system-critical);
			}
		}
		&.colorful {
			& .content {
				color: color-mix(in srgb, var(--av-color), contrast-color(var(--av-color)) 60%);
			}
			&::before {
				background: var(--av-color);
			}
			&:after {
				border-color: var(--av-color);
			}
		}
		&.active {
			&.ring::after,
			&.ring-shadow::after {
				opacity: 1;
			}
		}
		&.inactive {
			transform: scale(0.875);
		}
		&.mask {
			/* Crop center */
			--pos: calc(var(--av-size) / 6.1);
			/* Transparent cutout radius */
			--cut: calc(var(--av-size) * 0.228);
			/* Border gradient width (fake anti-aliasing) */
			--feather: max(1%, calc(var(--av-size) * 0.01));
			& .content,
			&::before,
			& :global(.fs-avatar-image) {
				--fs-mask: radial-gradient(
					circle at right var(--pos) bottom var(--pos),
					rgba(0, 0, 0, 0) var(--cut),
					rgb(255, 255, 255) calc(var(--cut) + var(--feather))
				);
				-webkit-mask-image: var(--fs-mask);
				mask-image: var(--fs-mask);
			}
			&::after {
				--after-pos: calc(var(--pos) + (var(--av-size) / 4) / 2);
				--after-cut: calc(var(--av-size) * 0.236);
				--fs-mask: radial-gradient(
					circle at right var(--after-pos) bottom var(--after-pos),
					rgba(0, 0, 0, 0) var(--after-cut),
					rgb(255, 255, 255) calc(var(--after-cut) + var(--feather))
				);
				-webkit-mask-image: var(--fs-mask);
				mask-image: var(--fs-mask);
			}
		}
		&.hide-bg {
			&::before {
				background: transparent;
			}
		}
	}
</style>
