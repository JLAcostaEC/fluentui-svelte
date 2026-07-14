<script lang="ts">
	import { Avatar, BadgeIcon } from '$lib/index.js';
	import type { PersonaProps } from './types.ts';

	let {
		name,
		size = 42,
		primaryText,
		tertiaryText,
		secondaryText,
		textAlign = 'left',
		textPosition: dir = 'right',
		avatarAlign = 'center',
		element = $bindable(),
		avatar,
		presence,
		presenceOnly,
		...attributes
	}: PersonaProps = $props();

	const position = {
		top: 'column-reverse',
		bottom: 'column',
		left: 'row-reverse',
		right: 'row'
	};
</script>

<div
	bind:this={element}
	class="persona"
	style="--p-size: {size}px; --avatar-align: {avatarAlign}; flex-direction: {position[dir]}; text-align: {textAlign};"
	{...attributes}
>
	{#if presenceOnly && presence?.status}
		<BadgeIcon {size} icon={presence?.icon || undefined} status={presence.status} outOfOffice={presence?.outOfOffice} />
	{:else}
		<Avatar {name} {size} {...avatar} badge={presence} />
	{/if}
	<div class="persona-data">
		<p class="persona-name">{name}</p>
		{#if primaryText}
			<p>{primaryText}</p>
		{/if}
		{#if secondaryText}
			<p>{secondaryText}</p>
		{/if}
		{#if tertiaryText}
			<p>{tertiaryText}</p>
		{/if}
	</div>
</div>

<style>
	.persona {
		display: flex;
		align-items: var(--avatar-align);
		gap: 0.8rem;
		min-width: max-content;
		& .persona-data {
			display: flex;
			flex-direction: column;
			gap: 0.2rem;
			text-align: var(--p-align);
			line-height: 1em;
			& .persona-name {
				font-size: calc(var(--p-size) / 3.2);
				font-weight: 500;
				color: var(--fs-text-primary);
				line-height: 1em;
			}
			& p {
				font-size: calc(var(--p-size) / 4.2);
				color: var(--fs-text-secondary);
				line-height: 1em;
			}
		}
	}
</style>
