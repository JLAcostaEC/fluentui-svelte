<script lang="ts">
	import { Drawer, DrawerHeader, DrawerBody, DrawerFooter } from '#lib/index.js';
	import type { DrawerProps } from '#lib/components/drawer/types.js';

	let {
		open = $bindable(false),
		size = $bindable('small'),
		withNested = false,
		nestedType = 'modal',
		...props
	}: Partial<DrawerProps> & { withNested?: boolean; nestedType?: DrawerProps['type'] } = $props();
	let changes: boolean[] = $state([]);
	let outsideClicks = $state(0);
	let nestedOpen = $state(false);
</script>

<button data-testid="opener" onclick={() => (open = true)}>Open</button>
<button data-testid="outside" onclick={() => outsideClicks++}>Outside {outsideClicks}</button>
<output data-testid="changes">{changes.join(',')}</output>
<output data-testid="size">{size}</output>

<Drawer bind:open bind:size onOpenChange={(value) => changes.push(value)} data-testid="drawer" {...props}>
	<DrawerHeader title="Settings" />
	<DrawerBody>
		<p>Drawer content</p>
		{#if withNested}
			<button data-testid="open-nested" onclick={() => (nestedOpen = true)}>Details</button>
			<Drawer bind:open={nestedOpen} type={nestedType} data-testid="nested">
				<DrawerHeader title="Details" closeLabel="Close details" />
			</Drawer>
		{/if}
	</DrawerBody>
	<DrawerFooter><button data-testid="save" onclick={() => (open = false)}>Save</button></DrawerFooter>
</Drawer>
