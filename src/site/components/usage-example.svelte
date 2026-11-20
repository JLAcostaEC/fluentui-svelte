<script lang="ts">
	import { Dialog, DialogContent, DialogSurface, DialogTitle, DialogTrigger, TextBox } from '#lib/index.js';
	import { m } from '#i18n/messages.js';

	let { stacked = false }: { stacked?: boolean } = $props();
	let name = $state<string | number | null>('');
</script>

<div class={['usage-example', { stacked }]}>
	<TextBox bind:value={name} placeholder={m.site_demo_name()} aria-label={m.site_demo_name()} justify />
	<Dialog>
		<DialogTrigger>{m.site_demo_say_hello()}</DialogTrigger>
		<DialogSurface>
			<DialogTitle>{m.site_demo_greeting()}</DialogTitle>
			<DialogContent>{m.site_demo_hello({ name: String(name || m.site_demo_stranger()) })}</DialogContent>
		</DialogSurface>
	</Dialog>
</div>

<style>
	.usage-example {
		display: flex;
		flex-wrap: wrap;
		max-width: 100%;
		align-items: center;
		gap: 0.75rem;

		&.stacked {
			display: grid;
			justify-items: start;
			width: min(100%, 22rem);
			& :global(.fs-text-box-wrapper) {
				width: 100%;
			}
		}

		& :global(.fs-text-box-wrapper) {
			flex: 1 1 12rem;
		}
	}
</style>
