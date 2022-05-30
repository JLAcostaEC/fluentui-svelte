<script>export let selected = false;
export let disabled = false;
export let blackout = false;
export let current = false;
export let outOfRange = false;
export let variant = "day";
export let header = "";
</script>

<button
	on:click
	on:keydown
	type="button"
	class="calendar-view-item type-{variant === 'day' ? 'day' : 'month-year'}"
	class:selected
	class:current
	class:blackout
	class:disabled
	class:out-of-range={outOfRange}
	disabled={disabled || blackout}
	aria-selected={selected}
	{...$$restProps}
>
	{#if header}
		<small>{header}</small>
	{/if}
	<slot />
</button>

<style>.calendar-view-item{align-items:center;background-color:var(--fds-subtle-fill-transparent);border:1px solid transparent;border-radius:50%;box-sizing:border-box;color:var(--fds-text-primary);display:inline-flex;font-family:var(--fds-font-family-text);font-size:14px;font-weight:400;justify-content:center;line-height:20px;outline:none;padding:0;position:relative;text-align:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.calendar-view-item:focus-visible{box-shadow:var(--fds-focus-stroke)}.calendar-view-item:hover{background-color:var(--fds-subtle-fill-secondary)}.calendar-view-item:active{background-color:var(--fds-subtle-fill-tertiary)}.calendar-view-item.out-of-range,.calendar-view-item:active{color:var(--fds-text-secondary)}.calendar-view-item.out-of-range:active{color:var(--fds-text-tertiary)}.calendar-view-item.disabled{background-color:var(--fds-subtle-fill-disabled);color:var(--fds-text-disabled)}.calendar-view-item.disabled.blackout:after{content:none}.calendar-view-item.blackout{pointer-events:none}.calendar-view-item.blackout:after{-webkit-border-before:1px solid var(--fds-control-strong-stroke-default);block-size:1px;border-block-start:1px solid var(--fds-control-strong-stroke-default);content:"";inline-size:26px;position:absolute;transform:matrix(-.71,-.71,-.71,.71,0,0);transform-origin:center}.calendar-view-item.type-day{block-size:40px;inline-size:40px}.calendar-view-item.type-day small{inset-block-start:2px}.calendar-view-item.type-month-year{block-size:56px;inline-size:56px}.calendar-view-item.type-month-year small{inset-block-start:9.58px}.calendar-view-item.selected{border:1px solid var(--fds-accent-default);color:var(--fds-accent-text-primary)}.calendar-view-item.selected:hover{background-color:var(--fds-subtle-fill-secondary);border-color:var(--fds-accent-secondary)}.calendar-view-item.selected:active{background-color:var(--fds-subtle-fill-tertiary);border-color:var(--fds-accent-tertiary)}.calendar-view-item.selected.disabled{background-color:var(--fds-subtle-fill-disabled);border-color:var(--fds-accent-disabled);color:var(--fds-accent-text-disabled)}.calendar-view-item.selected.current{box-shadow:inset 0 0 0 1px var(--fds-text-on-accent-primary)}.calendar-view-item.selected.current:focus-visible{box-shadow:inset 0 0 0 1px var(--fds-text-on-accent-primary),var(--fds-focus-stroke)}.calendar-view-item.selected.blackout:after{border-block-start-color:var(--fds-accent-tertiary)}.calendar-view-item.current{background-color:var(--fds-accent-default);color:var(--fds-text-on-accent-primary)}.calendar-view-item.current:hover{background-color:var(--fds-accent-secondary)}.calendar-view-item.current:active{background-color:var(--fds-accent-tertiary);color:var(--fds-text-on-accent-secondary)}.calendar-view-item.current.disabled{background-color:var(--fds-accent-disabled)}.calendar-view-item.current.blackout:after{border-block-start-color:var(--fds-text-on-accent-primary)}.calendar-view-item small{color:inherit;font-family:var(--fds-font-family-small);font-size:8px;font-weight:400;inline-size:100%;letter-spacing:.04em;line-height:12px;padding-inline:1px;pointer-events:none;position:absolute;text-align:center}</style>
