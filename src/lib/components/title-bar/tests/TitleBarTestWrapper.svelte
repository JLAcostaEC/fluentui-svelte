<script lang="ts">
	import {
		Button,
		Menu,
		MenuItem,
		MenuList,
		MenuPopover,
		MenuTrigger,
		TitleBar,
		TitleBarLeftControls,
		TitleBarRightControls
	} from '$lib/index.js';
	import type { TitleBarLeftControlsProps, TitleBarProps, TitleBarRightControlsProps } from '$lib/index.js';
	import { SettingsRegular } from 'fluentui-icons-svelte';

	let {
		searchCollapsed = $bindable(false),
		withSearch = false,
		withSnippets = false,
		withMenu = false,
		left,
		right,
		...props
	}: {
		withSearch?: boolean;
		/** Provides the `globalNav`, `releaseTag`, children and `customMenu` snippets. */
		withSnippets?: boolean;
		/** Provides a `customMenu` with a `Menu` that opens from an icon button. */
		withMenu?: boolean;
		/** Renders a `TitleBarLeftControls` with these props. */
		left?: TitleBarLeftControlsProps;
		/** Renders a `TitleBarRightControls` with these props. */
		right?: TitleBarRightControlsProps;
	} & TitleBarProps = $props();
</script>

{#snippet searchContent()}
	<input type="search" aria-label="Find" />
{/snippet}

{#snippet navSnippet()}
	<button type="button">Custom nav</button>
{/snippet}

{#snippet tagSnippet()}
	<em>Nightly</em>
{/snippet}

{#snippet subtitle()}
	<span>Subtitle</span>
{/snippet}

{#snippet menuSnippet()}
	<button type="button">Settings</button>
{/snippet}

{#snippet realMenuSnippet()}
	<Menu>
		<MenuTrigger>
			{#snippet children({ state, menuTriggerProps })}
				<Button bind:ref={state.ref} {...menuTriggerProps as any} appearance="subtle" aria-label="Preferences menu">
					<SettingsRegular aria-hidden="true" />
				</Button>
			{/snippet}
		</MenuTrigger>
		<MenuPopover>
			<MenuList>
				<MenuItem>Keyboard shortcuts</MenuItem>
			</MenuList>
		</MenuPopover>
	</Menu>
{/snippet}

{#snippet leftSnippet()}
	<TitleBarLeftControls
		globalNav={withSnippets ? navSnippet : undefined}
		releaseTag={withSnippets ? tagSnippet : undefined}
		children={withSnippets ? subtitle : undefined}
		{...left}
	/>
{/snippet}

{#snippet rightSnippet()}
	<TitleBarRightControls customMenu={withMenu ? realMenuSnippet : withSnippets ? menuSnippet : undefined} {...right} />
{/snippet}

<TitleBar
	bind:searchCollapsed
	search={withSearch ? searchContent : undefined}
	leftControls={left ? leftSnippet : undefined}
	rightControls={right ? rightSnippet : undefined}
	aria-label="App"
	{...props}
/>
