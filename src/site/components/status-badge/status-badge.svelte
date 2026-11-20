<script lang="ts">
	import { page } from '$app/state';
	import { Badge } from '#lib/index.js';
	import { statusBadge } from '#site/utils/status.js';

	const status = $derived(page.data?.meta?.status as string | undefined);
	const badge = $derived(status ? statusBadge(status) : null);
</script>

{#if badge}
	<Badge appearance={badge.appearance} color={badge.color} title={badge.message} shape="rounded">{badge.label}</Badge>
{/if}
