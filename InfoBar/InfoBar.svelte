<script>import { createEventDispatcher } from "svelte";
import { get_current_component } from "svelte/internal";
import { createEventForwarder } from "../internal";
import InfoBadge from "../InfoBadge/InfoBadge.svelte";
/** Determines whether the bar is open (rendered). */
export let open = true;
/** Determines whether the close button is used or not. */
export let closable = true;
/** Indicates the severity color of the bar. */
export let severity = "information";
/** Title of the Infobar. */
export let title = "";
/** Description text shown next to or below the title. */
export let message = "";
/** Specifies a custom class name for the bar. */
let className = "";
export { className as class };
/** Obtains a bound DOM reference to the bar's container element. */
export let element = null;
/** Obtains a bound DOM reference to the bar's title element. */
export let titleElement = null;
/** Obtains a bound DOM reference to the bar's message (paragraph) element. */
export let messageElement = null;
/** Obtains a bound DOM reference to the bar's action wrapper element. */
export let actionElement = null;
/** Obtains a bound DOM reference to the bar's close button element. */
export let closeButtonElement = null;
let wrapped = false;
let clientHeight = 0;
const dispatch = createEventDispatcher();
const forwardEvents = createEventForwarder(get_current_component());
$: actionWrapped = clientHeight && (actionElement === null || actionElement === void 0 ? void 0 : actionElement.offsetTop) > 0;
$: messageWrapped = clientHeight && (messageElement === null || messageElement === void 0 ? void 0 : messageElement.offsetTop) > (titleElement === null || titleElement === void 0 ? void 0 : titleElement.offsetTop);
$: if (open) {
    dispatch("open");
}
else {
    dispatch("close");
}
</script>

