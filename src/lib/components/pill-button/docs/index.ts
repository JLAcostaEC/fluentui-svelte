import Docs from './docs.svx';
import Examples from './examples.svx';
import Forms from './forms.svx';
import Accessibility from './accessibility.svx';
import Footer from './footer.svx';
import type { ConfigDocs } from '#types';
import { META } from './meta.ts';

export const DATA: ConfigDocs = {
	meta: META,
	docs: Docs,
	examples: [Examples, Forms, Accessibility],
	footer: Footer
};
