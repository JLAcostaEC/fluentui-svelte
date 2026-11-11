<script lang="ts">
	import { untrack } from 'svelte';
	import { on } from 'svelte/events';
	import { ColorPreview, hueyColor, useHueyContext } from '@hueycolor/svelte';
	import ChevronDownFilled from 'fluentui-icons-svelte/ChevronDownFilled.svelte';
	import ChevronUpFilled from 'fluentui-icons-svelte/ChevronUpFilled.svelte';

	import { dispatchFieldEvents, NativeField } from '#internal';
	import Button from '../button/button.svelte';
	import TextBox from '../text-box/text-box.svelte';
	import NumberBox from '../number-box/number-box.svelte';
	import DropdownSelect from '../dropdown-select/dropdown-select.svelte';
	import Slider from '../slider/slider.svelte';

	import { clamp, colorString, parseColor } from './color.ts';
	import type { ColorPickerColor, ColorPickerControlProps } from './types.ts';

	let {
		value = $bindable('#ffffff'),
		defaultValue = '#ffffff',
		shape = 'rounded',
		orientation = 'vertical',
		collapsed = $bindable(false),
		format = $bindable('rgb'),
		alpha = false,
		disabled,
		readonly,
		label = 'Color picker',
		formatLabel = 'Color format',
		moreLabel = 'More',
		lessLabel = 'Less',
		validationMessage = 'Enter a valid color.',
		channelLabels,
		labelId,
		ref = $bindable(null),
		wrapperRef = $bindable(null),
		wrapperAttributes,
		onColorChange,
		onfocus,
		onblur,
		id,
		name,
		...attributes
	}: ColorPickerControlProps = $props();

	const ctx = useHueyContext();
	let hueRef = $state<HTMLInputElement | null>(null);

	// Keep hue and saturation when editing black or gray; converting those colors back would lose them.
	let draft = $state<{ value: string; color: ColorPickerColor } | null>(null);

	const parsed = $derived(parseColor(value));
	const hsv = $derived(value === draft?.value ? draft.color : (parsed ?? { h: 0, s: 0, v: 100, a: 1 }));
	const hex = $derived(parsed ? colorString(hsv, alpha) : value);
	const hexPattern = $derived(
		alpha ? '#?(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})' : '#?(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})'
	);

	const native = new NativeField(
		() => ref,
		() => hueRef,
		untrack(() => (labelId ? { labelId } : null))
	);

	const labels = $derived({
		hue: 'Hue',
		saturation: 'Saturation',
		brightness: 'Brightness',
		opacity: 'Opacity',
		red: 'Red',
		green: 'Green',
		blue: 'Blue',
		hex: 'Hex',
		...channelLabels
	});

	const rgb = $derived(hueyColor(colorString(hsv, true)).toRgb());
	const channels = $derived(
		format === 'rgb' ? (['red', 'green', 'blue'] as const) : (['hue', 'saturation', 'brightness'] as const)
	);
	const rgbKeys = { red: 'r', green: 'g', blue: 'b' } as const;

	const blocked = () => !!(disabled || readonly || ref?.matches(':disabled'));

	const x = $derived(shape !== 'circular' ? hsv.h / 3.6 : 50 - (Math.cos((hsv.h * Math.PI) / 180) * hsv.s) / 2);
	const y = $derived(shape !== 'circular' ? 100 - hsv.s : 50 - (Math.sin((hsv.h * Math.PI) / 180) * hsv.s) / 2);
	const spectrumValue = $derived(`${labels.hue} ${Math.round(hsv.h)}°, ${labels.saturation} ${Math.round(hsv.s)}%`);

	// External updates must reach Huey's preview and the native field's validation state.
	$effect(() => {
		ctx.setColor(parsed ? value : '#ffffff');
		ref?.setCustomValidity(value && !parsed ? validationMessage : '');
		if (ref && untrack(() => native.invalid) && ref.validity.valid) native.invalid = false;
	});

	$effect(() => {
		const form = ref?.form;

		// Reset the retained HSV coordinates along with the submitted color.
		if (form) return on(form, 'reset', () => (draft = null));
	});

	/** Commit one edit to the binding, form field and callbacks. */
	function edit(next: ColorPickerColor) {
		if (blocked()) return;

		value = colorString(next, alpha);
		draft = { value, color: next };

		if (ref) {
			ref.value = value;
			ref.setCustomValidity('');
		}

		dispatchFieldEvents(ref);
		onColorChange?.(value);
	}

	function channelValue(channel: (typeof channels)[number] | 'opacity'): number {
		if (channel === 'opacity') return hsv.a * 100;
		if (channel === 'hue') return hsv.h;
		if (channel === 'saturation') return hsv.s;
		if (channel === 'brightness') return hsv.v;

		return rgb[rgbKeys[channel]];
	}

	/** Clamp the displayed field too, while allowing an empty value during typing. */
	function channelEdit(channel: (typeof channels)[number] | 'opacity', input: HTMLInputElement, commit = false) {
		if (blocked()) return;

		if (!Number.isFinite(input.valueAsNumber)) {
			if (commit || input.validity.badInput) input.value = String(Math.round(channelValue(channel)));

			return;
		}

		const amount = clamp(Math.round(input.valueAsNumber), Number(input.max));
		input.value = String(amount);

		if (amount === Math.round(channelValue(channel))) return;

		if (channel === 'opacity') {
			edit({ ...hsv, a: amount / 100 });
		} else if (channel === 'hue') {
			edit({ ...hsv, h: amount });
		} else if (channel === 'saturation') {
			edit({ ...hsv, s: amount });
		} else if (channel === 'brightness') {
			edit({ ...hsv, v: amount });
		} else {
			const next = { ...rgb, [rgbKeys[channel]]: amount };
			const parsed = parseColor(`rgba(${next.r},${next.g},${next.b},${hsv.a})`);

			if (parsed) edit(parsed);
		}
	}

	/** Partial hex stays local until commit; invalid edits restore the selected color. */
	function hexEdit(input: HTMLInputElement) {
		if (blocked()) return;

		const text = input.value;
		const color = text.startsWith('#') ? text : `#${text}`;

		if (text && input.validity.valid && color.toLowerCase() !== hex.toLowerCase()) {
			const next = parseColor(color);

			if (next) edit(next);
		}

		input.value = hex;
	}

	function point(event: PointerEvent) {
		if (blocked()) return;
		if (event.type === 'pointerdown' && event.button !== 0) return;

		const node = event.currentTarget as HTMLDivElement;

		if (event.type !== 'pointerdown' && !node.hasPointerCapture(event.pointerId)) return;

		if (event.type === 'pointerdown') {
			node.setPointerCapture(event.pointerId);
			hueRef?.focus();
		}

		const box = node.getBoundingClientRect();
		const dx = (event.clientX - box.left) / box.width;
		const dy = (event.clientY - box.top) / box.height;

		selectPoint(dx, dy);
	}

	/** Shared coordinate conversion keeps pointer and keyboard selection consistent. */
	function selectPoint(dx: number, dy: number) {
		const h =
			shape !== 'circular' ? clamp(dx * 360, 360) : ((Math.atan2(dy - 0.5, dx - 0.5) * 180) / Math.PI + 180) % 360;
		const s = shape !== 'circular' ? clamp((1 - dy) * 100) : clamp(Math.hypot(dx - 0.5, dy - 0.5) * 200);

		edit({ ...hsv, h, s });
	}

	function spectrumKey(event: KeyboardEvent) {
		if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;

		event.preventDefault();

		if (blocked()) return;

		const horizontal = event.key === 'ArrowLeft' || event.key === 'ArrowRight';
		const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;

		if (shape !== 'circular') {
			edit(horizontal ? { ...hsv, h: clamp(hsv.h + direction, 360) } : { ...hsv, s: clamp(hsv.s - direction) });
		} else {
			selectPoint((x + (horizontal ? direction : 0)) / 100, (y + (horizontal ? 0 : direction)) / 100);
		}
	}
