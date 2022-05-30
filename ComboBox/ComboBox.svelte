<script>import { createEventDispatcher, tick } from "svelte";
import { get_current_component, onMount } from "svelte/internal";
import { createEventForwarder, externalMouseEvents, uid } from "../internal";
import ComboBoxItem from "./ComboBoxItem.svelte";
import Button from "../Button/Button.svelte";
import TextBox from "../TextBox/TextBoxButton.svelte";
import TextBoxButton from "../TextBox/TextBoxButton.svelte";
/** Determines which specified item is selected. Correspond's to a given item's `value` key. */
export let value = undefined;
/** Current value of the ComboBox's search box. Only applicable if `searchable` is set to `true`. */
export let searchValue = undefined;
/** The initial placeholder text displayed if no item is currently selected. */
export let placeholder = "";
/** Array of objects representing the dropdown items. */
export let items = [];
/** Determines if the ComboBox can be searched. */
export let editable = false;
/** Specifies whether the combobox is disabled. */
export let disabled = false;
/** The current visibility state of the dropdown menu. */
export let open = false;
/** Specifies a custom class name for the outer combobox container. */
let className = "";
export { className as class };
/** Obtains a bound DOM reference to the ComboBox's value input element. */
export let inputElement = null;
/** Obtains a bound DOM reference to the ComboBox's searchbox input element. Only applicable if `searchable` is set to `true`. */
export let searchInputElement = null;
/** Obtains a bound DOM reference to the ComboBox's outer container element. */
export let containerElement = null;
/** Obtains a bound DOM reference to the ComboBox's menu dropdown list element. */
export let menuElement = null;
/** Obtains a bound DOM reference to the ComboBox's trigger button element. */
export let buttonElement = null;
const forwardEvents = createEventForwarder(get_current_component(), [
    "open",
    "close",
    "select",
    "change",
    "input",
    "beforeinput",
    "keydown"
]);
const dispatch = createEventDispatcher();
const buttonId = uid("fds-combo-box-button-");
const dropdownId = uid("fds-combo-box-dropdown-");
$: selectableItems = items.filter(item => !item.disabled);
$: selection = items.find(i => i.value === value);
$: if (menuElement && menuElement.children.length > 0 && !editable) {
    if (selection) {
        menuElement.children[items.indexOf(selection)].focus();
    }
    else {
        menuElement.children[0].focus();
    }
}
$: if (items.length > 0) {
    if (open) {
        dispatch("open");
    }
    else {
        dispatch("close");
    }
}
$: dispatch("select", selection);
$: menuGrowDirection =
    !selection || items[items.indexOf(selection)] === items[Math.floor(items.length / 2)]
        ? "center"
        : items.indexOf(selection) < items.indexOf(items[Math.floor(items.length / 2)])
            ? "top"
            : "bottom";
