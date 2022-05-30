<script>import { get_current_component } from "svelte/internal";
import { createEventForwarder } from "../internal";
/** Controls whether the checkbox is checked or not. */
export let checked = false;
/** Controls whether the checkbox is in an indeterminate state. */
export let indeterminate = false;
/** Sets the input element's native `value` attribute for usage in forms. */
export let value = undefined;
/** Controls whether the checkbox is intended for user interaction, and styles it accordingly. */
export let disabled = false;
/** Specifies a custom class name for the checkbox. */
let className = "";
export { className as class };
/** Obtains a bound DOM reference to the checkbox's <input /> element. */
export let inputElement = null;
/** Obtains a bound DOM reference to the checkbox's outer container element. */
export let containerElement = null;
const forwardEvents = createEventForwarder(get_current_component());
</script>

<!--
@component
Checkboxes represent a control that a user can select (check) or clear (uncheck). A Checkbox can also report its value as indeterminate. [Docs](https://fluent-svelte.vercel.app/docs/components/checkbox)
- Usage:
    ```tsx
    <Checkbox bind:checked />
    ```
-->
<!-- svelte-ignore a11y-label-has-associated-control -->
<!-- https://github.com/sveltejs/svelte/pull/5323 -->
<label class="checkbox-container" class:disabled class:indeterminate bind:this={containerElement}>
	<div class="checkbox-inner">
		<input
			use:forwardEvents
			bind:checked
			bind:indeterminate
			bind:this={inputElement}
			type="checkbox"
			class="checkbox {className}"
			{value}
			{disabled}
			{...$$restProps}
		/>
		<svg
			aria-hidden="true"
			class="checkbox-glyph"
			viewBox={indeterminate ? "171 470 683 85" : "0 0 24 24"}
		>
			{#if indeterminate}
				<path
					class="path-indeterminate"
					d="M213.5,554.5C207.5,554.5 201.917,553.417 196.75,551.25C191.583,549.083 187.083,546.083 183.25,542.25C179.417,538.417 176.333,533.917 174,528.75C171.667,523.583 170.5,518 170.5,512C170.5,506 171.667,500.417 174,495.25C176.333,490.083 179.417,485.583 183.25,481.75C187.083,477.917 191.583,474.917 196.75,472.75C201.917,470.583 207.5,469.5 213.5,469.5L810.5,469.5C816.5,469.5 822.083,470.583 827.25,472.75C832.417,474.917 836.917,477.917 840.75,481.75C844.583,485.583 847.667,490.083 850,495.25C852.333,500.417 853.5,506 853.5,512C853.5,518 852.333,523.583 850,528.75C847.667,533.917 844.583,538.417 840.75,542.25C836.917,546.083 832.417,549.083 827.25,551.25C822.083,553.417 816.5,554.5 810.5,554.5Z"
				/>
			{:else}
				<path
					class="path-checkmark"
					d="M 4.5303 12.9697 L 8.5 16.9393 L 18.9697 6.4697"
					fill="none"
				/>
			{/if}
		</svg>
	</div>
	{#if $$slots.default}
		<span>
			<slot />
		</span>
	{/if}
</label>

<style>.checkbox{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-clip:padding-box;background-color:var(--fds-control-alt-fill-secondary);block-size:20px;border:1px solid var(--fds-control-strong-stroke-default);border-radius:var(--fds-control-corner-radius);font-family:var(--fds-font-family-text);font-size:var(--fds-body-font-size);font-weight:400;inline-size:20px;line-height:20px;margin:0;outline:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.checkbox:focus-visible{box-shadow:var(--fds-focus-stroke)}.checkbox:hover{background-color:var(--fds-control-alt-fill-tertiary)}.checkbox:active{background-color:var(--fds-control-alt-fill-quarternary);border-color:var(--fds-control-strong-stroke-disabled)}.checkbox:active+.checkbox-glyph{color:var(--fds-text-on-accent-secondary)}.checkbox:disabled{background-color:var(--fds-control-alt-fill-disabled);border-color:var(--fds-control-strong-stroke-disabled);pointer-events:none}.checkbox:checked,.checkbox:indeterminate{background-color:var(--fds-accent-default);border:none}.checkbox:checked:hover,.checkbox:indeterminate:hover{background-color:var(--fds-accent-secondary)}.checkbox:checked:active,.checkbox:indeterminate:active{background-color:var(--fds-accent-tertiary)}.checkbox:checked:disabled,.checkbox:indeterminate:disabled{background-color:var(--fds-accent-disabled);border-color:var(--fds-control-strong-stroke-disabled)}.checkbox:checked:disabled+.checkbox-glyph,.checkbox:indeterminate:disabled+.checkbox-glyph{color:var(--fds-text-on-accent-disabled)}.checkbox:checked+.checkbox-glyph .path-checkmark,.checkbox:indeterminate+.checkbox-glyph .path-checkmark{stroke-dashoffset:0;transition:var(--fds-control-normal-duration) cubic-bezier(.55,0,0,1) stroke-dashoffset}.checkbox-container{align-items:center;color:var(--fds-text-primary);display:inline-flex;font-family:var(--fds-font-family-text);font-size:var(--fds-body-font-size);font-weight:400;line-height:20px;min-block-size:32px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.checkbox-container>span{-webkit-padding-start:8px;padding-inline-start:8px}.checkbox-container.disabled>span{color:var(--fds-text-disabled)}.checkbox-inner{align-items:center;display:flex;justify-content:center;position:relative}.checkbox-glyph{block-size:12px;color:inherit;color:var(--fds-text-on-accent-primary);inline-size:12px;position:absolute}.checkbox-glyph path{transform-origin:center}.checkbox-glyph .path-checkmark{stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:20.5;stroke-dashoffset:20.5;transform:scale(1.2)}.checkbox-glyph .path-indeterminate{fill:currentColor;transform:scale(.6666666667) translateX(80px) translateY(240px)}</style>
