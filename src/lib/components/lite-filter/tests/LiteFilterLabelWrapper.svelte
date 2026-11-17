<script lang="ts">
	import { Label, LiteFilter, LiteFilterItem } from '#lib/index.js';

	let submitted = $state('');
</script>

<form
	onsubmit={(e) => {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		submitted = JSON.stringify({ type: data.get('type'), source: data.getAll('source') });
	}}
>
	<Label label="Type" labelPosition="above">
		<LiteFilter name="type" selectedValue="all">
			<LiteFilterItem value="all">All</LiteFilterItem>
			<LiteFilterItem value="documents">Documents</LiteFilterItem>
		</LiteFilter>
	</Label>
	<Label label="Sources" labelPosition="above">
		<LiteFilter name="source" multiple selectedValue={['onedrive']}>
			<LiteFilterItem value="this-pc">This PC</LiteFilterItem>
			<LiteFilterItem value="onedrive">OneDrive</LiteFilterItem>
		</LiteFilter>
	</Label>
	<button type="submit">Search</button>
</form>
<output data-testid="submitted">{submitted}</output>