<!--
@component
The InfoBar control is for displaying app-wide status messages to users that are highly visible yet non-intrusive. There are built-in security levels to easily indicate the type of message shown as well as the option to include your own call to action or hyperlink button. [Docs](https://fluent-svelte.vercel.app/docs/components/infobar)
- Usage:
    ```tsx
    <InfoBar title="Title" message="Message">
        <Button slot="action">Action</Button>
    </InfoBar>
    ```
-->
{#if open}
	<div
		use:forwardEvents
		bind:this={element}
		bind:clientHeight
		class="info-bar severity-{severity} {className}"
		role="alert"
		{...$$restProps}
	>
		<div class="info-bar-icon">
			<slot name="icon">
				<InfoBadge {severity} />
			</slot>
		</div>
		<div
			class="info-bar-content"
			class:wrapped
			class:action-visible={$$slots.action}
			class:action-wrapped={actionWrapped}
			class:message-wrapped={messageWrapped}
		>
			{#if title}
				<h5 bind:this={titleElement}>
					{title}
				</h5>
			{/if}
			{#if message || $$slots.default}
				<p bind:this={messageElement}>
					{message}
					<slot />
				</p>
			{/if}
			{#if $$slots.action}
				<div class="info-bar-action" bind:this={actionElement}>
					<slot name="action" />
				</div>
			{/if}
		</div>
		{#if closable}
			<button
				class="info-bar-close-button"
				type="button"
				aria-label="Close"
				on:click={() => (open = false)}
				bind:this={closeButtonElement}
			>
				<svg
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					width="12"
					height="12"
					viewBox="0 0 1024 1024"
				>
					<path
						fill="currentColor"
						d="M512,584.5L87.5,1009C77.5,1019 65.5,1024 51.5,1024C36.8333,1024 24.5833,1019.08 14.75,1009.25C4.91667,999.417 0,987.167 0,972.5C0,958.5 5,946.5 15,936.5L439.5,512L15,87.5C5,77.5 0,65.3334 0,51C0,44 1.33333,37.3334 4,31C6.66667,24.6667 10.3333,19.25 15,14.75C19.6667,10.25 25.1667,6.66669 31.5,4C37.8333,1.33337 44.5,0 51.5,0C65.5,0 77.5,5 87.5,15L512,439.5L936.5,15C946.5,5 958.667,0 973,0C980,0 986.583,1.33337 992.75,4C998.917,6.66669 1004.33,10.3334 1009,15C1013.67,19.6667 1017.33,25.0834 1020,31.25C1022.67,37.4167 1024,44 1024,51C1024,65.3334 1019,77.5 1009,87.5L584.5,512L1009,936.5C1019,946.5 1024,958.5 1024,972.5C1024,979.5 1022.67,986.167 1020,992.5C1017.33,998.833 1013.75,1004.33 1009.25,1009C1004.75,1013.67 999.333,1017.33 993,1020C986.667,1022.67 980,1024 973,1024C958.667,1024 946.5,1019 936.5,1009Z"
					/>
				</svg>
			</button>
		{/if}
	</div>
{/if}

<style>.info-bar{-webkit-padding-start:15px;align-items:center;background-clip:padding-box;border:1px solid var(--fds-card-stroke-default);border-radius:var(--fds-control-corner-radius);box-sizing:border-box;display:flex;font-family:var(--fds-font-family-text);min-block-size:48px;padding-inline-start:15px;position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.info-bar.severity-information{background-color:var(--fds-card-background-secondary)}.info-bar.severity-success{background-color:var(--fds-system-background-success)}.info-bar.severity-caution{background-color:var(--fds-system-background-caution)}.info-bar.severity-critical{background-color:var(--fds-system-background-critical)}.info-bar.severity-attention{background-color:var(--fds-system-background-attention)}.info-bar-icon{-webkit-margin-before:16px;align-self:flex-start;display:flex;flex:0 0 auto;margin-block-start:16px}.info-bar-content{-webkit-margin-start:13px;-webkit-margin-before:7px;-webkit-margin-after:7px;align-items:center;box-sizing:border-box;display:flex;flex:1 1 auto;flex-wrap:wrap;margin-block-end:7px;margin-block-start:7px;margin-inline-start:13px;position:relative}.info-bar-content.action-wrapped,.info-bar-content.message-wrapped{-webkit-margin-before:13px;-webkit-margin-after:15px;margin-block-end:15px;margin-block-start:13px}.info-bar-content.message-wrapped h5,.info-bar-content.message-wrapped p{align-self:flex-start}.info-bar-content.message-wrapped .info-bar-action{-webkit-margin-end:50%;margin-inline-end:50%}.info-bar-content.action-wrapped .info-bar-action{-webkit-padding-before:16px;padding-block-start:16px}.info-bar h5,.info-bar p{color:var(--fds-text-primary);font-size:var(--fds-body-font-size);font-weight:400;line-height:20px;margin:0}.info-bar h5{-webkit-margin-end:12px;font-weight:600;margin-inline-end:12px}.info-bar p{-webkit-margin-end:15px;flex:1 1 auto;margin-inline-end:15px}.info-bar-action{-webkit-margin-end:4px;margin-inline-end:4px}.info-bar-action,.info-bar-close-button{align-items:center;align-self:flex-start;display:flex}.info-bar-close-button{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:var(--fds-subtle-fill-transparent);block-size:38px;border:none;border-radius:var(--fds-control-corner-radius);color:var(--fds-text-primary);flex:0 0 auto;inline-size:38px;justify-content:center;margin:4px;outline:none;transition:var(--fds-control-fast-duration) var(--fds-control-fast-out-slow-in-easing)}.info-bar-close-button:focus-visible{box-shadow:var(--fds-focus-stroke)}.info-bar-close-button:hover{background-color:var(--fds-subtle-fill-secondary)}.info-bar-close-button:active{background-color:var(--fds-subtle-fill-tertiary);color:var(--fds-text-secondary)}.info-bar-close-button svg{fill:currentColor;block-size:12px;inline-size:12px}</style>
