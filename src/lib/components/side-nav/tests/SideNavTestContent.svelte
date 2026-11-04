<script lang="ts">
	import type { SideNavRenderState } from '../types.ts';
	let { collapsed, floating }: SideNavRenderState = $props();
</script>

<span>Component content: {collapsed ? 'closed' : 'open'}, {floating ? 'floating' : 'docked'}</span>
