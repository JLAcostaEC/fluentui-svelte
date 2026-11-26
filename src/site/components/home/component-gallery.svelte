<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Snippet } from 'svelte';
	import {
		Avatar,
		Badge,
		Breadcrumb,
		BreadcrumbButton,
		BreadcrumbDivider,
		BreadcrumbItem,
		Button,
		Card,
		Checkbox,
		DropdownSelect,
		DropdownSelectOption,
		Hyperlink,
		InfoBar,
		Label,
		ListView,
		ListViewItem,
		Menu,
		MenuItem,
		MenuList,
		MenuPopover,
		MenuTrigger,
		Persona,
		ProgressBar,
		ProgressRing,
		RadioButton,
		Slider,
		SplitButton,
		Tag,
		TextBox,
		ToggleSwitch,
		TopNav,
		TopNavItem
	} from '#lib/index.js';
	import { m } from '#i18n/messages.js';
	import { localizedPath } from '#site/utils/localized-path.js';
	import { componentPath } from '#site/utils/docs-navigation.js';

	const families = [
		['actions', m.site_actions],
		['inputs', m.site_inputs],
		['navigation', m.site_navigation],
		['status', m.global_status]
	] as const;
	const shapes = [
		['rounded', m.site_gallery_shape_rounded],
		['circular', m.site_gallery_shape_circular],
		['square', m.site_gallery_shape_square]
	] as const;
	const appearances = [
		['accent', m.site_gallery_appearance_accent],
		['standard', m.site_gallery_appearance_standard],
		['subtle', m.site_gallery_appearance_subtle]
	] as const;
	const navItems = [m.global_overview, m.site_gallery_history, m.site_gallery_schedule];
	const inboxItems = [m.site_gallery_inbox, m.site_gallery_alerts, m.site_gallery_shared];

	let selected = $state('actions');
	let selectedTab = $state('0');
	let billing = $state('monthly');
	let level = $state(40);
	let listSelection = $state<string[]>(['0']);
	let tags = $state(['Svelte', 'Fluent UI 2', 'WinUI 3']);
</script>

