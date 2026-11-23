import { m } from '#i18n/messages.js';

export const usageCode = () =>
	[
		'<script>',
		'  import { TextBox, Dialog, DialogTrigger,',
		"    DialogSurface, DialogTitle, DialogContent } from 'fluentui-svelte';",
		"  let name = $state('');",
		'</' + 'script>',
		'',
		'<TextBox bind:value={name} aria-label=' + JSON.stringify(m.site_demo_name()) + ' />',
		'<Dialog>',
		'  <DialogTrigger>' + m.site_demo_say_hello() + '</DialogTrigger>',
		'  <DialogSurface>',
		'    <DialogTitle>' + m.site_demo_greeting() + '</DialogTitle>',
		'    <DialogContent>' +
			m.site_demo_hello({ name: '{name || ' + JSON.stringify(m.site_demo_stranger()) + '}' }) +
			'</DialogContent>',
		'  </DialogSurface>',
		'</Dialog>'
	].join('\n');
