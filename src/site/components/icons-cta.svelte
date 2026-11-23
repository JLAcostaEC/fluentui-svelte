<script lang="ts">
	import { Button } from '#lib/index.js';
	import HomeFilled from 'fluentui-icons-svelte/HomeFilled.svelte';
	import SettingsRegular from 'fluentui-icons-svelte/SettingsRegular.svelte';
	import MailRegular from 'fluentui-icons-svelte/MailRegular.svelte';
	import CalendarFilled from 'fluentui-icons-svelte/CalendarFilled.svelte';
	import PeopleRegular from 'fluentui-icons-svelte/PeopleRegular.svelte';
	import StarRegular from 'fluentui-icons-svelte/StarRegular.svelte';
	import HeartFilled from 'fluentui-icons-svelte/HeartFilled.svelte';
	import FolderRegular from 'fluentui-icons-svelte/FolderRegular.svelte';
	import DocumentRegular from 'fluentui-icons-svelte/DocumentRegular.svelte';
	import AlertFilled from 'fluentui-icons-svelte/AlertFilled.svelte';
	import ChatRegular from 'fluentui-icons-svelte/ChatRegular.svelte';
	import CameraRegular from 'fluentui-icons-svelte/CameraRegular.svelte';
	import CloudFilled from 'fluentui-icons-svelte/CloudFilled.svelte';
	import BookmarkRegular from 'fluentui-icons-svelte/BookmarkRegular.svelte';
	import FlagRegular from 'fluentui-icons-svelte/FlagRegular.svelte';
	import LightbulbFilled from 'fluentui-icons-svelte/LightbulbFilled.svelte';
	import RocketRegular from 'fluentui-icons-svelte/RocketRegular.svelte';
	import CodeRegular from 'fluentui-icons-svelte/CodeRegular.svelte';
	import GlobeRegular from 'fluentui-icons-svelte/GlobeRegular.svelte';
	import AirplaneRegular from 'fluentui-icons-svelte/AirplaneRegular.svelte';
	import KeyRegular from 'fluentui-icons-svelte/KeyRegular.svelte';
	import SearchRegular from 'fluentui-icons-svelte/SearchRegular.svelte';
	import CartRegular from 'fluentui-icons-svelte/CartRegular.svelte';
	import MusicNote2Regular from 'fluentui-icons-svelte/MusicNote2Regular.svelte';
	import VideoFilled from 'fluentui-icons-svelte/VideoFilled.svelte';
	import ImageRegular from 'fluentui-icons-svelte/ImageRegular.svelte';
	import BuildingRegular from 'fluentui-icons-svelte/BuildingRegular.svelte';
	import BriefcaseFilled from 'fluentui-icons-svelte/BriefcaseFilled.svelte';
	import ShieldRegular from 'fluentui-icons-svelte/ShieldRegular.svelte';
	import WeatherSunnyRegular from 'fluentui-icons-svelte/WeatherSunnyRegular.svelte';
	import PaintBrushFilled from 'fluentui-icons-svelte/PaintBrushFilled.svelte';
	import BeakerRegular from 'fluentui-icons-svelte/BeakerRegular.svelte';
	import GiftRegular from 'fluentui-icons-svelte/GiftRegular.svelte';
	import TrophyFilled from 'fluentui-icons-svelte/TrophyFilled.svelte';
	import LocationRegular from 'fluentui-icons-svelte/LocationRegular.svelte';
	import MapRegular from 'fluentui-icons-svelte/MapRegular.svelte';
	import PhoneFilled from 'fluentui-icons-svelte/PhoneFilled.svelte';
	import WindowRegular from 'fluentui-icons-svelte/WindowRegular.svelte';
	import EyeRegular from 'fluentui-icons-svelte/EyeRegular.svelte';
	import CheckmarkCircleRegular from 'fluentui-icons-svelte/CheckmarkCircleRegular.svelte';
	import ArrowRightRegular from 'fluentui-icons-svelte/ArrowRightRegular.svelte';
	import { I18nMarkupMessage } from '@jlacostaec/paraglide-markup-svelte';
	import { getReducedMotion } from '#lib/providers/fluentui-svelte/fluentui-svelte.js';
	import { m } from '#i18n/messages.js';
	import { ICONS_URL } from '#site/constants.js';
	import Command from '#site/components/command.svelte';

	let { feature = false }: { feature?: boolean } = $props();
	const reduceMotion = getReducedMotion();
	const icons = [
		HomeFilled,
		SettingsRegular,
		MailRegular,
		CalendarFilled,
		PeopleRegular,
		StarRegular,
		HeartFilled,
		FolderRegular,
		DocumentRegular,
		AlertFilled,
		ChatRegular,
		CameraRegular,
		CloudFilled,
		BookmarkRegular,
		FlagRegular,
		LightbulbFilled,
		RocketRegular,
		CodeRegular,
		GlobeRegular,
		AirplaneRegular,
		KeyRegular,
		SearchRegular,
		CartRegular,
		MusicNote2Regular,
		VideoFilled,
		ImageRegular,
		BuildingRegular,
		BriefcaseFilled,
		ShieldRegular,
		WeatherSunnyRegular,
		PaintBrushFilled,
		BeakerRegular,
		GiftRegular,
		TrophyFilled,
		LocationRegular,
		MapRegular,
		PhoneFilled,
		WindowRegular,
		EyeRegular,
		CheckmarkCircleRegular
	];
