<script lang="ts">
	import { Badge, Button, Card, Expander, Hyperlink, InfoBar, Tag, ToggleSwitch } from '#lib/index.js';
	import CheckmarkCircleFilled from 'fluentui-icons-svelte/CheckmarkCircleFilled.svelte';
	import CheckmarkRegular from 'fluentui-icons-svelte/CheckmarkRegular.svelte';
	import ArrowRightRegular from 'fluentui-icons-svelte/ArrowRightRegular.svelte';
	import HeartRegular from 'fluentui-icons-svelte/HeartRegular.svelte';
	import { getTabspotAttributes, type TabspotNodeOptions } from 'tabspot';
	import { attachTabspot } from '#components/list-view/utils.js';
	import { I18nMarkupMessage } from '@jlacostaec/paraglide-markup-svelte';
	import { m } from '#i18n/messages.js';
	import { getReducedMotion } from '#lib/providers/fluentui-svelte/fluentui-svelte.js';
	import { GITHUB_REPO_URL, INSTALL_COMMAND, SPONSOR_URL, VERSION } from '#site/constants.js';
	import { getAccentPreference } from '#site/preferences.js';
	import { accentSteps, defaultAccent, normalizeAccent } from '#site/utils/accent-ramp.js';
	import { localizedPath } from '#site/utils/localized-path.js';
	import components from '#site/utils/components-index.js';
	import Command from '#site/components/command.svelte';
	import AccentGenerator from '#site/components/home/accent-generator.svelte';
	import AccentPresets from '#site/components/home/accent-presets.svelte';
	import ComponentGallery from '#site/components/home/component-gallery.svelte';
	import DesktopScene from '#site/components/home/desktop-scene.svelte';
	import HeroWallpaper from '#site/components/home/hero-wallpaper.svelte';
	import BlocksGallery from '#site/components/home/blocks-gallery.svelte';
	import UseLibrary from '#site/components/home/use-library.svelte';
	import IconsCta from '#site/components/icons-cta.svelte';
	import Seo from '#site/components/seo/seo.svelte';
	import RenderShiki from '#site/components/render-shiki/render-shiki.svelte';

	const storedAccent = getAccentPreference();
	const accent = $derived(normalizeAccent(storedAccent.current) ?? defaultAccent);
	const reduceMotion = getReducedMotion();
	const visibleComponents = components.filter(({ status }) => status !== 'Empty');
	const middle = Math.ceil(visibleComponents.length / 2);
	const rows = [visibleComponents.slice(0, middle), visibleComponents.slice(middle)];
	const states = [
		['default', m.site_state_default],
		['hover', m.site_state_hover],
		['pressed', m.site_state_pressed],
		['focus', m.site_state_focus],
		['disabled', m.global_disabled]
	] as const;
	let notifications = $state<boolean | null>(true);
	const keyboard: TabspotNodeOptions = {
		root: {},
		mover: { axis: 'horizontal', cyclic: true, items: 'a', activation: { mode: 'focus', roving: true } }
	};
	const nativeTags = ['<dialog>', '<details>', '<summary>'];
	const keys = ['Tab', '←', '→', 'Enter'];

	function setAccent(color: string) {
		const valid = normalizeAccent(color);
		if (valid) storedAccent.current = valid;
	}
</script>

<Seo
	title={m.seo_home_title()}
	titleTemplate="%s"
	description={m.seo_home_description()}
	keywords={m.seo_home_keywords().split(', ')}
	openGraph={{ type: 'website' }}
/>

<section class="hero site-vivid">
	<HeroWallpaper {accent} />
	<div class="site-shell hero-inner">
		<div class="hero-copy site-on-vivid">
			<div class="kicker">
				<Badge shape="circular" class="hero-version">v{VERSION}</Badge>
				<span>{m.site_hero_kicker()}</span>
				<Hyperlink href={localizedPath('/docs/components')}>{m.site_hero_browse()} →</Hyperlink>
			</div>
			<h1>{m.site_hero_line_one()} <span>{m.site_hero_line_two()}</span></h1>
			<p>{m.global_library_description()}</p>
			<div class="site-actions hero-actions">
				<Command command={INSTALL_COMMAND} />
				<Button as="a" href={localizedPath('/docs/getting-started')}>{m.site_get_started()}</Button>
				<Button as="a" appearance="standard" href={GITHUB_REPO_URL}>{m.home_github_repo_button()}</Button>
			</div>
			<ul class="facts">
				<li><CheckmarkCircleFilled width="1em" aria-hidden="true" />{m.site_hero_runes()}</li>
				<li><CheckmarkCircleFilled width="1em" aria-hidden="true" />{m.site_hero_accessible()}</li>
				<li>
					<CheckmarkCircleFilled width="1em" aria-hidden="true" /><span
						><I18nMarkupMessage message={m.site_hero_native} /></span
					>
				</li>
				<li><CheckmarkCircleFilled width="1em" aria-hidden="true" />{m.site_hero_mit()}</li>
			</ul>
		</div>
		<DesktopScene {accent} select={setAccent} />
	</div>
