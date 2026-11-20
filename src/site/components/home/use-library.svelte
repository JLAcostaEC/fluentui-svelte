<script lang="ts">
	import { AppSurface, AppWindow, TitleBar, TitleBarLeftControls } from '#lib/index.js';
	import { m } from '#i18n/messages.js';
	import { INSTALL_COMMAND } from '#site/constants.js';
	import Command from '#site/components/command.svelte';
	import RenderShiki from '#site/components/render-shiki/render-shiki.svelte';
	import UsageExample from '#site/components/usage-example.svelte';
	import { usageCode } from '#site/utils/usage-code.js';

	const setup = [
		'<script>',
		"  import 'fluentui-svelte/theme.css';",
		"  import 'fluentui-svelte/media-darkmode.css';",
		"  import { FluentUISvelte } from 'fluentui-svelte';",
		'  let { children } = $props();',
		'</' + 'script>',
		'',
		'<FluentUISvelte>{@render children()}</FluentUISvelte>'
	].join('\n');

	const usage = $derived(usageCode());
</script>

<section class="site-shell site-section">
	<div class="site-heading">
		<span class="site-section-label">{m.global_usage()}</span>
		<h2>{m.site_use_title()}</h2>
		<p>{m.site_use_description()}</p>
	</div>
	<div class="usage">
		<ol>
			<li>
				<h3>{m.site_use_install()}</h3>
				<Command command={INSTALL_COMMAND} />
			</li>
			<li>
				<h3>{m.site_use_setup()}</h3>
				<RenderShiki code={setup} />
			</li>
			<li>
				<h3>{m.site_use_compose()}</h3>
				<RenderShiki code={usage} />
			</li>
		</ol>
		<div class="preview">
			<AppWindow active height="16rem">
				<TitleBar leftControls={identity} />
				<AppSurface class="live-demo"><UsageExample stacked /></AppSurface>
			</AppWindow>
		</div>
	</div>
</section>

{#snippet identity()}<TitleBarLeftControls appName={m.site_demo_caption()} />{/snippet}

<style>
	.usage {
		display: grid;
		grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
		align-items: start;
		gap: 2rem;

		& ol {
			counter-reset: steps;
			display: grid;
			gap: 1.55rem;
			margin-inline-start: 0.95rem;
			padding-inline-start: 1.9rem;
			border-inline-start: 1px solid var(--fs-control-stroke-default);
			list-style: none;
			& li {
				position: relative;
				min-width: 0;
				counter-increment: steps;
			}
			& li::before {
				position: absolute;
				inset-inline-start: -2.9rem;
				inset-block-start: 0;
				display: grid;
				place-items: center;
				width: 1.9rem;
				aspect-ratio: 1;
				content: counter(steps);
				border-radius: 50%;
				background: var(--fs-accent-fill-default);
				color: var(--fs-text-on-accent-primary);
				font-size: 0.84rem;
				font-weight: 650;
			}
			& h3 {
				font-weight: 650;
				margin-block-end: 0.4rem;
			}
		}
		& :global(.shiki) {
			max-width: 100%;
			overflow-x: auto;
		}
		& :global(.live-demo) {
			padding: 1.4rem;
		}
	}
	.preview {
		position: sticky;
		top: 5rem;
		min-width: 0;
	}
	@media (max-width: 700px) {
		.usage {
			grid-template-columns: minmax(0, 1fr);
			gap: 1rem;
		}
		.preview {
			position: static;
		}
	}
</style>
