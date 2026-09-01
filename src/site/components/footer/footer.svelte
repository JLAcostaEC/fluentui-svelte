<script>
	import { Button } from '$lib/index.js';
	import { m } from '$i18n/messages.js';
	import { localizeHref } from '$i18n/runtime.js';
</script>

<footer id="footer">
	<section class="container">
		<div class="info">
			<p>{m.footer_copyright_design_system()}</p>
			<p>{m.footer_copyright_components()}</p>
		</div>
		<nav>
			<Button as="a" appearance="subtle" href={localizeHref('/about')}>{m.global_about()}</Button>
			<Button as="a" appearance="subtle" href="https://jorgelacosta.com">{m.global_contact()}</Button>
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
