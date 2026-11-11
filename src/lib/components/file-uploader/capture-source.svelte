<script lang="ts">
	import { Button, ProgressRing } from '#lib/index.js';
	import { onMount } from 'svelte';
	import CameraRegular from 'fluentui-icons-svelte/CameraRegular.svelte';
	import CameraSwitchRegular from 'fluentui-icons-svelte/CameraSwitchRegular.svelte';
	import MicRegular from 'fluentui-icons-svelte/MicRegular.svelte';
	import RecordRegular from 'fluentui-icons-svelte/RecordRegular.svelte';
	import RecordStopRegular from 'fluentui-icons-svelte/RecordStopRegular.svelte';
	import ShareScreenStartRegular from 'fluentui-icons-svelte/ShareScreenStartRegular.svelte';
	import type { FileUploaderLabels } from './types.ts';
	import { captureName, extensionOf } from './utils.ts';

	type Phase = 'idle' | 'starting' | 'live' | 'recording' | 'review' | 'error';

	let {
		kind,
		labels,
		onAdd
	}: { kind: 'camera' | 'microphone' | 'screen'; labels: FileUploaderLabels; onAdd: (file: File) => void } = $props();

	let phase: Phase = $state('idle');
	let message = $state('');
	let facing: 'user' | 'environment' = $state('user');
	let canSwitch = $state(false);
	let elapsed = $state(0);
	let result: { file: File; url: string } | null = $state(null);
	let videoRef: HTMLVideoElement | null = $state(null);

	let stream: MediaStream | null = null;
	let recorder: MediaRecorder | null = null;
	let timer: ReturnType<typeof setInterval> | undefined;
	/** Stops the mirrored copy of the camera a recording is made from. */
	let stopMirror: (() => void) | null = null;

	const showsVideo = $derived(kind !== 'microphone');
	/** The front camera shows a mirror image, and what it captures keeps it: the result looks as previewed. */
	const mirrored = $derived(kind === 'camera' && facing === 'user');
	const clock = $derived(
		`${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`
	);

	async function request(): Promise<MediaStream> {
		const devices = navigator.mediaDevices;
		if (kind === 'screen') return devices.getDisplayMedia({ video: true, audio: true });
		if (kind === 'microphone') return devices.getUserMedia({ audio: true });
		try {
			return await devices.getUserMedia({ video: { facingMode: facing }, audio: true });
		} catch {
			// Without a microphone, or without leave to use it, the camera still takes photos and silent videos.
			return devices.getUserMedia({ video: { facingMode: facing } });
		}
	}

	async function start() {
		release();
		phase = 'starting';
		try {
			stream = await request();
			stream.getVideoTracks()[0]?.addEventListener('ended', () => {
				// The browser stopped sharing the screen: what was recorded is kept.
				if (recorder?.state === 'recording') recorder.stop();
				else if (phase === 'live') phase = 'idle';
			});
			if (kind === 'camera') {
				const inputs = (await navigator.mediaDevices.enumerateDevices()).filter((d) => d.kind === 'videoinput');
				canSwitch = inputs.length > 1;
			}
			phase = 'live';
		} catch (error) {
			const name = (error as Error).name;
			// Closing the screen picker is not a failure: the button to open it comes back.
			if (kind === 'screen' && name === 'NotAllowedError') {
				phase = 'idle';
				return;
			}
			message = name === 'NotAllowedError' ? labels.permissionDenied : labels.captureError;
			phase = 'error';
		}
	}

	$effect(() => {
		if (videoRef && stream && (phase === 'live' || phase === 'recording')) videoRef.srcObject = stream;
	});

	function release() {
		clearInterval(timer);
		stopMirror?.();
		stopMirror = null;
		stream?.getTracks().forEach((track) => track.stop());
		stream = null;
		if (result) URL.revokeObjectURL(result.url);
		result = null;
		elapsed = 0;
	}

	function review(file: File) {
		stream?.getTracks().forEach((track) => track.stop());
		stream = null;
		result = { file, url: URL.createObjectURL(file) };
		phase = 'review';
	}

	function takePhoto() {
		if (!videoRef) return;
		const canvas = document.createElement('canvas');
		canvas.width = videoRef.videoWidth;
		canvas.height = videoRef.videoHeight;
		const context = canvas.getContext('2d');
		if (mirrored) context?.setTransform(-1, 0, 0, 1, canvas.width, 0);
		context?.drawImage(videoRef, 0, 0);
		canvas.toBlob(
			(blob) => {
				if (blob) review(new File([blob], captureName('photo', 'jpg'), { type: 'image/jpeg' }));
			},
			'image/jpeg',
			0.92
		);
	}

	/** The stream a recording is made from: the camera drawn as a mirror image, with its sound, or the stream itself. */
	function recordingStream(source: MediaStream): MediaStream {
		const video = videoRef;
		if (!mirrored || !video) return source;
		const canvas = document.createElement('canvas');
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		const context = canvas.getContext('2d');
		if (!context) return source;
		context.setTransform(-1, 0, 0, 1, canvas.width, 0);
		let frame = 0;
		const draw = () => {
			context.drawImage(video, 0, 0);
			frame = requestAnimationFrame(draw);
		};
		draw();
		const output = canvas.captureStream(30);
		source.getAudioTracks().forEach((track) => output.addTrack(track));
		stopMirror = () => {
			cancelAnimationFrame(frame);
			output.getVideoTracks().forEach((track) => track.stop());
		};
		return output;
	}

	function record() {
		if (!stream) return;
		const chunks: Blob[] = [];
		recorder = new MediaRecorder(recordingStream(stream));
		recorder.ondataavailable = (event) => {
			if (event.data.size > 0) chunks.push(event.data);
		};
		recorder.onstop = () => {
			clearInterval(timer);
			stopMirror?.();
			stopMirror = null;
			const type = recorder?.mimeType || chunks[0]?.type || (kind === 'microphone' ? 'audio/webm' : 'video/webm');
			const base = kind === 'microphone' ? 'audio' : kind === 'screen' ? 'screen' : 'video';
			review(new File(chunks, captureName(base, extensionOf(type)), { type: type.split(';')[0] }));
			recorder = null;
		};
		recorder.start();
		elapsed = 0;
		timer = setInterval(() => elapsed++, 1000);
		phase = 'recording';
	}

	function stop() {
		recorder?.stop();
	}

	async function switchCamera() {
		facing = facing === 'user' ? 'environment' : 'user';
		await start();
	}

	function add() {
		if (!result) return;
		const { file } = result;
		onAdd(file);
	}

	onMount(() => {
		// The screen picker needs a press of its own; the camera and the microphone ask right away.
		if (kind !== 'screen') void start();
		return () => {
			if (recorder?.state === 'recording') {
				recorder.onstop = null;
				recorder.stop();
			}
			release();
		};
	});