</script>

<div
	{...wrapperAttributes}
	bind:this={wrapperRef}
	role="group"
	tabindex="-1"
	aria-label={attributes['aria-label'] ?? label}
	aria-labelledby={attributes['aria-labelledby'] ?? labelId}
	aria-describedby={attributes['aria-describedby']}
	onfocusin={(event) => {
		if (!wrapperRef?.contains(event.relatedTarget as Node | null)) onfocus?.(event);
		wrapperAttributes?.onfocusin?.(event);
	}}
	onfocusout={(event) => {
		if (!wrapperRef?.contains(event.relatedTarget as Node | null)) onblur?.(event);
		wrapperAttributes?.onfocusout?.(event);
	}}
	class={[
		'fs-color-picker',
		orientation,
		{ invalid: native.invalid || attributes['aria-invalid'] === 'true' },
		wrapperAttributes?.class
	]}
>
	<div class="visual">
		<div class="spectrum-row">
			<!-- Pointer coordinates draw the spectrum; native ranges provide keyboard and screen-reader interaction. -->
			<div class={['spectrum', shape]} role="group" aria-label={label} onpointerdown={point} onpointermove={point}>
				<div class="shade" style:opacity={1 - hsv.v / 100}></div>
				<span class="marker" style:left={`${x}%`} style:top={`${y}%`}></span>

				<input
					class="spectrum-input"
					form=""
					type="range"
					min="0"
					max="360"
					step="1"
					aria-label={labels.hue}
					aria-valuetext={spectrumValue}
					aria-describedby={attributes['aria-describedby']}
					aria-invalid={native.invalid || attributes['aria-invalid'] || undefined}
					aria-errormessage={attributes['aria-errormessage']}
					value={hsv.h}
					disabled={!!(disabled || readonly)}
					bind:this={hueRef}
					onkeydown={spectrumKey}
					oninput={(e) => edit({ ...hsv, h: +e.currentTarget.value })}
				/>

				<input
					class="spectrum-input"
					form=""
					type="range"
					min="0"
					max="100"
					step="1"
					aria-label={labels.saturation}
					aria-valuetext={spectrumValue}
					value={hsv.s}
					disabled={!!(disabled || readonly)}
					onkeydown={spectrumKey}
					oninput={(e) => edit({ ...hsv, s: +e.currentTarget.value })}
				/>
			</div>

			<div class={['preview', shape]} aria-hidden="true">
				<ColorPreview splitPreview />
			</div>
		</div>
	</div>

	<div class={['rails', shape]}>
		<div class="brightness">
			<Slider
				form=""
				aria-label={labels.brightness}
				suffix="%"
				min={0}
				max={100}
				bind:value={() => hsv.v, (v) => edit({ ...hsv, v })}
				disabled={!!(disabled || readonly)}
				orientation={orientation === 'horizontal' ? 'vertical' : 'horizontal'}
				tooltip={false}
				track={false}
			/>
		</div>

		{#if alpha}
			<div class="opacity" style={`--opaque: ${colorString({ ...hsv, a: 1 }, false)};`}>
				<Slider
					form=""
					aria-label={labels.opacity}
					suffix="%"
					min={0}
					max={100}
					bind:value={() => hsv.a * 100, (a) => edit({ ...hsv, a: a / 100 })}
					disabled={!!(disabled || readonly)}
					orientation={orientation === 'horizontal' ? 'vertical' : 'horizontal'}
					tooltip={false}
					track={false}
				/>
			</div>
		{/if}
	</div>

	<div class="fields" id={`${id}-fields`} hidden={collapsed}>
		<div class="format">
			<DropdownSelect
				form=""
				name={null}
				aria-label={formatLabel}
				bind:value={format}
				disabled={!!(disabled || readonly)}
			>
				<option value="rgb">RGB</option>
				<option value="hsv">HSV</option>
			</DropdownSelect>

			<TextBox
				form=""
				name={null}
				aria-label={labels.hex}
				value={hex}
				maxlength={alpha ? 9 : 7}
				pattern={hexPattern}
				spellcheck={false}
				autocomplete="off"
				{disabled}
				{readonly}
				hideActionButtons
				onchange={(e) => hexEdit(e.currentTarget)}
				onblur={(e) => hexEdit(e.currentTarget)}
			/>
		</div>

		{#each channels as channel (channel)}
			<label class="channel">
				<NumberBox
					form=""
					name={null}
					aria-label={labels[channel]}
					hideActionButtons
					value={Math.round(channelValue(channel))}
					min={0}
					max={channel === 'hue' ? 360 : format === 'rgb' ? 255 : 100}
					step={1}
					{disabled}
					{readonly}
					oninput={(e) => channelEdit(channel, e.currentTarget)}
					onchange={(e) => channelEdit(channel, e.currentTarget, true)}
					onblur={(e) => channelEdit(channel, e.currentTarget, true)}
				/>

				<span>{labels[channel]}</span>
			</label>
		{/each}

		{#if alpha}
			<label class="channel">
				<NumberBox
					form=""
					name={null}
					aria-label={labels.opacity}
					hideActionButtons
					value={Math.round(hsv.a * 100)}
					min={0}
					max={100}
					{disabled}
					{readonly}
					oninput={(e) => channelEdit('opacity', e.currentTarget)}
					onchange={(e) => channelEdit('opacity', e.currentTarget, true)}
					onblur={(e) => channelEdit('opacity', e.currentTarget, true)}
				/>

				<span>{labels.opacity}</span>
			</label>
		{/if}
	</div>

	<Button
		type="button"
		appearance="subtle"
		class="expand"
		isMenuButton
		indicatorIcon={collapsed ? ChevronDownFilled : ChevronUpFilled}
		disabled={!!(disabled || readonly)}
		aria-expanded={!collapsed}
		aria-controls={`${id}-fields`}
		onclick={() => (collapsed = !collapsed)}
	>
		<span>{collapsed ? moreLabel : lessLabel}</span>
	</Button>

	<!-- Only this field participates in form submission, validation and reset. -->
	<input
		{...attributes}
		{id}
		{name}
		type="text"
		{defaultValue}
		{disabled}
		{readonly}
		bind:value
		bind:this={ref}
		class="native-field"
		tabindex={-1}
		aria-label={attributes['aria-label'] ?? label}
		aria-labelledby={attributes['aria-labelledby'] ?? labelId}
		aria-hidden={native.reported ? undefined : 'true'}
		onfocus={() => {
			if (!native.reported) (readonly ? wrapperRef : hueRef)?.focus();
		}}
	/>
</div>

<style>
	.fs-color-picker {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 0.5rem;
		width: 18.5rem;
		max-width: 100%;
		font-size: var(--fs-body2-font-size);
		line-height: var(--fs-body2-line-height);
		font-family: var(--fs-font-family-base);
		color: var(--fs-text-primary);
	}

	.spectrum-row {
		display: flex;
		gap: 0.5rem;
	}

	.spectrum {
		position: relative;
		flex: 1;
		min-width: 0;
		aspect-ratio: 1;
		overflow: hidden;
		box-shadow: inset 0 0 0 1px var(--fs-control-stroke-default);
		border-radius: var(--fs-control-border-radius);
		touch-action: none;
		background:
			linear-gradient(to top, white, transparent), linear-gradient(to right, red, #ff0, lime, cyan, blue, magenta, red);
	}

	.spectrum.square,
	.preview.square {
		border-radius: 0;
	}

	.spectrum.circular {
		border-radius: 50%;
		background:
			radial-gradient(circle closest-side, white, transparent),
			conic-gradient(from 270deg, red, #ff0, lime, cyan, blue, magenta, red);
	}

	.shade {
		position: absolute;
		inset: 0;
		background: black;
		border-radius: inherit;
		pointer-events: none;
	}

	.marker {
		position: absolute;
		width: 0.75rem;
		height: 0.75rem;
		border: 2px solid white;
		box-shadow: 0 0 0 1px black;
		border-radius: 50%;
		transform: translate(-50%, -50%);
		pointer-events: none;
	}

	.spectrum:has(:focus-visible),
	.fs-color-picker:has(.native-field:focus-visible) .spectrum {
		outline: 2px solid var(--fs-focus-stroke-outer);
		outline-offset: 2px;
	}

	.fs-color-picker:has(.native-field:disabled) .spectrum {
		cursor: not-allowed;
	}

	.fs-color-picker:has(.native-field:disabled) .spectrum::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background: var(--fs-control-fill-disabled);
		pointer-events: none;
	}

	.spectrum-input {
		position: absolute;
		width: 1px;
		height: 1px;
		clip-path: inset(50%);
		overflow: hidden;
	}

	.preview {
		position: relative;
		width: 2rem;
		flex-shrink: 0;
		align-self: stretch;
		overflow: hidden;
		border: 1px solid var(--fs-control-stroke-default);
		border-radius: var(--fs-control-border-radius);
	}

	.preview.circular {
		border-radius: 999px;
	}

	.preview :global([huey-preview]) {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border-radius: inherit;
	}

	.rails {
		--color-picker-slider-radius: var(--fs-control-border-radius);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.rails.square {
		--color-picker-slider-radius: 0px;
	}

	.rails.circular {
		--color-picker-slider-radius: 999px;
	}

	.rails :global(.slider-rail),
	.rails :global(.slider-thumb),
	.rails :global(.slider-thumb::before) {
		border-radius: var(--color-picker-slider-radius);
	}

	.rails > div {
		height: 1.25rem;
		display: flex;
		align-items: center;
	}

	.rails :global(.fs-slider) {
		width: 100%;
	}

	.rails :global(.slider-rail) {
		background: linear-gradient(to right, black, white);
	}

	.rails :global(.fs-slider.orientation-horizontal .slider-rail) {
		block-size: 0.75rem;
	}

	.rails :global(.fs-slider.orientation-vertical .slider-rail) {
		inline-size: 0.75rem;
		block-size: 100%;
	}

	.opacity :global(.slider-rail) {
		background:
			linear-gradient(to right, transparent, var(--opaque)),
			repeating-conic-gradient(var(--fs-control-stroke-default) 0% 25%, transparent 0% 50%) 0/8px 8px;
	}

	.rails :global(.slider-thumb::before) {
		background: var(--fs-text-primary);
	}

	.fields {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.fields[hidden] {
		display: none;
	}

	.format {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-bottom: 0.25rem;
	}

	.format :global(.fs-dropdown) {
		min-width: 0;
	}

	.channel {
		display: grid;
		grid-template-columns: 6rem 1fr;
		align-items: center;
		gap: 0.75rem;
		color: var(--fs-text-secondary);
	}

	.fs-color-picker .fields :global(.fs-textbox input),
	.fs-color-picker .fields :global(select) {
		font-family: var(--fs-font-family-base);
		font-size: var(--fs-body2-font-size);
		line-height: var(--fs-body2-line-height);
		width: 100%;
		height: 2rem;
		box-sizing: border-box;
	}

	.fs-color-picker :global(.expand) {
		justify-self: end;
		font-size: var(--fs-body2-font-size);
	}

	.native-field {
		position: absolute;
		inset: 0;
		width: 1px;
		height: 1px;
		opacity: 0;
		pointer-events: none;
	}

	.invalid {
		color: var(--fs-system-critical);
	}

	.invalid .channel,
	.invalid :global(.expand) {
		color: var(--fs-system-critical);
	}

	.invalid .spectrum {
		box-shadow: 0 0 0 1px var(--fs-system-critical);
	}

	.fs-color-picker .fields :global(.fs-textbox input:disabled),
	.fs-color-picker .fields :global(select:disabled),
	.fs-color-picker .fields :global(.fs-dropdown:has(select:disabled) .indicator),
	.fs-color-picker:has(> .native-field:disabled) .channel {
		color: var(--fs-text-disabled);
		cursor: not-allowed;
	}

	.fields :global(.fs-dropdown:has(select:disabled)) {
		background: var(--fs-control-fill-disabled);
	}

	.fields :global(.fs-dropdown:has(select:disabled)::before) {
		background: var(--fs-control-stroke-default);
	}

	.rails :global(.fs-slider:has(input:disabled) .slider-rail) {
		background: var(--fs-control-strong-stroke-disabled);
	}

	.rails :global(.fs-slider:has(input:disabled) .slider-thumb::before) {
		background: var(--fs-control-strong-stroke-disabled);
	}

	.fs-color-picker:has(> .native-field:disabled) .preview::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background: var(--fs-control-fill-disabled);
	}

	.horizontal {
		width: 40rem;
		grid-template-columns: minmax(10rem, 1fr) 3rem minmax(12rem, 1fr);
		align-items: start;
	}

	.horizontal .rails {
		flex-direction: row;
		height: 100%;
		min-height: 12rem;
	}

	.horizontal .rails > div {
		height: 100%;
		width: 1.25rem;
	}

	.horizontal .rails :global(.fs-slider) {
		height: 100%;
	}

	.horizontal .rails :global(.slider-rail) {
		background: linear-gradient(to top, black, white);
	}

	.horizontal .opacity :global(.slider-rail) {
		background:
			linear-gradient(to top, transparent, var(--opaque)),
			repeating-conic-gradient(var(--fs-control-stroke-default) 0% 25%, transparent 0% 50%) 0/8px 8px;
	}

	.horizontal :global(.expand) {
		grid-column: 3;
	}

	@media (max-width: 600px) {
		.horizontal {
			grid-template-columns: minmax(0, 1fr) 3rem;
			gap: 0.5rem;
		}

		.horizontal .fields,
		.horizontal :global(.expand) {
			grid-column: 1 / -1;
		}

		.horizontal .rails {
			min-height: 0;
		}
	}

	@media (forced-colors: active) {
		.spectrum,
		.marker {
			border: 1px solid CanvasText;
		}
	}
</style>
