<script lang="ts">
	import { page } from '$app/state';
	import { Badge } from '$lib/index.js';
	import { statusBadge } from '$site/utils/status.js';

	// The status lives in the component's docs META, so the page never has to repeat it.
	const status = $derived(page.data?.meta?.status as string | undefined);
	const badge = $derived(status ? statusBadge(status) : null);
</script>

{#if badge}
	<Badge appearance={badge.appearance} color={badge.color}>{status}</Badge>
{/if}
