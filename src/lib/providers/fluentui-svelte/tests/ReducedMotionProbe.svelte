<script lang="ts">
	import { getGlobalFSContext, getReducedMotion } from '../fluentui-svelte.js';

	const context = getGlobalFSContext();

	// What every animating component does: read the global context at init, then hand the value to
	// whatever cannot read it — a transition function or a plain class.
	const reducedMotion = getReducedMotion();
</script>

<span data-testid="from-context">{String(context?.state.reducedMotion)}</span>
<span data-testid="from-getter">{String(reducedMotion())}</span>

<!-- The three answers an app's own motion setting can hold, including "never asked". -->
<button data-testid="reduce" onclick={() => context?.methods.setReducedMotion(true)}>Reduce motion</button>
<button data-testid="restore" onclick={() => context?.methods.setReducedMotion(false)}>Full motion</button>
<button data-testid="follow-system" onclick={() => context?.methods.setReducedMotion(null)}>Follow system</button>