<section class="gallery-section">
	<div class="site-section site-shell">
		<div class="site-heading">
			<span class="site-section-label">{m.docs_nav_title()}</span>
			<h2>{m.site_gallery_title()}</h2>
			<p>{m.site_gallery_description()}</p>
		</div>
		<TopNav aria-label={m.docs_nav_title()} bind:selectedValue={selected} appearance="subtle" class="gallery-tabs">
			{#each families as [family, label] (family)}
				<TopNavItem value={family} id={'gallery-tab-' + family} aria-controls={'gallery-' + family}>
					{label()}
				</TopNavItem>
			{/each}
		</TopNav>

		{#each families as [family] (family)}
			<div
				class="gallery"
				role="tabpanel"
				id={'gallery-' + family}
				aria-labelledby={'gallery-tab-' + family}
				hidden={selected !== family}
			>
				{#if selected === family}
					{#if family === 'actions'}
						{@render tile('Button', 'button', actionButton)}
						{@render tile(m.site_gallery_button_shapes(), 'button', buttonShapes)}
						{@render tile('SplitButton', 'button', split)}
						{@render tile('Hyperlink', 'hyperlink', link)}
					{:else if family === 'inputs'}
						{@render tile('TextBox', 'text-box', textBox)}
						{@render tile('DropdownSelect', 'dropdown-select', dropdown)}
						{@render tile('Checkbox, RadioButton, ToggleSwitch', 'checkbox', choices)}
						{@render tile('Slider', 'slider', slider)}
					{:else if family === 'navigation'}
						{@render tile('TopNav', 'top-nav', nav)}
						{@render tile('ListView', 'list-view', list)}
						{@render tile('Breadcrumb', 'breadcrumb', breadcrumbs)}
						{@render tile('Tag', 'tag', tagDemo)}
					{:else}
						{@render tile('InfoBar', 'info-bar', notice)}
						{@render tile('Badge', 'badge', badges)}
						{@render tile('ProgressBar, ProgressRing', 'progress-bar', progress)}
						{@render tile('Avatar, Persona', 'persona', people)}
					{/if}
				{/if}
			</div>
		{/each}
	</div>
</section>

{#snippet tile(name: string, slug: string, demo: Snippet)}
	<Card orientation="vertical" class="gallery-tile">
		<div class="site-canvas demo-canvas">{@render demo()}</div>
		<h3 class="demo-label"><Hyperlink href={localizedPath(componentPath(slug))}>{name}</Hyperlink></h3>
	</Card>
{/snippet}

{#snippet actionButton()}
	<div class="site-actions">
		{#each appearances as [appearance, label] (appearance)}
			<Button {appearance}>{label()}</Button>
		{/each}
		<Button appearance="standard" disabled>{m.global_disabled()}</Button>
	</div>
{/snippet}

{#snippet buttonShapes()}
	<div class="site-actions">
		{#each shapes as [shape, label] (shape)}
			<Button {shape} appearance="standard">{label()}</Button>
		{/each}
		<Menu>
			<MenuTrigger>
				{#snippet children({ state, menuTriggerProps })}
					<Button bind:ref={state.ref as HTMLButtonElement} {...menuTriggerProps} appearance="standard" isMenuButton>
						{m.site_quick_settings()}
					</Button>
				{/snippet}
			</MenuTrigger>
			<MenuPopover>
				<MenuList>
					<MenuItem as="a" href={localizedPath(componentPath('button'))}>Button</MenuItem>
					<MenuItem as="a" href={localizedPath(componentPath('menu'))}>Menu</MenuItem>
				</MenuList>
			</MenuPopover>
		</Menu>
	</div>
{/snippet}

{#snippet split()}
	<div class="site-actions">
		{#each ['accent', 'standard'] as appearance (appearance)}
			<Menu>
				<MenuTrigger>
					{#snippet children({ state, menuTriggerProps })}
						<SplitButton
							appearance={appearance === 'accent' ? 'accent' : 'standard'}
							bind:menuTriggerRef={state.ref as HTMLButtonElement}
							menuTriggerProps={{ ...menuTriggerProps, 'aria-label': m.site_quick_settings() }}
							primaryButtonProps={{ onclick: () => void goto(localizedPath('/docs')) }}
						>
							{appearance === 'accent' ? m.site_demo_open() : m.site_demo_save()}
						</SplitButton>
					{/snippet}
				</MenuTrigger>
				<MenuPopover>
					<MenuList>
						<MenuItem as="a" href={localizedPath('/docs')}>{m.global_docs()}</MenuItem>
						<MenuItem as="a" href={localizedPath('/docs/getting-started')}>{m.global_getting_started()}</MenuItem>
					</MenuList>
				</MenuPopover>
			</Menu>
		{/each}
	</div>
{/snippet}

{#snippet link()}<Hyperlink href={localizedPath('/docs/getting-started')}>
		{m.global_getting_started()}
	</Hyperlink>{/snippet}

{#snippet textBox()}
	<Label labelPosition="above" label={m.site_gallery_email()}>
		<TextBox type="email" placeholder="name@example.com" />
	</Label>
{/snippet}

{#snippet dropdown()}
	<Label labelPosition="above" label={m.site_gallery_region()}>
		<DropdownSelect value="caribbean" hidePlaceholder>
			<DropdownSelectOption value="caribbean" text={m.site_gallery_caribbean()} />
			<DropdownSelectOption value="north-america" text={m.site_gallery_north_america()} />
			<DropdownSelectOption value="europe" text={m.site_gallery_europe()} />
		</DropdownSelect>
	</Label>
{/snippet}

{#snippet choices()}
	<div class="choice-stack">
		<Checkbox checked>{m.site_about_remember()}</Checkbox>
		<div class="site-actions">
			<RadioButton name="billing" value="monthly" bind:group={billing} label={m.site_gallery_monthly()} />
			<RadioButton name="billing" value="yearly" bind:group={billing} label={m.site_gallery_yearly()} />
		</div>
		<ToggleSwitch label={m.site_gallery_airplane()} />
	</div>
{/snippet}

{#snippet slider()}
	<div class="demo-slider"><Slider bind:value={level} aria-label={m.site_demo_sound()} /><output>{level}</output></div>
{/snippet}

{#snippet nav()}
	<div>
		<TopNav aria-label={m.site_navigation()} bind:selectedValue={selectedTab} appearance="subtle" class="gallery-tabs">
			{#each navItems as label, index (label)}
				<TopNavItem value={String(index)} id={'sample-tab-' + index} aria-controls={'sample-panel-' + index}>
					{label()}
				</TopNavItem>
			{/each}
		</TopNav>
		{#each navItems as label, index (label)}
			<div
				class="site-sr-only"
				role="tabpanel"
				id={'sample-panel-' + index}
				aria-labelledby={'sample-tab-' + index}
				hidden={selectedTab !== String(index)}
			>
				{label()}
			</div>
		{/each}
	</div>
{/snippet}

{#snippet list()}
	<div class="demo-list">
		<ListView selectionMode="single" bind:selectedItems={listSelection}>
			{#each inboxItems as label, index (label)}
				<ListViewItem value={String(index)}>
					{label()}{#if index < 2}<Badge shape="rounded">{index === 0 ? '12' : '3'}</Badge>{/if}
				</ListViewItem>
			{/each}
		</ListView>
	</div>
{/snippet}

{#snippet breadcrumbs()}
	<Breadcrumb aria-label={m.site_navigation()}>
		<BreadcrumbItem>
			<BreadcrumbButton as="a" href={localizedPath('/')}>{m.global_home()}</BreadcrumbButton>
		</BreadcrumbItem>
		<BreadcrumbDivider />
		<BreadcrumbItem>
			<BreadcrumbButton as="a" href={localizedPath('/docs')}>{m.global_docs()}</BreadcrumbButton>
		</BreadcrumbItem>
		<BreadcrumbDivider />
		<BreadcrumbItem><BreadcrumbButton current>{m.docs_nav_title()}</BreadcrumbButton></BreadcrumbItem>
	</Breadcrumb>
{/snippet}

{#snippet tagDemo()}
	<div class="site-actions">
		{#each tags as tag (tag)}
			<Tag
				dismissible
				shape="rounded"
				dismissLabel={m.site_close()}
				onDismiss={() => (tags = tags.filter((value) => value !== tag))}
			>
				{tag}
			</Tag>
		{/each}
	</div>
{/snippet}

{#snippet notice()}
	<div class="choice-stack">
		<InfoBar title={m.site_gallery_update_pending()} status="warning" style="multiline" hideCloseButton>
			{m.site_gallery_update_hint()}
		</InfoBar>
		<InfoBar title={m.site_gallery_sync_failed()} status="critical" style="multiline" hideCloseButton>
			{m.site_gallery_sync_hint()}
		</InfoBar>
	</div>
{/snippet}

{#snippet badges()}
	<div class="site-actions">
		<Badge shape="rounded" color="attention">{m.site_gallery_attention()}</Badge>
		<Badge shape="rounded" color="success" appearance="tint">{m.site_gallery_available()}</Badge>
		<Badge shape="rounded" color="warning" appearance="tint">{m.site_gallery_away()}</Badge>
		<Badge shape="rounded" color="critical" appearance="tint">{m.site_gallery_offline()}</Badge>
		<Badge shape="rounded" appearance="tint">{m.site_gallery_draft()}</Badge>
	</div>
{/snippet}

{#snippet progress()}
	<div class="demo-progress">
		<ProgressBar value={72} aria-label="ProgressBar" /><ProgressRing value={72} aria-label="ProgressRing" />
	</div>
{/snippet}

{#snippet people()}
	<div class="site-actions">
		<Persona
			name="María Fernández"
			primaryText={m.site_gallery_designer() + ' · ' + m.site_gallery_available()}
			presence={{ status: 'available' }}
		/>
		<Avatar name="Jorge Acosta" size={36} color="colorful" />
		<Avatar name="Ana Peña" size={36} color="colorful" />
	</div>
{/snippet}

<style>
	.gallery-section {
		background: var(--fs-solid-background-tertiary);
		border-block: 1px solid var(--fs-card-stroke-default);
	}
	:global(.gallery-tabs) {
		max-width: 100%;
		flex-wrap: wrap;
	}
	.gallery {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.95rem;
		margin-block-start: 1.2rem;

		&[hidden] {
			display: none;
		}
		& :global(.gallery-tile) {
			min-width: 0;
			overflow: visible;

			& :global(.fs-checkbox) {
				position: relative;
				inset: auto;
			}
		}
	}
	.demo-canvas {
		display: grid;
		place-items: center;
		min-height: 11.25rem;
		padding: 1.1rem;
		border-start-start-radius: var(--fs-control-overlay-border-radius);
		border-start-end-radius: var(--fs-control-overlay-border-radius);
		& .site-actions {
			justify-content: center;
		}
	}
	.demo-label {
		padding: 0.95rem 1.25rem;
		border-block-start: 1px solid var(--fs-card-stroke-default);
		font-size: 0.84rem;
		font-weight: 650;
		& :global(a) {
			color: var(--fs-text-primary);
		}
	}
	.choice-stack {
		display: grid;
		gap: 0.6rem;
		width: min(100%, 24rem);
	}
	.demo-slider,
	.demo-progress {
		display: flex;
		align-items: center;
		width: min(100%, 18rem);
		gap: 0.75rem;
	}
	.demo-list {
		width: min(100%, 16rem);
	}
	@media (max-width: 730px) {
		.gallery {
			grid-template-columns: minmax(0, 1fr);
		}
		.demo-canvas {
			min-height: 9rem;
		}
	}
</style>
