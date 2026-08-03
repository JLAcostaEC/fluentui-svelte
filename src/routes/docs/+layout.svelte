<script lang="ts">
	import Docs from '$site/components/docs/docs.svelte';
	import { m } from '$i18n/messages.js';
	// Imported directly (not via a server load) because each META may carry an
	// `icon` Svelte component, which is not serializable across the load boundary.
	import paths from '$docs/index.js';

	let { children } = $props();

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
</script>

<Docs {primaryNavigation} secondaryNavigation={paths}>
	{@render children()}
</Docs>
