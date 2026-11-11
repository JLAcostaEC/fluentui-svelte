/**
 * A storage that lives in the page, for the live upload demos of the docs: nothing is sent anywhere.
 *
 * upup asks `uploadEndpoint` for a presigned URL with `fetch`, then sends the file to it with `XMLHttpRequest`.
 * While a demo is mounted, both answer the demo URLs themselves, with a progress that takes a few seconds,
 * and leave every other request to the browser. About one upload in four fails, to show the retry.
 */

/** The `uploadEndpoint` of the demos. The `.invalid` domain never resolves: nothing leaves the page, even unpatched. */
export const DEMO_UPLOAD_ENDPOINT = 'https://storage.invalid/upload-token';
const DEMO_STORAGE = 'https://storage.invalid/files/';

let users = 0;
let restore: (() => void) | null = null;

const urlOf = (input: RequestInfo | URL) =>
	typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;

function install() {
	const realFetch = window.fetch;
	const RealXHR = window.XMLHttpRequest;

	window.fetch = async (input, init) => {
		if (urlOf(input) !== DEMO_UPLOAD_ENDPOINT) return realFetch(input, init);
		const { name } = JSON.parse(String(init?.body ?? '{}')) as { name?: string };
		await new Promise((resolve) => setTimeout(resolve, 300));
		const key = `demo/${crypto.randomUUID().slice(0, 8)}-${name}`;
		return Response.json({ key, uploadUrl: DEMO_STORAGE + encodeURIComponent(key) });
	};

	class DemoXHR extends RealXHR {
		#demo = false;
		#status = 0;
		#timer: ReturnType<typeof setInterval> | undefined;

		open(method: string, url: string | URL, ...rest: [boolean?, string?, string?]) {
			this.#demo = String(url).startsWith(DEMO_STORAGE);
			if (!this.#demo) super.open(method, url, ...(rest as [boolean, string?, string?]));
		}
		setRequestHeader(name: string, value: string) {
			if (!this.#demo) super.setRequestHeader(name, value);
		}
		get status() {
			return this.#demo ? this.#status : super.status;
		}
		get statusText() {
			return this.#demo ? (this.#status === 200 ? 'OK' : 'Internal Server Error') : super.statusText;
		}
		get responseText() {
			return this.#demo ? '' : super.responseText;
		}
		getAllResponseHeaders() {
			return this.#demo ? 'etag: "demo"\r\n' : super.getAllResponseHeaders();
		}
		abort() {
			if (!this.#demo) return super.abort();
			clearInterval(this.#timer);
			this.dispatchEvent(new ProgressEvent('abort'));
		}
		send(body?: Document | XMLHttpRequestBodyInit | null) {
			if (!this.#demo) return super.send(body);
			const total = body instanceof Blob ? body.size : 1;
			const fails = Math.random() < 0.25;
			const steps = 15 + Math.floor(Math.random() * 25);
			let step = 0;
			this.#timer = setInterval(() => {
				step++;
				const loaded = Math.min(total, Math.round((total * step) / steps));
				this.upload.dispatchEvent(new ProgressEvent('progress', { lengthComputable: true, loaded, total }));
				if (fails && step >= steps / 2) {
					clearInterval(this.#timer);
					this.#status = 500;
					this.dispatchEvent(new ProgressEvent('load'));
				} else if (step >= steps) {
					clearInterval(this.#timer);
					this.#status = 200;
					this.dispatchEvent(new ProgressEvent('load'));
				}
			}, 120);
		}
	}

	window.XMLHttpRequest = DemoXHR;
	return () => {
		window.fetch = realFetch;
		window.XMLHttpRequest = RealXHR;
	};
}

/** Answers the demo URLs in the page until the returned function is called. Meant for an `$effect`. */
export function useDemoUpload() {
	if (users++ === 0) restore = install();
	return () => {
		if (--users === 0) {
			restore?.();
			restore = null;
		}
	};
}
