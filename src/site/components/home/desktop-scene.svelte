<script lang="ts">
	import { mode, setMode, userPrefersMode } from 'mode-watcher';
	import { MediaQuery } from 'svelte/reactivity';
	import {
		AppSurface,
		AppWindow,
		Button,
		CalendarView,
		Card,
		DropdownSelect,
		DropdownSelectOption,
		Flyout,
		Hyperlink,
		InfoBar,
		ListView,
		ListViewItem,
		Menu,
		MenuItem,
		MenuItemSwitch,
		MenuList,
		MenuPopover,
		MenuTrigger,
		Persona,
		ProgressBar,
		SideNav,
		SideNavItem,
		Slider,
		TeachingTip,
		TeachingTipHeader,
		TitleBar,
		TitleBarLeftControls,
		ToggleSwitch
	} from '#lib/index.js';
	import SettingsRegular from 'fluentui-icons-svelte/SettingsRegular.svelte';
	import HomeRegular from 'fluentui-icons-svelte/HomeRegular.svelte';
	import WeatherSunnyRegular from 'fluentui-icons-svelte/WeatherSunnyRegular.svelte';
	import PersonRegular from 'fluentui-icons-svelte/PersonRegular.svelte';
	import FolderRegular from 'fluentui-icons-svelte/FolderRegular.svelte';
	import DocumentRegular from 'fluentui-icons-svelte/DocumentRegular.svelte';
	import CalendarRegular from 'fluentui-icons-svelte/CalendarRegular.svelte';
	import AddRegular from 'fluentui-icons-svelte/AddRegular.svelte';
	import { getReducedMotion } from '#lib/providers/fluentui-svelte/fluentui-svelte.js';
	import { m } from '#i18n/messages.js';
	import { getLocale } from '#i18n/runtime.js';
	import { INSTALL_COMMAND } from '#site/constants.js';
	import CopyText from '#site/components/copy-text.svelte';
	import AccentPresets from './accent-presets.svelte';

	let { accent, select }: { accent: string; select: (color: string) => void } = $props();
	const reduceMotion = getReducedMotion();
	const narrow = new MediaQuery('(max-width: 600px)');
	const sections = [
		{ id: 'home', label: m.global_home, icon: HomeRegular },
		{ id: 'theme', label: m.site_demo_personalization, icon: WeatherSunnyRegular },
		{ id: 'accounts', label: m.site_demo_accounts, icon: PersonRegular }
	] as const;
	const exampleDate = new Date(2026, 5, 20, 12);
	const exampleFiles = ['components', 'theme.css', 'button.svelte', 'about-banner.png'];
	let selected = $state<(typeof sections)[number]['id']>('theme');
	let showTip = $state(true);
	let textSize = $state(100);
	let x = $state(0);
	let y = $state(0);
	let copyStatus = $state('');

	function toggleTheme() {
		setMode(mode.current === 'dark' ? 'light' : 'dark');
	}

	async function copyInstall() {
		try {
			await navigator.clipboard.writeText(INSTALL_COMMAND);
			copyStatus = m.site_copied();
		} catch {
			copyStatus = m.site_copy_failed();
		}
	}
</script>

<div
	class="desktop-scene"
	role="group"
	aria-label={m.site_desktop_label()}
	style:--scene-x={(reduceMotion() ? 0 : x) + 'px'}
	style:--scene-y={(reduceMotion() ? 0 : y) + 'px'}
	onpointermove={(event) => {
		if (reduceMotion() || event.pointerType !== 'mouse') return;
		const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
		x = (event.clientX - left - width / 2) / 25;
		y = (event.clientY - top - height / 2) / 23;
	}}
	onpointerleave={() => {
		x = 0;
		y = 0;
	}}
