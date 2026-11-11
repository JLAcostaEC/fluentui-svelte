import {
	BOX_DESCRIPTOR,
	BoxPlugin,
	DROPBOX_DESCRIPTOR,
	DropboxPlugin,
	GOOGLE_DRIVE_DESCRIPTOR,
	GoogleDrivePlugin,
	ONE_DRIVE_DESCRIPTOR,
	OneDrivePlugin,
	type BoxConfig,
	type DropboxConfig,
	type GoogleDriveConfig,
	type OneDriveConfig
} from '@useupup/core';
import type { FileUploaderDrive } from './types.ts';

// Each cloud drive is its own export: an app bundles the upup plugin of a drive only when it passes it to `sources`.
// The brand marks come from the icon set of upup, copied here to keep the whole set out of the bundle.

/** Google Drive as a source of a FileUploader. The ids come from the Google Cloud console. */
export const googleDriveSource = (config: GoogleDriveConfig): FileUploaderDrive => ({
	id: 'googleDrive',
	descriptor: GOOGLE_DRIVE_DESCRIPTOR,
	icon: {
		viewBox: '0 0 32 32',
		inner:
			'<g fill-rule="nonzero" fill="none"> <path d="M6.663 22.284l.97 1.62c.202.34.492.609.832.804l3.465-5.798H5c0 .378.1.755.302 1.096l1.361 2.278z" fill="#0066DA" /> <path d="M16 12.09l-3.465-5.798c-.34.195-.63.463-.832.804l-6.4 10.718A2.15 2.15 0 005 18.91h6.93L16 12.09z" fill="#00AC47" /> <path d="M23.535 24.708c.34-.195.63-.463.832-.804l.403-.67 1.928-3.228c.201-.34.302-.718.302-1.096h-6.93l1.474 2.802 1.991 2.996z" fill="#EA4335" /> <path d="M16 12.09l3.465-5.798A2.274 2.274 0 0018.331 6h-4.662c-.403 0-.794.11-1.134.292L16 12.09z" fill="#00832D" /> <path d="M20.07 18.91h-8.14l-3.465 5.798c.34.195.73.292 1.134.292h12.802c.403 0 .794-.11 1.134-.292L20.07 18.91z" fill="#2684FC" /> <path d="M23.497 12.455l-3.2-5.359a2.252 2.252 0 00-.832-.804L16 12.09l4.07 6.82h6.917c0-.377-.1-.755-.302-1.096l-3.188-5.359z" fill="#FFBA00" /> </g>'
	},
	plugin: () => new GoogleDrivePlugin().configure(config)
});

/** OneDrive as a source of a FileUploader. The client id comes from the Microsoft Entra admin center. */
export const oneDriveSource = (config: OneDriveConfig): FileUploaderDrive => ({
	id: 'oneDrive',
	descriptor: ONE_DRIVE_DESCRIPTOR,
	icon: {
		viewBox: '0 0 32 32',
		inner:
			'<g fill="none" fill-rule="nonzero"> <path d="M13.39 12.888l4.618 2.747 2.752-1.15a4.478 4.478 0 012.073-.352 6.858 6.858 0 00-5.527-5.04 6.895 6.895 0 00-6.876 2.982l.07-.002a5.5 5.5 0 012.89.815z" fill="#0364B8" /> <path d="M13.39 12.887v.001a5.5 5.5 0 00-2.89-.815l-.07.002a5.502 5.502 0 00-4.822 2.964 5.43 5.43 0 00.38 5.62l4.073-1.702 1.81-.757 4.032-1.685 2.105-.88-4.619-2.748z" fill="#0078D4" /> <path d="M22.833 14.133a4.479 4.479 0 00-2.073.352l-2.752 1.15.798.475 2.616 1.556 1.141.68 3.902 2.321a4.413 4.413 0 00-.022-4.25 4.471 4.471 0 00-3.61-2.284z" fill="#1490DF" /> <path d="M22.563 18.346l-1.141-.68-2.616-1.556-.798-.475-2.105.88L11.87 18.2l-1.81.757-4.073 1.702A5.503 5.503 0 0010.5 23h12.031a4.472 4.472 0 003.934-2.333l-3.902-2.321z" fill="#28A8EA" /> </g>'
	},
	plugin: () => new OneDrivePlugin().configure(config)
});

/** Dropbox as a source of a FileUploader. The client id comes from the Dropbox App Console. */
export const dropboxSource = (config: DropboxConfig): FileUploaderDrive => ({
	id: 'dropbox',
	descriptor: DROPBOX_DESCRIPTOR,
	icon: {
		viewBox: '0 0 32 32',
		color: '#0061fe',
		inner:
			'<path d="M10.5 7.5L5 10.955l5.5 3.454 5.5-3.454 5.5 3.454 5.5-3.454L21.5 7.5 16 10.955zM10.5 21.319L5 17.864l5.5-3.455 5.5 3.455zM16 17.864l5.5-3.455 5.5 3.455-5.5 3.455zM16 25.925l-5.5-3.455 5.5-3.454 5.5 3.454z" fill="currentcolor" fill-rule="nonzero" />'
	},
	plugin: () => new DropboxPlugin().configure(config)
});

/** Box as a source of a FileUploader. The client id comes from the Box Developer Console. */
export const boxSource = (config: BoxConfig): FileUploaderDrive => ({
	id: 'box',
	descriptor: BOX_DESCRIPTOR,
	icon: {
		viewBox: '0 0 32 32',
		color: '#0061d5',
		inner:
			'<g fill="currentcolor" fill-rule="nonzero"> <path d="m16.4 13.5c-1.6 0-3 0.9-3.7 2.2-0.7-1.3-2.1-2.2-3.7-2.2-1 0-1.8 0.3-2.5 0.8v-3.6c-0.1-0.3-0.5-0.7-1-0.7s-0.8 0.4-0.8 0.8v7c0 2.3 1.9 4.2 4.2 4.2 1.6 0 3-0.9 3.7-2.2 0.7 1.3 2.1 2.2 3.7 2.2 2.3 0 4.2-1.9 4.2-4.2 0.1-2.4-1.8-4.3-4.1-4.3m-7.5 6.8c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5m7.5 0c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5" /> <path d="m27.2 20.6l-2.3-2.8 2.3-2.8c0.3-0.4 0.2-0.9-0.2-1.2s-1-0.2-1.3 0.2l-2 2.4-2-2.4c-0.3-0.4-0.9-0.4-1.3-0.2-0.4 0.3-0.5 0.8-0.2 1.2l2.3 2.8-2.3 2.8c-0.3 0.4-0.2 0.9 0.2 1.2s1 0.2 1.3-0.2l2-2.4 2 2.4c0.3 0.4 0.9 0.4 1.3 0.2 0.4-0.3 0.4-0.8 0.2-1.2" /> </g>'
	},
	plugin: () => new BoxPlugin().configure(config)
});
