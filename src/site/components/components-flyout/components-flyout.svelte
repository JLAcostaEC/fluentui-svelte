<script lang="ts">
	import {
		Checkbox,
		InfoBar,
		NumberBox,
		Persona,
		ProgressRing,
		RadioButton,
		TextBox,
		ToggleSwitch,
		Expander,
		Flyout,
		Button
	} from '$lib/index.js';
</script>

<Flyout class="components-flyout">
	<Button appearance="accent" />
	<Button appearance="standard" />
	<Button appearance="subtle" />
	<Checkbox name="checked" wrapperAs="label" checked>Checked Checkbox</Checkbox>
	<Checkbox name="indeterminate" indeterminate wrapperAs="label">Indeterminate Checkbox</Checkbox>
	<ToggleSwitch label="ToggleButton" checked />
	<RadioButton label="RadioButton" value="checked" checked={true} />
	<Persona
		name="John Doe"
		primaryText="Busy"
		secondaryText="Web Developer"
		tertiaryText="Company Name"
		size={64}
		presence={{ status: 'available' }}
	/>
	<TextBox />
	<TextBox type="search" placeholder="Search TextBox" />
	<TextBox type="password" placeholder="Password TextBox" />
	<NumberBox />
	<NumberBox variant="compact" />
	<ProgressRing value={50} />
	<ProgressRing value={50} hideRail />
	<ProgressRing indeterminate />
	<ProgressRing indeterminate hideRail />
	<InfoBar title="Info Title" status="attention">
		<p>A good message here...</p>
	</InfoBar>
	<Expander header="Expander Label" description="A description of the expander">
		<h1>Content</h1>
		<p>
			Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aspernatur ipsa consequatur voluptates minima esse modi
			soluta commodi sit facere. Dolore, autem suscipit voluptatem pariatur corporis velit sint quaerat ipsa porro.
		</p>
	</Expander>
</Flyout>

<style>
	:global(.components-flyout) {
		width: 100%;
		flex-wrap: wrap;
		align-items: center;
		justify-content: flex-start;
		gap: 1rem;
	}
</style>