</section>

<div class={['marquee', { still: reduceMotion() }]} aria-hidden="true">
	{#each rows as row, index (index)}
		<div class={['marquee-track', { reverse: index === 1 }]}>
			{#each [0, 1] as copy (copy)}
				<div class="marquee-items">
					{#each row as { title, slug } (slug)}<Tag shape="rounded">{title}</Tag>{/each}
				</div>
			{/each}
		</div>
	{/each}
</div>

<div class="site-shell attention">
	<InfoBar title={m.docs_overview_attention_title()} status="warning" style="multiline" hideCloseButton>
		<p>{m.docs_overview_attention_description()}</p>
	</InfoBar>
</div>

<section class="site-shell site-section">
	<div class="site-heading">
		<span class="site-section-label">{m.site_why_eyebrow()}</span>
		<h2>{m.site_why_title()}</h2>
	</div>
	<div class="bento">
		<Card as="article" orientation="vertical" class="materials">
			<h3>{m.site_why_materials()}</h3>
			<p>{m.site_why_materials_text()}</p>
			<div class="materials-stack" aria-hidden="true">
				<div>Mica</div>
				<div>AppSurface</div>
				<div>Card</div>
				<div>Acrylic</div>
			</div>
		</Card>
		<Card as="article" orientation="vertical">
			<h3>{m.site_why_svelte()}</h3>
			<p><I18nMarkupMessage message={m.site_why_svelte_text} /></p>
			<div class="rune-preview">
				<RenderShiki code="let checked = $state(true)" lang="typescript" hideCopyButton />
				<ToggleSwitch label={m.site_demo_notifications()} bind:checked={notifications} />
				<output>checked = {notifications}</output>
			</div>
		</Card>
		<Card as="article" orientation="vertical">
			<h3>{m.site_why_states()}</h3>
			<p>{m.site_why_states_text()}</p>
			<div class="states" inert aria-hidden="true">
				{#each states as [state, caption] (state)}
					<figure>
						<Button class={'state-' + state} appearance="standard" disabled={state === 'disabled'}
							>{m.site_demo_save()}</Button
						>
						<figcaption>{caption()}</figcaption>
					</figure>
				{/each}
			</div>
		</Card>
		<Card as="article" orientation="vertical">
			<h3>{m.site_why_rebrand()}</h3>
			<p>{m.site_why_rebrand_text()}</p>
			<div class="mini-ramp" aria-hidden="true">
				{#each accentSteps as step (step)}<span style:background={'rgb(var(--fs-accent-' + step + '))'}></span>{/each}
			</div>
			<AccentPresets {accent} select={setAccent} />
		</Card>
		<Card as="article" orientation="vertical">
			<h3>{m.site_why_keyboard()}</h3>
			<p>{m.site_why_keyboard_text()}</p>
			<div class="keycaps">
				{#each keys as key (key)}<kbd>{key}</kbd>{/each}
			</div>
			<div
				class={['focus-demo', { still: reduceMotion() }]}
				role="group"
				aria-label={m.site_why_keyboard()}
				{...getTabspotAttributes(keyboard)}
				{@attach attachTabspot(keyboard)}
			>
				<Button as="a" appearance="standard" href={localizedPath('/docs')}>{m.global_overview()}</Button>
				<Button as="a" appearance="standard" href={localizedPath('/docs/components')}>{m.docs_nav_title()}</Button>
				<Button as="a" appearance="accent" href={localizedPath('/docs/getting-started')}>{m.site_get_started()}</Button>
			</div>
		</Card>
		<Card as="article" orientation="vertical">
			<h3>{m.site_why_native()}</h3>
			<p><I18nMarkupMessage message={m.site_why_native_text} /></p>
			<Expander header={m.site_expanded()} justify>
				<div class="native-demo site-actions">
					<Button as="a" appearance="subtle" href={localizedPath('/docs/components/dialog')}>Dialog</Button>
					<Button as="a" appearance="subtle" href={localizedPath('/docs/components/expander')}>Expander</Button>
				</div>
			</Expander>
			<div class="native-tags">
				{#each nativeTags as name (name)}
					<Tag shape="rounded">{name}</Tag>
				{/each}
				<Tag shape="rounded" icon={CheckmarkRegular} class="motion-tag">prefers-reduced-motion</Tag>
			</div>
		</Card>
	</div>
</section>

<IconsCta feature />

<UseLibrary />
<ComponentGallery />

<BlocksGallery />

<AccentGenerator {accent} select={setAccent} />

<section class="closing site-vivid">
	<HeroWallpaper {accent} />
	<div class="site-section site-shell site-on-vivid">
		<div class="kicker">
			<Badge class="hero-version" shape="rounded">MIT</Badge>
			<span>{m.site_closing_notice()}</span>
		</div>
		<div class="site-heading">
			<h2>{m.site_closing_title()}</h2>
			<p>{m.site_closing_description()}</p>
		</div>
		<div class="site-actions hero-actions">
			<Command command={INSTALL_COMMAND} />
			<Button as="a" href={localizedPath('/docs')}>{m.home_view_docs_button()}<ArrowRightRegular width="1em" /></Button>
			<Button as="a" appearance="standard" href={SPONSOR_URL}><HeartRegular width="1em" />{m.site_sponsor()}</Button>
		</div>
	</div>
</section>

<style>
	.hero-inner {
		padding-block: clamp(3rem, 6.7vw, 6rem) 3rem;
	}
	.hero-copy {
		display: grid;
		justify-items: center;
		gap: clamp(1.2rem, 2.4vw, 2rem);
		max-width: 73rem;
		margin-inline: auto;
		text-align: center;

		& h1 {
			font-weight: 650;
			font-size: clamp(2.8rem, 7.7vw, 7rem);
			line-height: 1;
			letter-spacing: -0.055em;
			text-wrap: balance;

			& span {
				display: block;
				padding-block-end: 0.08em;
				color: rgb(var(--fs-accent-light-2));
				background: linear-gradient(100deg, rgb(var(--fs-accent-light-3)), rgb(var(--fs-accent-light-2)) 54%, #fff);
				background-clip: text;
				-webkit-text-fill-color: transparent;
			}
		}
		& p {
			max-width: 38rem;
			color: var(--fs-text-secondary);
			font-size: clamp(1rem, 2vw, 1.17rem);
			line-height: 1.6;
		}
		& .site-actions {
			justify-content: center;
		}
	}
	.kicker {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0.55rem;
		padding: 0.2rem 0.7rem 0.2rem 0.3rem;
		border: 1px solid var(--fs-control-stroke-secondary);
		border-radius: 9rem;
		background: var(--fs-control-fill-default);
		color: var(--fs-text-secondary);
		font-size: 0.78rem;

		& :global(.hero-version) {
			--fs-system-neutral: var(--fs-accent-fill-default);
		}
		& :global(a) {
			color: rgb(var(--fs-accent-light-3));
			font-weight: 650;
			font-size: inherit;
		}
	}
	.hero-actions > :global(.fs-button) {
		min-height: var(--site-action-height, 2.5rem);
	}
	.facts {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0.55rem 1.1rem;
		padding: 0;
		list-style: none;
		color: var(--fs-text-secondary);
		font-size: 0.76rem;
		& li {
			display: flex;
			align-items: center;
			gap: 0.36rem;
		}
		& :global(svg) {
			color: rgb(var(--fs-accent-light-2));
		}
	}
	.marquee {
		display: grid;
		gap: 0.52rem;
		width: 100%;
		padding-block: 1.65rem;
		overflow: hidden;
		border-block-end: 1px solid var(--fs-control-stroke-secondary);
		mask-image: linear-gradient(90deg, transparent, #000 8% 92%, transparent);

		&:hover .marquee-track {
			animation-play-state: paused;
		}
		&.still .marquee-track {
			animation: none;
		}
	}
	.marquee-track,
	.marquee-items {
		display: flex;
		width: max-content;
	}
	.marquee-track {
		animation: marquee 110s linear infinite;
		&.reverse {
			animation-direction: reverse;
			animation-duration: 132s;
		}
	}
	.marquee-items {
		gap: 0.5rem;
		padding-inline: 0.25rem;
	}
	@keyframes marquee {
		to {
			transform: translateX(-50%);
		}
	}
	.attention {
		padding-block-start: 2rem;
	}
	.bento {
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: 0.75rem;

		& > :global(.fs-card) {
			grid-column: span 2;
			min-width: 0;
			gap: 0.8rem;
			padding: clamp(1.05rem, 2.6vw, 1.5rem);
		}
		& h3 {
			font-size: 1.22rem;
			font-weight: 650;
		}
		& p {
			color: var(--fs-text-secondary);
		}
	}
	.materials-stack {
		display: grid;
		place-items: center;
		min-height: 16rem;
		margin-block: auto;
		perspective: 58rem;
		isolation: isolate;

		& div {
			grid-area: 1 / 1;
			display: flex;
			width: min(76%, 18rem);
			aspect-ratio: 1.65;
			align-items: end;
			padding: 0.85rem;
			border: 1px solid var(--fs-card-stroke-default);
			border-radius: var(--fs-control-overlay-border-radius);
			box-shadow: 0 0.65rem 1.15rem #0003;
			transform: rotateX(56deg) rotateZ(-32deg) translateZ(var(--lift, 0px));
			background: var(--fs-solid-background-quaternary);
			font-weight: 600;
		}
		& div:first-child {
			--lift: -3.5rem;
			background: var(--fs-radial-mica-bg);
		}
		& div:nth-child(2) {
			width: min(64%, 15rem);
			background: var(--fs-solid-background-tertiary);
		}
		& div:nth-child(3) {
			--lift: 2.9rem;
			width: min(50%, 11rem);
		}
		& div:last-child {
			--lift: 5.75rem;
			width: min(36%, 8rem);
			background: var(--fs-accent-acrylic-background-default);
		}
	}
	.rune-preview {
		display: grid;
		gap: 0.75rem;
		padding: 0.9rem;
		background: var(--fs-solid-background-secondary);
		border-radius: var(--fs-control-overlay-border-radius);
		& output {
			font-family: 'Cascadia Code', monospace;
			font-size: 0.78rem;
		}
		& output {
			color: var(--fs-accent-text-primary);
		}
		& :global(pre.shiki) {
			padding: 0;
			border: 0;
			background: transparent !important;
		}
	}
	.states {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 0.7rem 0.45rem;
		& figure {
			display: grid;
			gap: 0.4rem;
			min-width: 0;
			text-align: center;
			font-size: 0.7rem;
		}
		& :global(.fs-button) {
			padding-inline: 0.25rem;
		}
		& :global(.state-hover) {
			background: var(--fs-control-fill-secondary);
		}
		& :global(.state-pressed) {
			background: var(--fs-control-fill-tertiary);
			color: var(--fs-text-secondary);
		}
		& :global(.state-focus) {
			outline: 2px solid var(--fs-focus-stroke-outer);
			outline-offset: 1px;
		}
	}
	.mini-ramp {
		display: flex;
		min-height: 1.6rem;
		overflow: hidden;
		border-radius: var(--fs-control-border-radius);
		& span {
			flex: 1;
		}
	}
	.keycaps {
		display: flex;
		gap: 0.35rem;
		& kbd {
			padding: 0.2rem 0.45rem;
			border: 1px solid var(--fs-card-stroke-default);
			border-radius: var(--fs-control-border-radius);
			background: var(--fs-solid-background-secondary);
		}
	}
	.native-demo {
		padding: 0.6rem 0.8rem;
	}
	.native-tags,
	.focus-demo {
		display: flex;
		align-items: start;
		flex-wrap: wrap;
		gap: 0.55rem;
	}
	.native-tags :global(.motion-tag) {
		background: var(--fs-system-success-bg);
		color: var(--fs-system-success-text);
	}
	.focus-demo:not(:focus-within, .still) :global(a) {
		outline: 2px solid transparent;
		outline-offset: 2px;
		animation: demo-focus 3.6s step-end infinite;
	}
	.focus-demo :global(a:nth-child(2)) {
		animation-delay: 1.2s;
	}
	.focus-demo :global(a:nth-child(3)) {
		animation-delay: 2.4s;
	}
	@keyframes demo-focus {
		0% {
			outline-color: var(--fs-focus-stroke-outer);
		}
		33.333% {
			outline-color: transparent;
		}
	}
	.closing {
		text-align: center;
		& .site-section {
			padding-block: clamp(3.5rem, 8vw, 7rem);
		}
		& .kicker {
			width: fit-content;
			margin: 0 auto 1.8rem;
		}
		& .site-actions {
			justify-content: center;
		}
		& h2 {
			max-width: 13ch;
			margin-inline: auto;
			font-size: clamp(2.4rem, 6.2vw, 4.7rem);
		}
		& p {
			margin: 0.5rem auto 0;
			max-width: 52ch;
		}
	}
	@media (max-width: 850px) {
		.bento {
			grid-template-columns: minmax(0, 1fr);
		}
		.bento > :global(.fs-card) {
			grid-column: 1;
			grid-row: auto;
		}
	}
	@media (min-width: 851px) {
		.bento > :global(.materials) {
			grid-column: span 3;
			grid-row: span 2;
		}
		.bento > :global(.fs-card:nth-child(2)),
		.bento > :global(.fs-card:nth-child(3)) {
			grid-column: span 3;
		}
	}
	@media (max-width: 580px) {
		.hero-copy h1 {
			font-size: clamp(2.55rem, 9.45vw, 4rem);
		}
		.hero-actions {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			width: min(100%, 22rem);
			margin-inline: auto;
			& > :global(.site-command) {
				grid-column: 1 / -1;
			}
			& > :global(.fs-button) {
				min-width: 0;
				white-space: normal;
			}
		}
	}
	@media (max-width: 420px) {
		.states {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.marquee-track {
			animation: none;
		}
		.focus-demo:not(:focus-within, .still) :global(a) {
			animation: none;
		}
	}
</style>
