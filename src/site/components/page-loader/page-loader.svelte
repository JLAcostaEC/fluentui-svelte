<script lang="ts">
	import { navigating } from '$app/state';
	import { watch } from 'runed';
	import { ProgressBar } from '$lib/index.js';

	let loading = $state();
	let fakeProgress = $state(1);

	watch(
		() => navigating.to,
		() => {
			if (!navigating.to) {
				const finalInterval = setInterval(() => {
					fakeProgress += Math.random() * 10;
					if (fakeProgress >= 100) {
						clearInterval(finalInterval);
						setTimeout(() => {
							loading = false;
						}, 500);
					}
				}, 80);
			} else {
				loading = true;
				fakeProgress = 1;
				const initialInterval = setInterval(() => {
					if (!loading) return clearInterval(initialInterval);
					fakeProgress += Math.random() * 10;
					if (fakeProgress >= 60) {
						clearInterval(initialInterval);
					}
				}, 120);
			}
		}
	);
</script>

{#if loading}
	<ProgressBar hideRail value={fakeProgress} class="page-loader" />
{/if}

<style>
	:global(.fs-progress-bar.page-loader) {
		position: fixed;
		top: 0;
		z-index: 9999;
	}
</style>
