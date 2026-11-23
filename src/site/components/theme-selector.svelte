<script lang="ts">
	import { setMode, userPrefersMode } from 'mode-watcher';
	import { MediaQuery } from 'svelte/reactivity';
	import DesktopRegular from 'fluentui-icons-svelte/DesktopRegular.svelte';
	import WeatherSunnyRegular from 'fluentui-icons-svelte/WeatherSunnyRegular.svelte';
	import WeatherMoonRegular from 'fluentui-icons-svelte/WeatherMoonRegular.svelte';
	import { SegmentedControl, SegmentedControlItem } from '#lib/index.js';
	import { m } from '#i18n/messages.js';

	let { showLabels = false }: { showLabels?: boolean } = $props();
	const mobile = new MediaQuery('(max-width: 600px)');

	const choices = [
		{ value: 'system', label: m.site_theme_system, icon: DesktopRegular },
		{ value: 'light', label: m.site_theme_light, icon: WeatherSunnyRegular },
		{ value: 'dark', label: m.site_theme_dark, icon: WeatherMoonRegular }
	] as const;
</script>

<SegmentedControl
	size={mobile.current ? 'small' : 'medium'}
	aria-label={m.site_theme()}
	selectedValue={userPrefersMode.current}
	onSelectionChange={(_, value) => {
		if (value === 'system' || value === 'light' || value === 'dark') setMode(value);
	}}
	equalWidth={false}
	hideIndicator
>
	{#each choices as { value, label, icon } (value)}
		<SegmentedControlItem {value} {icon} aria-label={label()} title={label()}>
			{#if showLabels}<span class="theme-label">{label()}</span>{/if}
		</SegmentedControlItem>
	{/each}
</SegmentedControl>

<style>
	@media (max-width: 1080px) {
		.theme-label {
			display: none;
		}
	}
</style>
