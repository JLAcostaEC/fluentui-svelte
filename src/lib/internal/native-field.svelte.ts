import { on } from 'svelte/events';
import type { AriaAttributes } from 'svelte/elements';
import { labelIds } from './utils.ts';

type Field = HTMLInputElement | HTMLSelectElement;

type PointerEventName =
	| 'click'
	| 'dblclick'
	| 'auxclick'
	| 'contextmenu'
	| `mouse${string}`
	| `pointer${string}`
	| `touch${string}`
	| `drag${string}`
	| 'drop'
	| 'wheel';

type KeyboardFocusEventName = `key${string}` | 'focus' | 'blur' | 'focusin' | 'focusout';

type Handlers<E extends string> = `on${E}` | `on${E}capture`;

/** The attributes of a field nobody sees: its look and its pointer events belong to what is drawn instead. */
export type HiddenInputAttributes<T> = Omit<T, 'class' | 'style' | Handlers<PointerEventName>>;

/**
 * The attributes of the native field a custom control stands in front of. People point at, type into
 * and focus the visible control, so `class`, `style` and those events go through its own attributes,
 * and `onfocus` and `onblur` are moved onto it.
 */
export type NativeFieldAttributes<T> = Omit<HiddenInputAttributes<T>, Handlers<KeyboardFocusEventName>> & {
	/** Called when the visible control takes the focus. */
	onfocus?: (event: FocusEvent) => void;
	/** Called when the visible control loses the focus. */
	onblur?: (event: FocusEvent) => void;
};

type FieldAria = Pick<
	AriaAttributes,
	'aria-labelledby' | 'aria-label' | 'aria-describedby' | 'aria-errormessage' | 'aria-required' | 'aria-invalid'
>;

/** The keys that open a picker from its button. */
const ACTIVATION_KEYS = ['Enter', ' ', 'ArrowDown', 'ArrowUp'];

/** The field the browser focuses and reports when a submission fails. */
const firstInvalid = (form: HTMLFormElement) =>
	Array.from(form.elements).find((element) => {
		const field = element as HTMLInputElement;
		return field.willValidate && !field.validity.valid;
	});

/**
 * The native field a custom control stands in front of, so that forms submit, validate and reset it.
 * Assistive technologies meet the visible control instead, so the field hides from them, except while
 * the browser reports it invalid: the field then holds the focus and the validation message, which
 * moving the focus would close, and it is announced. The first key pressed there goes on from the
 * visible control.
 */
export class NativeField {
	/** A submission found the field invalid, and it was neither fixed nor reset since. */
	invalid = $state(false);
	/** The browser is reporting the field: it has the focus and shows the validation message. */
	reported = $state(false);

	#field: () => Field | null | undefined;
	#label: { labelId: string } | null;

	/** `label` is the Label the field is inside, which names the visible control before its labels can be read. */
	constructor(
		field: () => Field | null | undefined,
		control: () => HTMLElement | null | undefined,
		label: { labelId: string } | null = null
	) {
		this.#field = field;
		this.#label = label;

		$effect(() => {
			const element = field();
			if (!element) return;

			const offs = [
				on(element, 'invalid', () => {
					this.invalid = true;

					if (element.form && firstInvalid(element.form) !== element) return;

					// The browser focuses the field right after this event, and the focus must not land
					// on something hidden from assistive technologies.
					element.removeAttribute('aria-hidden');
					this.reported = true;

					// `checkValidity` reports nothing, so a field it found invalid hides again.
					setTimeout(() => {
						if (document.activeElement !== element) this.reported = false;
					});
				}),
				on(element, 'change', () => {
					if (this.invalid) this.invalid = !element.validity.valid;
				}),
				on(element, 'blur', () => (this.reported = false)),
				on(element as HTMLElement, 'keydown', (event) => {
					if (event.key === 'Tab') return;

					event.preventDefault();
					const target = control();
					target?.focus();
					if (ACTIVATION_KEYS.includes(event.key)) target?.click();
				})
			];

			if (element.form) offs.push(on(element.form, 'reset', () => (this.invalid = false)));

			return () => offs.forEach((off) => off());
		});
	}

	/**
	 * The labels and ARIA of the field name and describe it.
	 */
	aria(
		attributes: FieldAria & { required?: boolean | null },
		own: FieldAria = {},
		role: 'button' | 'combobox' = 'combobox'
	): FieldAria {
		const naming: FieldAria = {
			'aria-labelledby':
				own['aria-labelledby'] ?? attributes['aria-labelledby'] ?? labelIds(this.#field()) ?? this.#label?.labelId,
			'aria-label': own['aria-label'] ?? attributes['aria-label'],
			'aria-describedby': own['aria-describedby'] ?? attributes['aria-describedby']
		};
		if (role === 'button') return naming;

		return {
			...naming,
			'aria-required': own['aria-required'] ?? (attributes.required ? true : undefined),
			'aria-invalid': own['aria-invalid'] ?? (this.invalid || attributes['aria-invalid'] || undefined),
			'aria-errormessage': own['aria-errormessage'] ?? attributes['aria-errormessage']
		};
	}
}
