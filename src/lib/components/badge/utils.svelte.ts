import CheckmarkCircleFilled from 'fluentui-icons-svelte/CheckmarkCircleFilled.svelte';
import CheckmarkCircleRegular from 'fluentui-icons-svelte/CheckmarkCircleRegular.svelte';
import ClockFilled from 'fluentui-icons-svelte/ClockFilled.svelte';
import CircleFilled from 'fluentui-icons-svelte/CircleFilled.svelte';
import CircleRegular from 'fluentui-icons-svelte/CircleRegular.svelte';
import SubtractCircleFilled from 'fluentui-icons-svelte/SubtractCircleFilled.svelte';
import SubtractCircleRegular from 'fluentui-icons-svelte/SubtractCircleRegular.svelte';
import DismissCircleRegular from 'fluentui-icons-svelte/DismissCircleRegular.svelte';
import ArrowCircleLeftRegular from 'fluentui-icons-svelte/ArrowCircleLeftRegular.svelte';
import ProhibitedFilled from 'fluentui-icons-svelte/ProhibitedFilled.svelte';

export const shapes = {
	rounded: 'var(--fs-control-border-radius)',
	circular: '9999rem',
	square: '0'
};

export const getIconBadge = (outOfOffice: boolean, status: string) =>
	({
		available: outOfOffice ? CheckmarkCircleRegular : CheckmarkCircleFilled,
		away: outOfOffice ? ArrowCircleLeftRegular : ClockFilled,
		busy: outOfOffice ? CircleRegular : CircleFilled,
		'do-not-disturb': outOfOffice ? SubtractCircleRegular : SubtractCircleFilled,
		offline: outOfOffice ? ArrowCircleLeftRegular : DismissCircleRegular,
		'out-of-office': ArrowCircleLeftRegular,
		blocked: ProhibitedFilled,
		unknown: CircleRegular
	})[status];

export const colors = {
	available: 'success',
	away: 'warning',
	busy: 'critical',
	'do-not-disturb': 'critical',
	offline: 'information',
	'out-of-office': 'information',
	blocked: 'critical',
	unknown: 'information'
};