let inputFocused = false;
let itemHeight = 36;
let menuOffset = itemHeight * -(selection ? items.indexOf(selection) : Math.floor(items.length / 2));
onMount(() => {
    if (!searchValue)
        searchValue = value;
});
function updateOffset(target) {
    menuOffset = -(target.offsetTop - parseInt(getComputedStyle(target).getPropertyValue("margin-top")));
}
function selectItem(item) {
    if (item.disabled)
        return;
    value = item.value;
    searchValue = item.name;
    open = false;
    if (containerElement && !editable)
        containerElement.children[0].focus();
}
async function openMenu() {
    open = !open;
    await tick();
    if (editable && searchInputElement)
        searchInputElement.focus();
    if (menuElement && selection)
        updateOffset(menuElement.children[items.indexOf(selection)]);
}
async function handleKeyboardNavigation(event) {
    const { key } = event;
    event.stopPropagation();
    const editableClosed = editable && !open;
    // Conditions for closing the menu.
    if (key === "Tab" || key === "Esc" || key === "Escape")
        open = false;
    // Oh boy, here we go...
    if (key === "ArrowDown" &&
        !editableClosed &&
        !(items.indexOf(selection) >= items.length - 1)) {
        value = selectableItems[selectableItems.indexOf(selection) + 1].value; // If down arrow is pressed, check current selection and move to next non-disabled item.
        searchValue = selectableItems[selectableItems.indexOf(selection) + 1].name;
    }
    else if (key === "ArrowUp" && !editableClosed && !(items.indexOf(selection) <= 0)) {
        value = selectableItems[selectableItems.indexOf(selection) - 1].value; // Do the same with up arrow.
        searchValue = selectableItems[selectableItems.indexOf(selection) - 1].name;
    }
    else if (key === "Home") {
        value = selectableItems[0].value; // If home is pressed, move to first non-disabled item.
        searchValue = selectableItems[0].name;
    }
    else if (key === "End") {
        value = selectableItems[selectableItems.length - 1].value; // If end is pressed, move to last non-disabled item.
        searchValue = selectableItems[selectableItems.length - 1].name;
    }
    else if (menuElement && selection && key === "Enter") {
        event.preventDefault();
        selectItem(selection); // Select item when the enter key is pressed and the menu is open
    }
    else if (!menuElement && selection && key === "Enter") {
        openMenu(); // Open the menu when the enter key is pressed and the menu is closed
    }
    else if (searchInputElement && document.activeElement !== searchInputElement) {
        searchInputElement.focus(); // If the input element has lost focus, regain it.
    }
    // Prevent the browser's default scrolling behavior for these keys
    if (key === "ArrowDown" || key === "ArrowUp" || key === "Home" || key === "End")
        event.preventDefault();
    // Keybindings for opening the menu when in editable mode using arrow keys
    if (key === "ArrowDown" || (key === "ArrowUp" && editable)) {
        if (open) {
            await tick();
            searchInputElement === null || searchInputElement === void 0 ? void 0 : searchInputElement.select(); // Select text when an item is chosen.
        }
        else {
            open = true;
        }
    }
}
function handleInputFocus() {
    searchInputElement.select();
    inputFocused = true;
}
function handleInputBlur() {
    inputFocused = false;
}
function handleInput(event) {
    const match = selectableItems.find(i => i.name.toLowerCase().startsWith(searchValue.toLowerCase()));
    if (!match)
        value = null;
    if (match && event.inputType === "insertText" && searchValue.trim() !== "") {
        searchInputElement.value = match.name;
        searchInputElement.setSelectionRange(searchValue.length, match.name.length);
    }
    if (match && !match.disabled)
        value = match.value;
    searchValue = searchInputElement.value;
}
</script>

<!--
@component
Use a combo box (also known as a drop-down list) to present a list of items that a user can select from. A combo box starts in a compact state and expands to show a list of selectable items. 