>
	<div class="inactive left" inert aria-hidden="true">
		<AppWindow>
			<TitleBar leftControls={filesIdentity} />
			<AppSurface class="inactive-surface">
				<Button appearance="subtle"><AddRegular width="1em" />{m.site_demo_files_new()}</Button>
				<ListView navigationMode="items">
					{#each exampleFiles as file, index (file)}
						<ListViewItem active={index === 0}>
							{#if index === 0}<FolderRegular width="1em" />{:else}<DocumentRegular width="1em" />{/if}
							{file}
						</ListViewItem>
					{/each}
				</ListView>
			</AppSurface>
		</AppWindow>
	</div>
	<div class="inactive right" inert aria-hidden="true">
		<AppWindow>
			<TitleBar leftControls={calendarIdentity} />
			<AppSurface class="inactive-surface">
				<CalendarView value={exampleDate} today={exampleDate} locale={getLocale()} />
			</AppSurface>
		</AppWindow>
	</div>

	<div class="settings">
		<AppWindow active height="100%">
			<TitleBar tall leftControls={settingsIdentity} rightControls={quickMenu} />
			<SideNav
				label={m.site_navigation()}
				width="12rem"
				collapsed={narrow.current}
				showToggle={false}
				class="settings-navigation"
			>
				{#each sections as { id, label, icon } (id)}
					<SideNavItem as="button" label={label()} {icon} active={selected === id} onclick={() => (selected = id)} />
				{/each}
			</SideNav>
			<AppSurface class="settings-content" style={'--fs-demo-text-scale: ' + textSize / 100}>
				<h2>{sections.find((section) => section.id === selected)?.label()}</h2>
				{#if selected === 'theme'}
					<Card class="setting">
						<div class="setting-copy">
							<span>{m.site_demo_app_theme()}</span><small>{m.site_demo_app_theme_hint()}</small>
						</div>
						<DropdownSelect
							aria-label={m.site_demo_app_theme()}
							value={userPrefersMode.current}
							hidePlaceholder
							onchange={(event) => {
								const { value } = event.currentTarget;
								if (value === 'light' || value === 'dark' || value === 'system') setMode(value);
							}}
						>
							<DropdownSelectOption value="system">{m.site_theme_system()}</DropdownSelectOption>
							<DropdownSelectOption value="light">{m.site_theme_light()}</DropdownSelectOption>
							<DropdownSelectOption value="dark">{m.site_theme_dark()}</DropdownSelectOption>
						</DropdownSelect>
					</Card>
					<Card class="setting accent-setting">
						<div class="setting-copy"><span>{m.site_accent()}</span><small>{m.site_demo_accent_hint()}</small></div>
						<AccentPresets {accent} {select} />
						<Hyperlink href="#accent-generator">{m.site_accent_generator_link()}</Hyperlink>
					</Card>
					<Card class="setting">
						<div class="setting-copy">
							<span>{m.site_demo_text_size()}</span><small>{m.site_demo_preview_only()}</small>
						</div>
						<div class="text-size">
							<output>{textSize}%</output><Slider
								aria-label={m.site_demo_text_size()}
								min={100}
								max={135}
								step={5}
								suffix="%"
								bind:value={textSize}
							/>
						</div>
					</Card>
				{:else if selected === 'home'}
					<InfoBar status="success" title={m.site_demo_up_to_date()} hideCloseButton
						>{m.site_demo_up_to_date_hint()}</InfoBar
					>
					<Card class="setting" orientation="vertical">
						<div class="setting-copy">
							<span>{m.site_demo_storage()}</span><small>{m.site_demo_storage_hint()}</small>
						</div>
						<ProgressBar aria-label={m.site_demo_storage()} value={164} max={256} />
					</Card>
				{:else}
					<Card class="setting"
						><Persona
							name="Jorge Acosta"
							primaryText={m.site_demo_local_account()}
							presence={{ status: 'available' }}
						/></Card
					>
				{/if}
			</AppSurface>
		</AppWindow>
	</div>

	<div class="floating-persona" aria-hidden="true">
		<Flyout class="scene-flyout"
			><Persona
				name="María Fernández"
				primaryText={m.site_demo_review()}
				presence={{ status: 'available' }}
				size={36}
			/></Flyout
		>
	</div>
	<div class="floating-notice" aria-hidden="true">
		<Flyout class="scene-flyout"
			><InfoBar status="success" title="svelte-check" hideCloseButton><span>{m.site_demo_ready()}</span></InfoBar
			></Flyout
		>
	</div>
	<div class="floating-tip">
		<TeachingTip bind:open={showTip} class="scene-tip">
			<TeachingTipHeader title={m.site_tip_title()} closeLabel={m.site_close()} icon={WeatherSunnyRegular} />
			<p>{m.site_tip_body()}</p>
		</TeachingTip>
	</div>
	<div class="floating-quick">
		<Flyout class="scene-flyout quick-controls">
			<p>{m.site_quick_settings()}</p>
			<ToggleSwitch label={m.site_theme_dark()} checked={mode.current === 'dark'} onclick={toggleTheme} />
			<CopyText showLabel value={INSTALL_COMMAND} />
		</Flyout>
	</div>
	<span class="site-sr-only" role="status">{copyStatus}</span>
</div>

{#snippet settingsIdentity()}
	<TitleBarLeftControls appName={m.site_demo_settings()} appIcon={SettingsRegular} releaseTag={m.site_demo_caption()} />
{/snippet}
{#snippet filesIdentity()}
	<TitleBarLeftControls appName={m.site_demo_files()} appIcon={FolderRegular} />
{/snippet}
{#snippet calendarIdentity()}
	<TitleBarLeftControls appName={m.site_demo_calendar()} appIcon={CalendarRegular} />
{/snippet}
{#snippet quickMenu()}
	<div class="title-actions">
		<Menu>
			<MenuTrigger>
				{#snippet children({ state, menuTriggerProps })}
					<Button
						bind:ref={state.ref as HTMLButtonElement}
						{...menuTriggerProps}
						appearance="subtle"
						aria-label={m.site_quick_settings()}
					>
						<SettingsRegular width="1.08em" />
					</Button>
				{/snippet}
			</MenuTrigger>
			<MenuPopover placement="bottom-end">
				<MenuList>
					<MenuItemSwitch checked={mode.current === 'dark'} onclick={toggleTheme}>{m.site_theme_dark()}</MenuItemSwitch>
					<MenuItem onclick={copyInstall}>{m.site_copy()}</MenuItem>
					<MenuItem onclick={() => (showTip = true)}>{m.site_tip_title()}</MenuItem>
				</MenuList>
			</MenuPopover>
		</Menu>
	</div>
{/snippet}

<style>
	.desktop-scene {
		position: relative;
		display: grid;
		place-items: center;
		max-width: 75rem;
		min-height: 34rem;
		margin: clamp(3.3rem, 7.6vw, 6.7rem) auto 0;
		isolation: isolate;
		text-align: start;

		& :global(.scene-flyout),
		& :global(.scene-tip) {
			background: color-mix(in srgb, var(--fs-acrylic-background-default) 77%, transparent);
			backdrop-filter: blur(1.4rem) saturate(1.4);
		}
	}
	.settings {
		width: min(100%, 50rem);
		height: 32rem;
		min-width: 0;
		z-index: 2;

		& :global(.settings-content) {
			display: flex;
			flex-direction: column;
			gap: 0.35rem;
			padding: clamp(0.75rem, 2vw, 1.6rem);
			min-width: 0;
			& :global(.setting) {
				justify-content: space-between;
				align-items: center;
				flex-wrap: wrap;
				padding: 0.55rem 0.95rem;
				gap: 0.6rem;
			}
			& :global(.setting.vertical) {
				align-items: stretch;
			}
			& :global(.accent-setting) {
				display: grid;
				justify-content: stretch;
			}
		}
		& h2 {
			font-size: calc(1.75rem * var(--fs-demo-text-scale, 1));
			font-weight: 650;
			margin-block-end: 0.45rem;
		}
	}
	.setting-copy {
		display: grid;
		gap: 0.16rem;
		font-size: calc(0.9rem * var(--fs-demo-text-scale, 1));
		& small {
			color: var(--fs-text-secondary);
		}
	}
	.text-size {
		display: flex;
		gap: 0.65rem;
		align-items: center;
		min-width: min(100%, 12rem);
	}
	.title-actions {
		display: flex;
		align-items: center;
		padding-inline-end: 0.3rem;
	}
	.inactive {
		position: absolute;
		width: 31%;
		height: 25rem;
		z-index: -1;
		& :global(.inactive-surface) {
			padding: 0.7rem;
		}
		&.left {
			inset-inline-start: 0;
			inset-block-start: 2.7rem;
			transform: perspective(60rem) translate(var(--scene-x), var(--scene-y)) rotateY(15deg) rotateZ(-3deg);
		}
		&.right {
			inset-inline-end: 0;
			inset-block-start: 4.6rem;
			transform: perspective(60rem) translate(calc(-1 * var(--scene-x)), var(--scene-y)) rotateY(-15deg) rotateZ(3deg);
		}
	}
	.floating-persona,
	.floating-notice,
	.floating-quick,
	.floating-tip {
		position: absolute;
		z-index: 3;
	}
	.floating-persona {
		inset-inline-start: -1.4rem;
		inset-block-start: 3.2rem;
		pointer-events: none;
		translate: calc(var(--scene-x) * 0.6) var(--scene-y);
	}
	.floating-notice {
		inset-inline-end: 6%;
		inset-block-end: -0.4rem;
		pointer-events: none;
		translate: calc(var(--scene-x) * -0.7) var(--scene-y);
	}
	.floating-quick {
		inset-inline-start: 7%;
		inset-block-end: -0.7rem;
		translate: var(--scene-x) var(--scene-y);

		& :global(.quick-controls) {
			display: grid;
			gap: 0.45rem;
			padding: 0.75rem;
		}
		& p {
			color: var(--fs-text-secondary);
			font-size: 0.8rem;
		}
	}
	.floating-tip {
		width: min(100%, 17rem);
		inset-inline-end: 2.5%;
		inset-block-start: -1.65rem;
		translate: calc(var(--scene-x) * -0.38) var(--scene-y);

		& p {
			padding-inline: 1rem;
			padding-block-end: 0.8rem;
		}
	}
	@media (max-width: 950px) {
		.inactive,
		.floating-notice,
		.floating-persona,
		.floating-quick {
			display: none;
		}
		.desktop-scene {
			min-height: 0;
			gap: 0.7rem;
		}
		.floating-tip {
			position: static;
			justify-self: end;
			order: -1;
			translate: none;
		}
	}
	@media (max-width: 600px) {
		.desktop-scene {
			display: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.desktop-scene {
			--scene-x: 0px !important;
			--scene-y: 0px !important;
		}
	}
</style>
