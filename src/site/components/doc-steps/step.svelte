<script lang="ts">
	import type { Snippet } from 'svelte';

	let { title, children }: { title: string; children: Snippet } = $props();
</script>

<!--
	@component
	One step of a `Steps` list: the number comes from the order, the title names it, and the content explains it.
-->
<li class="doc-step">
	<p class="doc-step-title">{title}</p>
	<div class="doc-step-content">
		{@render children()}
	</div>
</li>

<style>
	.doc-step {
		position: relative;
		min-width: 0;
		padding-inline-start: 3rem;
		padding-block-end: 1.5rem;
		counter-increment: doc-step;
		list-style: none;
		&::before {
			content: counter(doc-step);
			position: absolute;
			inset-inline-start: 0;
			inset-block-start: 0;
			display: grid;
			place-items: center;
			inline-size: 2rem;
			block-size: 2rem;
			border-radius: 50%;
			background: var(--fs-accent-fill-default);
			color: var(--fs-text-on-accent-primary);
			font-weight: 600;
		}
		&:not(:last-child)::after {
			content: '';
			position: absolute;
			inset-inline-start: calc(1rem - 1px);
			inset-block: 2.5rem 0.5rem;
			inline-size: 2px;
			background: var(--fs-control-surface-stroke-default);
		}
		&:last-child {
			padding-block-end: 0;
		}
	}
	.doc-step-title {
		margin: 0;
		min-block-size: 2rem;
		display: flex;
		align-items: center;
		font-size: var(--fs-body-font-size);
		font-weight: 600;
	}
	.doc-step-content {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.75rem;
		margin-block-start: 0.5rem;
		& > :global(*) {
			max-width: 100%;
		}
		& :global(p) {
			margin: 0;
		}
		& :global(pre) {
			align-self: stretch;
			margin: 0;
		}
	}
</style>
