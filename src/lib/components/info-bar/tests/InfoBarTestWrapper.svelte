<script lang="ts">
	import { InfoBar } from '$lib/index.js';
	import type { InfoBarProps } from '$lib/components/info-bar/types.js';

	let { message = 'Something happened.', ...props }: Partial<InfoBarProps> & { message?: string } = $props();
</script>

<InfoBar {...props}>{message}</InfoBar>
