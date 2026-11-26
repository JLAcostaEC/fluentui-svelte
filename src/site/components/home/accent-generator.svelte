<script lang="ts">
	import { setMode } from 'mode-watcher';
	import {
		Badge,
		Button,
		Card,
		ColorPicker,
		Dropdown,
		DropdownOption,
		Hyperlink,
		InfoBar,
		Label,
		TextBox,
		ToggleSwitch
	} from '#lib/index.js';
	import { I18nMarkupMessage } from '@jlacostaec/paraglide-markup-svelte';
	import { m } from '#i18n/messages.js';
	import { getAccentPreference } from '#site/preferences.js';
	import {
		accentChecks,
		accentCss,
		accentSteps,
		defaultAccent,
		normalizeAccent,
		rgbToHex
	} from '#site/utils/accent-ramp.js';
	import AccentPresets from './accent-presets.svelte';
	import RenderShiki from '#site/components/render-shiki/render-shiki.svelte';

	const preference = getAccentPreference();
	let draft = $state<string | null>(null);
	const accent = $derived(preference.color);
	const displayedHex = $derived(draft ?? accent);
	const invalid = $derived(draft !== null && normalizeAccent(draft) === null);
	const ramp = $derived(preference.ramp);
	const textColors = $derived(preference.textColors);
	const checks = $derived(accentChecks(ramp, textColors));
	const anchoredSteps = $derived(preference.anchor === 'both' ? ['light-2', 'dark-1'] : [preference.anchor]);
	const anchorOptions = [
		['base', m.site_accent_anchor_base],
		['dark-1', m.site_accent_anchor_light_theme],
		['light-2', m.site_accent_anchor_dark_theme],
		['both', m.site_accent_anchor_both_themes]
	] as const;
	const previewThemes = [
		['light', m.site_theme_light],
		['dark', m.site_theme_dark]
	] as const;
	const labels = [
		m.site_accent_check_light_fill,
		m.site_accent_check_dark_fill,
		m.site_accent_check_light_link,
		m.site_accent_check_dark_link
	] as const;

	function selectColor(value: string) {
		draft = null;
		preference.setColor(value);
	}

	function reset() {
		preference.setAnchor('base');
		preference.setAdjustTextContrast(false);
		selectColor(defaultAccent);
	}

	function editHex(value: string) {
		draft = value;
		const valid = normalizeAccent(value);
		if (valid && value.trim().replace(/^#/, '').length === 6) preference.setColor(valid);
	}

	function finishHex() {
		const valid = draft && normalizeAccent(draft);
		if (valid) selectColor(valid);
	}
</script>

<section class="accent-section" id="accent-generator" aria-labelledby="accent-heading">
	<div class="site-section site-shell">
		<div class="site-heading">
			<h2 id="accent-heading">{m.site_accent_title()}</h2>
			<p><I18nMarkupMessage message={m.site_accent_text} /></p>
		</div>
		<div class="generator">
			<Card orientation="vertical" class="accent-editor">
				<h3>ColorPicker</h3>
				<div class="picker-layout">
					<ColorPicker
						value={accent}
						onColorChange={selectColor}
						label={m.site_accent()}
						format="hsv"
						collapsed
						moreLabel={m.site_expanded()}
						lessLabel={m.site_close()}
						channelLabels={{
							hue: m.site_hue(),
							saturation: m.site_saturation(),
							brightness: m.site_brightness(),
							hex: m.site_accent_hex()
						}}
					/>
					<div class="picker-details">
						<Label labelPosition="above" label={m.site_accent_hex()}>
							<TextBox
								value={displayedHex}
								oninput={(event) => editHex(event.currentTarget.value)}
								onblur={finishHex}
								onkeydown={(event) => {
									if (event.key === 'Enter') finishHex();
								}}
								aria-invalid={invalid || undefined}
								aria-describedby={invalid ? 'accent-hex-error' : undefined}
								spellcheck={false}
								maxlength={7}
							/>
						</Label>
						{#if invalid}<p id="accent-hex-error">{m.site_accent_invalid()}</p>{/if}
						<p>{m.site_accent_presets()}</p>
						<AccentPresets {accent} select={selectColor} />
					</div>
				</div>
				<Label labelPosition="above" label={m.site_accent_anchor_label()}>
					<Dropdown
						bind:value={() => preference.anchor, preference.setAnchor}
						aria-describedby="accent-anchor-description"
					>
						{#each anchorOptions as [value, label] (value)}
							<DropdownOption {value} text={label()}>{label()}</DropdownOption>
						{/each}
					</Dropdown>
				</Label>
				<p id="accent-anchor-description">{m.site_accent_anchor_description()}</p>
				{#if preference.anchor === 'both'}
					<InfoBar
						status="warning"
						style="multiline"
						title={m.site_accent_shared_warning_title()}
						headingLevel={4}
						hideCloseButton
					>
						<p>{m.site_accent_shared_warning_text()}</p>
					</InfoBar>
				{/if}
			</Card>
			<div class="accent-results">
				<div class="ramp-heading">
					<h3>{m.site_accent_ramp()}</h3>
					<Button appearance="subtle" onclick={reset}>{m.site_accent_reset()}</Button>
				</div>
				<ul class="ramp" aria-label={m.site_accent_ramp()}>
					{#each accentSteps as step, index (step)}
						{@const anchored = anchoredSteps.includes(step)}
						<li class:anchored>
							<div style:background={rgbToHex(ramp[index])}></div>
							<strong>{step}</strong><code>{rgbToHex(ramp[index])}</code>
							{#if anchored}<span class="site-sr-only">{m.site_accent_anchor_selected()}</span>{/if}
						</li>
					{/each}
				</ul>
				<div class="theme-previews">
					{#each previewThemes as [theme, label] (theme)}
						<div
							class={['theme-preview', theme === 'dark' && 'night']}
							style:--fs-text-on-accent-primary={textColors?.[theme].primary}
							style:--fs-text-on-accent-secondary={textColors?.[theme].secondary}
						>
							<h3>{label()}</h3>
							<div class="site-actions">
								<Button appearance="accent" onclick={() => setMode(theme)}>
									{m.site_demo_apply()}
								</Button>
								<Hyperlink href="#accent-generator">{m.site_accent()}</Hyperlink>
							</div>
						</div>
					{/each}
				</div>
				<Card orientation="vertical" class="accent-checks">
					<h3>{m.site_accent_checks()}</h3>
					<ToggleSwitch
						label={m.site_accent_adjust_text_contrast()}
						bind:checked={() => textColors !== undefined, preference.setAdjustTextContrast}
					/>
					<ul>
						{#each checks as ratio, index (index)}
							<li>
								<Badge color={ratio >= 4.5 ? 'success' : 'critical'} appearance="tint" shape="rounded">
									{ratio >= 4.5 ? m.site_pass() : m.site_fail()}
								</Badge>
								<span>{labels[index]()}</span>
								<span class="ratio">{ratio.toFixed(2)}:1</span>
							</li>
						{/each}
					</ul>
				</Card>
			</div>
			<div class="css-output">
				<RenderShiki code={accentCss(ramp, textColors)} lang="css" copyLabel={m.site_accent_css()} />
			</div>
		</div>
	</div>
</section>

<style>
	#accent-generator {
		scroll-margin-block-start: 5rem;
	}
	.accent-section {
		background: var(--fs-solid-background-tertiary);
		border-block-start: 1px solid var(--fs-card-stroke-default);
	}
	.generator {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		align-items: start;
		gap: 1rem;

		& :global(.accent-editor),
		& :global(.accent-checks) {
			gap: 0.8rem;
			padding: 1.15rem;
		}
		& :global(.accent-editor .fs-color-picker) {
			max-inline-size: 100%;
		}
	}
	.picker-layout {
		display: grid;
		grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
		gap: 1rem;
		align-items: start;
	}
	.picker-details {
		display: grid;
		gap: 0.65rem;
		align-content: start;
	}
	.picker-details p,
	#accent-anchor-description {
		color: var(--fs-text-secondary);
		font-size: 0.82rem;
	}
	.ramp-heading {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.4rem;
	}
	.accent-results {
		display: grid;
		gap: 0.85rem;
		min-width: 0;
		padding: 1.15rem;
		border: 1px solid var(--fs-card-stroke-default);
		border-radius: var(--fs-control-overlay-border-radius);
		background: var(--fs-card-background-default);
	}
	.ramp {
		display: grid;
		grid-template-columns: repeat(7, minmax(0, 1fr));
		gap: 0;
		list-style: none;
		padding: 0;

		& li {
			min-width: 0;
			text-align: center;

			&.anchored strong {
				text-decoration: underline;
				text-underline-offset: 0.18em;
			}
		}
		& div {
			min-height: 3.7rem;
			border-radius: 0;
		}
		& strong,
		& code {
			display: block;
			font-size: 0.72rem;
			overflow-wrap: anywhere;
		}
	}
	.theme-previews {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.75rem;
	}
	.theme-preview {
		--fs-accent-fill-default: rgb(var(--fs-accent-dark-1));
		--fs-accent-fill-secondary: rgba(var(--fs-accent-dark-1), 0.84);
		--fs-accent-fill-tertiary: rgba(var(--fs-accent-dark-1), 0.67);
		--fs-text-on-accent-primary: #fff;
		--fs-text-on-accent-secondary: #ffffffb3;
		--fs-accent-text-primary: rgb(var(--fs-accent-dark-2));
		--fs-accent-text-secondary: rgb(var(--fs-accent-dark-3));
		--fs-accent-text-tertiary: rgb(var(--fs-accent-dark-1));
		display: grid;
		gap: 0.6rem;
		padding: 0.9rem;
		border-radius: var(--fs-control-overlay-border-radius);
		background: #f9f9f9;
		color: #1b1b1b;
		color-scheme: light;

		&.night {
			--fs-accent-fill-default: rgb(var(--fs-accent-light-2));
			--fs-accent-fill-secondary: rgba(var(--fs-accent-light-2), 0.7);
			--fs-accent-fill-tertiary: rgba(var(--fs-accent-light-2), 0.6);
			--fs-text-on-accent-primary: #000;
			--fs-text-on-accent-secondary: #00000080;
			--fs-accent-text-primary: rgb(var(--fs-accent-light-3));
			--fs-accent-text-secondary: rgb(var(--fs-accent-light-3));
			--fs-accent-text-tertiary: rgb(var(--fs-accent-light-2));
			background: #282828;
			color: #fff;
			color-scheme: dark;
		}
	}
	.accent-results ul:not(.ramp) {
		display: grid;
		gap: 0.5rem;
		list-style: none;
		padding: 0;
		& li {
			display: grid;
			grid-template-columns: auto 1fr auto;
			align-items: center;
			gap: 0.75rem;
			font-size: var(--fs-caption-font-size);
		}
	}
	.ratio {
		font-variant-numeric: tabular-nums;
	}
	.css-output {
		grid-column: 1 / -1;
		min-width: 0;
	}
	@media (max-width: 960px) {
		.generator {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (max-width: 540px) {
		.picker-layout {
			grid-template-columns: minmax(0, 1fr);
		}
		.ramp {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.3rem;

			& li {
				display: grid;
				grid-template-columns: 2rem minmax(0, 1fr) auto;
				align-items: center;
				gap: 0.65rem;
				text-align: start;
			}
			& div {
				min-height: 1.6rem;
				border-radius: var(--fs-control-border-radius);
			}
		}
	}
</style>
