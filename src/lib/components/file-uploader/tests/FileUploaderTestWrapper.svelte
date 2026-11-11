<script lang="ts">
	import { FileUploader, FluentUISvelte, Label } from '#lib/index.js';
	import type { FileUploaderFile, FileUploaderProps } from '#lib/components/file-uploader/types.js';

	let {
		files = $bindable([]),
		label,
		onsubmit,
		...props
	}: Partial<FileUploaderProps> & {
		/** Puts the uploader in a Label with this text. */
		label?: string;
		onsubmit?: (data: FormData) => void;
	} = $props();
</script>

{#snippet uploader()}
	<FileUploader bind:files name="attachments" {...props} />
{/snippet}

<FluentUISvelte>
	<form
		onsubmit={(event) => {
			event.preventDefault();
			onsubmit?.(new FormData(event.currentTarget));
		}}
	>
		{#if label}
			<Label {label} labelPosition="above">{@render uploader()}</Label>
		{:else}
			{@render uploader()}
		{/if}
		<button type="submit">Submit</button>
		<button type="reset">Reset</button>
	</form>
	<p data-testid="files">{files.map((file: FileUploaderFile) => file.name).join(',') || 'empty'}</p>
</FluentUISvelte>