When the combo box is closed, it either displays the current selection or is empty if there is no selected item. When the user expands the combo box, it displays the list of selectable items.
[Docs](https://fluent-svelte.vercel.app/docs/components/combobox)

- Usage:
    ```tsx
    <ComboBox items={[
		{ name: "Item 0", value: 0 },
		{ name: "Item 1", value: 1 },
		{ name: "Item 2", value: 2 },
	]} />
    ```
-->
<div
	use:forwardEvents
	use:externalMouseEvents={{ type: "mousedown" }}
	class="combo-box {className}"
	class:disabled
	class:editable
	class:open
	on:outermousedown={() => {
		if (open) open = false;
	}}
	bind:this={containerElement}
	{...$$restProps}
>
	{#if editable}
		<TextBox
			clearButton={false}
			class="combo-box-textbox"
			role="combobox"
			aria-activedescendant={inputFocused}
			aria-autocomplete="both"
			aria-controls={dropdownId}
			aria-expanded={open}
			aria-haspopup={open ? "listbox" : undefined}
			bind:value={searchValue}
			bind:inputElement={searchInputElement}
			on:keydown={handleKeyboardNavigation}
			on:input={handleInput}
			on:focus={handleInputFocus}
			on:blur={handleInputBlur}
			on:change
			on:input
			on:beforeinput
			on:keydown
			{placeholder}
			{disabled}
		>
			<TextBoxButton
				aria-expanded={open}
				aria-label="Open dropdown"
				aria-controls={dropdownId}
				class="combo-box-dropdown-button"
				on:click={openMenu}
				bind:element={buttonElement}
				slot="buttons"
			>
				<svg
					aria-hidden="true"
					class="combo-box-icon"
					xmlns="http://www.w3.org/2000/svg"
					width="48"
					height="48"
					viewBox="0 0 48 48"
				>
					<path
						fill="currentColor"
						d="M8.36612 16.1161C7.87796 16.6043 7.87796 17.3957 8.36612 17.8839L23.1161 32.6339C23.6043 33.122 24.3957 33.122 24.8839 32.6339L39.6339 17.8839C40.122 17.3957 40.122 16.6043 39.6339 16.1161C39.1457 15.628 38.3543 15.628 37.8661 16.1161L24 29.9822L10.1339 16.1161C9.64573 15.628 8.85427 15.628 8.36612 16.1161Z"
					/>
				</svg>
			</TextBoxButton>
		</TextBox>
	{:else}
		<Button
			type="button"
			class="combo-box-button"
			id={buttonId}
			aria-labelledby={buttonId}
			aria-haspopup={open ? "listbox" : undefined}
			aria-controls={dropdownId}
			on:keydown={handleKeyboardNavigation}
			on:keydown
			on:click={openMenu}
			bind:element={buttonElement}
			{disabled}
		>
			<span class="combo-box-label" class:placeholder={!selection}>
				{selection?.name || placeholder}
			</span>
			<svg
				aria-hidden="true"
				class="combo-box-icon"
				xmlns="http://www.w3.org/2000/svg"
				width="48"
				height="48"
				viewBox="0 0 48 48"
			>
				<path
					fill="currentColor"
					d="M8.36612 16.1161C7.87796 16.6043 7.87796 17.3957 8.36612 17.8839L23.1161 32.6339C23.6043 33.122 24.3957 33.122 24.8839 32.6339L39.6339 17.8839C40.122 17.3957 40.122 16.6043 39.6339 16.1161C39.1457 15.628 38.3543 15.628 37.8661 16.1161L24 29.9822L10.1339 16.1161C9.64573 15.628 8.85427 15.628 8.36612 16.1161Z"
				/>
			</svg>
		</Button>
	{/if}
	{#if !disabled && items.length > 0}
		{#if open}
			<ul
				bind:this={menuElement}
				on:blur={() => (open = false)}
				id={dropdownId}
				aria-labelledby={buttonId}
				aria-activedescendant={editable
					? undefined
					: `${dropdownId}-item-${items.indexOf(selection)}`}
				role="listbox"
				class="combo-box-dropdown direction-{!editable
					? menuGrowDirection ?? 'center'
					: 'top'}"
				style="--fds-menu-offset: {menuOffset}px;"
			>
				{#each items as item, i}
					<ComboBoxItem
						role="option"
						selected={item.value === value}
						disabled={item.disabled}
						id="{dropdownId}-item-{i}"
						on:keydown={handleKeyboardNavigation}
						on:click={() => selectItem(item)}
					>
						{item.name}
					</ComboBoxItem>
				{/each}
			</ul>
		{/if}

		<input
			type="hidden"
			aria-hidden="true"
			bind:this={inputElement}
			bind:value
			on:change
			on:input
			on:beforeinput
		/>
		<slot />
	{/if}
</div>

<style>@-webkit-keyframes menu-in{0%{-webkit-clip-path:var(--fds-grow-clip-path);clip-path:var(--fds-grow-clip-path)}to{-webkit-clip-path:polygon(0 0,100% 0,100% 100%,0 100%);clip-path:polygon(0 0,100% 0,100% 100%,0 100%)}}@keyframes menu-in{0%{-webkit-clip-path:var(--fds-grow-clip-path);clip-path:var(--fds-grow-clip-path)}to{-webkit-clip-path:polygon(0 0,100% 0,100% 100%,0 100%);clip-path:polygon(0 0,100% 0,100% 100%,0 100%)}}@-webkit-keyframes shadow-in{0%{box-shadow:none}to{box-shadow:var(--fds-flyout-shadow)}}@keyframes shadow-in{0%{box-shadow:none}to{box-shadow:var(--fds-flyout-shadow)}}.combo-box{display:inline-flex;position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.combo-box :global(.button),.combo-box :global(.text-box){flex:1 1 auto}.combo-box :global(.text-box){border-color:var(--fds-control-border-default)}.combo-box :global(.text-box-underline:after){border-color:transparent}.combo-box :global(.text-box-container){cursor:default}.combo-box :global(.text-box-container:focus-visible){cursor:text}.combo-box.editable :global(.combo-box-textbox:not(:focus-within)){border-color:var(--fds-control-border-default);cursor:default}.combo-box.editable :global(.combo-box-textbox:not(:focus-within)) :global(.text-box-underline:after){content:none}.combo-box.editable :global(.combo-box-textbox.disabled){border-color:var(--fds-control-stroke-default)}.combo-box.editable.open :global(.combo-box-textbox){background-color:var(--fds-control-fill-input-active);cursor:text}.combo-box.editable.open :global(.combo-box-textbox) :global(.text-box-underline:after){border-bottom:2px solid var(--fds-accent-default);content:""}.combo-box.editable.open :global(.combo-box-textbox) :global(input::-moz-placeholder){color:var(--fds-text-tertiary)}.combo-box.editable.open :global(.combo-box-textbox) :global(input:-ms-input-placeholder){color:var(--fds-text-tertiary)}.combo-box.editable.open :global(.combo-box-textbox) :global(input::placeholder){color:var(--fds-text-tertiary)}.combo-box.editable.open :global(.text-box-underline){border-end-end-radius:0;border-end-start-radius:0}.combo-box.editable .combo-box-dropdown{border-radius:var(--fds-overlay-corner-radius);border-start-end-radius:0;border-start-start-radius:0;inline-size:100%;inset-block-start:100%;inset-inline-start:0;margin:0}.combo-box.editable .combo-box-icon{margin:0}.combo-box-label{flex:1 1 auto;min-block-size:20px;text-align:start}.combo-box-label.placeholder{color:var(--fds-text-secondary)}.combo-box.disabled .placeholder{color:var(--fds-text-disabled)}.combo-box-icon{-webkit-margin-start:8px;block-size:12px;inline-size:12px;margin-inline-start:8px}.combo-box-dropdown{-webkit-margin-before:-6px;-webkit-margin-start:-5px;-webkit-animation:menu-in var(--fds-control-normal-duration) var(--fds-control-fast-out-slow-in-easing),shadow-in var(--fds-control-normal-duration) var(--fds-control-fast-out-slow-in-easing) var(--fds-control-normal-duration);animation:menu-in var(--fds-control-normal-duration) var(--fds-control-fast-out-slow-in-easing),shadow-in var(--fds-control-normal-duration) var(--fds-control-fast-out-slow-in-easing) var(--fds-control-normal-duration);background-clip:padding-box;background-color:var(--fds-solid-background-quarternary);border:1px solid var(--fds-surface-stroke-flyout);border-radius:var(--fds-overlay-corner-radius);box-shadow:var(--fds-flyout-shadow);box-sizing:border-box;inline-size:calc(100% + 8px);inset-block-start:var(--fds-menu-offset,0);inset-inline-start:0;margin:0;margin-block-start:-6px;margin-inline-start:-5px;max-block-size:504px;overflow:auto;padding:1px;position:absolute;z-index:100}@supports (overflow:overlay){.combo-box-dropdown{overflow:overlay}}.combo-box-dropdown.direction-top{--fds-grow-clip-path:polygon(0 0,100% 0,100% 25%,0 25%)}.combo-box-dropdown.direction-center{--fds-grow-clip-path:polygon(0 25%,100% 24%,100% 75%,0 75%)}.combo-box-dropdown.direction-bottom{--fds-grow-clip-path:polygon(0 75%,100% 75%,100% 100%,0 100%)}</style>