</script>

<div class="fs-file-uploader-capture">
	{#if phase === 'idle'}
		<div class="placeholder">
			<ShareScreenStartRegular class="placeholder-icon" aria-hidden="true" />
			<Button type="button" appearance="accent" onclick={start}>{labels.shareScreen}</Button>
		</div>
	{:else if phase === 'starting'}
		<div class="placeholder">
			<ProgressRing size={32} aria-label={labels.loading} />
		</div>
	{:else if phase === 'error'}
		<div class="placeholder">
			<span class="error" role="alert">{message}</span>
			<Button type="button" onclick={start}>{labels.retake}</Button>
		</div>
	{:else if phase === 'review' && result}
		<div class="stage">
			{#if result.file.type.startsWith('image/')}
				<img src={result.url} alt={result.file.name} />
			{:else if result.file.type.startsWith('audio/')}
				<audio src={result.url} controls></audio>
			{:else}
				<!-- svelte-ignore a11y_media_has_caption -->
				<video src={result.url} controls playsinline></video>
			{/if}
		</div>
		<div class="controls">
			<Button type="button" onclick={start}>{labels.retake}</Button>
			<Button type="button" appearance="accent" onclick={add}>{labels.add}</Button>
		</div>
	{:else}
		<div class="stage">
			{#if showsVideo}
				<video bind:this={videoRef} autoplay muted playsinline class:mirrored></video>
			{:else}
				<MicRegular class="placeholder-icon" aria-hidden="true" />
			{/if}
			{#if phase === 'recording'}
				<span class="clock" role="timer">{clock}</span>
			{/if}
		</div>
		<div class="controls">
			{#if kind === 'camera' && canSwitch && phase === 'live'}
				<Button type="button" appearance="subtle" aria-label={labels.switchCamera} onclick={switchCamera}>
					<CameraSwitchRegular />
				</Button>
			{/if}
			{#if showsVideo && phase === 'live'}
				<Button type="button" onclick={takePhoto}>
					<CameraRegular />
					{labels.takePhoto}
				</Button>
			{/if}
			{#if phase === 'recording'}
				<Button type="button" appearance="accent" onclick={stop}>
					<RecordStopRegular />
					{labels.stop}
				</Button>
			{:else}
				<Button type="button" appearance="accent" onclick={record}>
					<RecordRegular />
					{labels.record}
				</Button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.fs-file-uploader-capture {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.placeholder,
	.stage {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		position: relative;
		min-block-size: 10rem;
		border-radius: var(--fs-control-border-radius);
		background: var(--fs-control-alt-fill-secondary);
		overflow: hidden;
		text-align: center;
	}

	.stage :is(video, img) {
		display: block;
		inline-size: 100%;
		max-block-size: 20rem;
		object-fit: contain;
		background: #000;
	}

	.stage audio {
		inline-size: min(100%, 24rem);
	}

	.mirrored {
		transform: scaleX(-1);
	}

	.placeholder :global(.placeholder-icon),
	.stage :global(.placeholder-icon) {
		font-size: 2.5rem;
		color: var(--fs-text-secondary);
	}

	.clock {
		position: absolute;
		inset-block-start: 0.5rem;
		inset-inline-end: 0.5rem;
		padding: 0.125rem 0.5rem;
		border-radius: var(--fs-control-border-radius);
		background: var(--fs-system-critical);
		color: #fff;
		font-family: var(--fs-font-family-numeric, inherit);
		font-size: var(--fs-caption-font-size);
	}

	.controls {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.5rem;
	}

	.error {
		max-inline-size: 28rem;
		color: var(--fs-system-critical);
	}
</style>
