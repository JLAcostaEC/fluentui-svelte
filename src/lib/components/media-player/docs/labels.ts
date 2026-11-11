import { m } from '#i18n/messages.js';
import type { MediaPlayerLabels } from '../types.ts';

/** The texts of the players of the docs, in the language of the site. */
export const docsLabels = (): MediaPlayerLabels => ({
	play: m.media_player_label_play(),
	pause: m.media_player_label_pause(),
	previous: m.media_player_label_previous(),
	next: m.media_player_label_next(),
	skipBackward: (seconds) => m.media_player_label_skip_backward({ seconds }),
	skipForward: (seconds) => m.media_player_label_skip_forward({ seconds }),
	seek: m.media_player_label_seek(),
	seekValue: (time, duration) => m.media_player_label_seek_value({ time, duration }),
	volume: m.media_player_label_volume(),
	mute: m.media_player_label_mute(),
	unmute: m.media_player_label_unmute(),
	repeat: m.media_player_label_repeat(),
	subtitles: m.media_player_label_subtitles(),
	subtitlesOff: m.media_player_label_subtitles_off(),
	pictureInPicture: m.media_player_label_picture_in_picture(),
	exitPictureInPicture: m.media_player_label_exit_picture_in_picture(),
	fullScreen: m.media_player_label_full_screen(),
	exitFullScreen: m.media_player_label_exit_full_screen(),
	moreOptions: m.media_player_label_more_options(),
	playbackSpeed: m.media_player_label_playback_speed(),
	normalSpeed: m.media_player_label_normal_speed(),
	loading: m.media_player_label_loading(),
	error: m.media_player_label_error(),
	dismiss: m.media_player_label_dismiss()
});