</script>

<section class={['icons-band', { feature, still: reduceMotion() }]} aria-label={m.site_icons_title()}>
	<div class={['icons-cta', feature ? 'site-shell site-section' : 'compact']}>
		<div class="icon-copy">
			{#if feature}<span class="site-section-label">{m.site_icons_package()}</span>{/if}
			<h2>{feature ? m.site_icons_feature_title() : m.site_icons_title()}</h2>
			<p>
				{m.site_icons_description()}
				{#if feature}<I18nMarkupMessage message={m.site_icons_inherit} />{/if}
			</p>
			<div class="icon-actions">
				<Command command="pnpm add -D fluentui-icons-svelte" />
				<Button as="a" href={ICONS_URL}>{m.gs_icons_browse_button()}<ArrowRightRegular width="1em" /></Button>
			</div>
		</div>
		<div class="icon-wall" aria-hidden="true">
			{#each feature ? icons : icons.slice(0, 18) as Icon, index (Icon)}
				<span
					class={{ accent: [3, 12, 22, 29].includes(index), muted: [0, 7, 8, 15, 32, 39].includes(index) }}
					style:--tile-delay={-0.37 * index + 's'}
				>
					<Icon width="45%" height="45%" />
				</span>
			{/each}
		</div>
	</div>
</section>

<style>
	.icons-band {
		width: 100%;
		background: var(--fs-solid-background-tertiary);

		&.feature {
			border-block: 1px solid var(--fs-card-stroke-default);
			&:not(.still) .icon-wall span {
				animation: icon-bob 6s ease-in-out infinite;
				animation-delay: var(--tile-delay);
			}
		}
	}
	.icons-cta {
		display: grid;
		grid-template-columns: minmax(0, 0.86fr) minmax(0, 1.1fr);
		gap: clamp(1rem, 4vw, 4rem);
		align-items: center;
	}
	.compact {
		grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
		gap: 1.25rem;
		padding: 1.4rem;
		border: 1px solid var(--fs-card-stroke-default);
		border-radius: var(--fs-control-overlay-border-radius);
	}
	.icon-copy {
		display: grid;
		min-width: 0;
		gap: 0.92rem;

		& h2 {
			font-size: clamp(1.65rem, 3.4vw, 2.65rem);
			line-height: 1.14;
			font-weight: 650;
			letter-spacing: -0.025em;
		}
		& p {
			color: var(--fs-text-secondary);
			line-height: 1.6;
			max-width: 56ch;
		}
	}
	.icon-actions {
		display: grid;
		justify-items: start;
		gap: 0.65rem;
		& :global(.site-command) {
			width: min(100%, 22.5rem);
		}
	}
	.icon-wall {
		display: grid;
		grid-template-columns: repeat(8, minmax(0, 1fr));
		gap: 0.6rem;

		& span {
			display: grid;
			min-width: 0;
			aspect-ratio: 1;
			place-items: center;
			border-radius: var(--fs-control-overlay-border-radius);
			border: 1px solid var(--fs-card-stroke-default);
			background: var(--fs-card-background-default);
			color: var(--fs-text-primary);
			box-shadow: 0 1px 3px #0001;
		}
		& span:nth-child(5n + 2) {
			color: var(--fs-accent-text-primary);
		}
		& span.muted {
			opacity: 0.55;
		}
		& span.accent {
			background: var(--fs-accent-fill-default);
			color: var(--fs-text-on-accent-primary);
		}
	}
	.compact .icon-wall {
		gap: 0.35rem;
		grid-template-columns: repeat(6, minmax(0, 1fr));
	}
	@keyframes icon-bob {
		50% {
			translate: 0 -6px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.icons-band.feature:not(.still) .icon-wall span {
			animation: none;
		}
	}
	@media (max-width: 780px) {
		.icons-cta {
			grid-template-columns: minmax(0, 1fr);
		}
		.icon-wall {
			grid-template-columns: repeat(6, minmax(0, 1fr));
		}
		.feature .icon-wall span:nth-child(n + 31) {
			display: none;
		}
	}
</style>
