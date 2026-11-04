<script lang="ts">
	import { onMount } from 'svelte';
	import { getAppWindowContext, type AppWindowContext } from '#lib/index.js';
	let { name = 'Window state', onContext }: { name?: string; onContext?: (context: AppWindowContext | null) => void } =
		$props();
	const context = getAppWindowContext();
	onMount(() => onContext?.(context));
	const state = $derived(
		context
			? {
					active: context.state.active,
					maximized: context.state.maximized,
					minimized: context.state.minimized,
					width: context.config.width,
					height: context.config.height,
					collapsed: context.state.sideNav?.collapsed ?? null,
					floating: context.state.sideNav?.floating ?? null,
					sideNav: !!context.state.sideNav?.ref,
					titleBar: !!context.state.titleBar?.ref,
					appSurface: !!context.state.appSurface?.ref
				}
			: null
	);
</script>

<output aria-label={name}>{JSON.stringify(state)}</output>
