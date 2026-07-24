<script>
	import { Button } from '$lib/index.js';
</script>

<footer id="footer">
	<section class="container">
		<div class="info">
			<p>Design System by Microsoft</p>
			<p>Open-Source Components by Jorge Acosta</p>
		</div>
		<nav>
			<Button as="a" appearance="subtle" href="/">Home</Button>
			<Button as="a" appearance="subtle" href="/docs">Docs</Button>
			<Button as="a" appearance="subtle" href="/about">About</Button>
		</nav>
	</section>
</footer>

<style>
	#footer {
		background-color: var(--fs-control-fill-default);
		border-top: 1px solid var(--fs-control-stroke-default);
		& .container {
			display: flex;
			width: 100%;
			max-width: 1600px;
			padding: 1rem 2rem;
			margin-inline: auto;
			justify-content: space-between;
			align-items: center;
			& .info p {
				margin: 0;
				font-size: 0.8rem;
				line-height: 1.3em;
			}
			& nav {
				display: flex;
				gap: 0.5rem;
			}

			@media (max-width: 768px) {
				flex-direction: column;
				align-items: center;
				gap: 1rem;
				padding: 1.5rem 1rem;
				text-align: center;
				& nav {
					flex-wrap: wrap;
					justify-content: center;
				}
			}
		}
	}
</style>
