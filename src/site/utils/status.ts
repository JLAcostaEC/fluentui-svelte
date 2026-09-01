import { m } from '$i18n/messages.js';
import type { Colors, Variants } from '$types';

export type StatusBadge = {
	appearance: Variants;
	color: Colors;
	message: string;
};

/** Badge styling and explanation for the `status` a component declares in its docs META. */
export const statusBadge = (status: string): StatusBadge => {
	switch (status) {
		case 'AI':
			return { appearance: 'tint', color: 'success', message: m.docs_status_ai() };
		case 'Experimental':
			return { appearance: 'tint', color: 'warning', message: m.docs_status_experimental() };
		case 'New':
			return { appearance: 'filled', color: 'attention', message: m.docs_status_new() };
		case 'Beta':
		case 'WIP':
			return { appearance: 'tint', color: 'attention', message: m.docs_status_wip() };
		case 'Empty':
			return { appearance: 'tint', color: 'information', message: m.docs_status_empty() };
		case 'Prototype':
			return { appearance: 'tint', color: 'critical', message: m.docs_status_prototype() };
		default:
			return { appearance: 'tint', color: 'critical', message: '' };
	}
};
