import { m } from '#i18n/messages.js';
import type { Colors, Variants } from '#types';

export type StatusBadge = {
	appearance: Variants;
	color: Colors;
	label: string;
	message: string;
};

/** Badge styling and explanation for the `status` a component declares in its docs META. */
export const statusBadge = (status: string): StatusBadge => {
	switch (status) {
		case 'AI':
			return { appearance: 'tint', color: 'success', label: m.site_status_ai(), message: m.docs_status_ai() };
		case 'Experimental':
			return {
				appearance: 'tint',
				color: 'warning',
				label: m.site_status_experimental(),
				message: m.docs_status_experimental()
			};
		case 'New':
			return { appearance: 'filled', color: 'attention', label: m.site_component_new(), message: m.docs_status_new() };
		case 'Beta':
		case 'WIP':
			return {
				appearance: 'tint',
				color: 'attention',
				label: status === 'Beta' ? m.site_status_beta() : m.site_status_wip(),
				message: m.docs_status_wip()
			};
		case 'Empty':
			return { appearance: 'tint', color: 'information', label: m.site_status_empty(), message: m.docs_status_empty() };
		case 'Prototype':
			return {
				appearance: 'tint',
				color: 'critical',
				label: m.site_status_prototype(),
				message: m.docs_status_prototype()
			};
		default:
			return { appearance: 'tint', color: 'critical', label: status, message: '' };
	}
};
