<script lang="ts">
	import Docs from '$site/components/docs/docs.svelte';
	import { m } from '$i18n/messages.js';

	let { children, data } = $props();

	const primaryNavigation = [
		{
			label: m.docs_primary_nav_overview(),
			url: '/docs',
			status: ''
		},
		{
			label: m.docs_primary_nav_getting_started(),
			url: '/docs/getting-started',
			status: ''
		}
	];

	const secondaryNavigation = data.paths;
</script>

<Docs {primaryNavigation} {secondaryNavigation}>
	{@render children()}
</Docs>
