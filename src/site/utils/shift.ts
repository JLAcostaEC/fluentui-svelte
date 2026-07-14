import { createNoise3D, type NoiseFunction3D } from 'simplex-noise';

const circleCount = 150;
const circlePropCount = 8;
const circlePropsLength = circleCount * circlePropCount;
const baseSpeed = 0.05;
const rangeSpeed = 1;
const baseTTL = 150;
const rangeTTL = 200;
const baseRadius = 100;
const rangeRadius = 200;
const rangeHue = 20;
const xOff = 0.0015;
const yOff = 0.0015;
const zOff = 0.0015;
const backgroundColor = 'hsla(0,0%,5%,1)';

const { PI, cos, sin, abs, random } = Math;
const TAU = 2 * PI;
const rand = (n: number) => n * random();
const fadeInOut = (t: number, m: number) => {
	const hm = 0.5 * m;
	return abs(((t + hm) % m) - hm) / hm;
};

let container: HTMLElement;
let canvas: { a: HTMLCanvasElement; b: HTMLCanvasElement };
let ctx: { a: CanvasRenderingContext2D; b: CanvasRenderingContext2D };
let circleProps: Float32Array;
let baseHue: number;
let animationRequest: number;

export function setup() {
	createCanvas();
	resize();
	initCircles();
	draw();

	function destroy() {
		// Remove any event listeners if you add them in the future
		// Cancel animation frame if needed (draw uses requestAnimationFrame)
		// This will stop the animation loop
		cancelAnimationFrame(animationRequest);
		// Reset references to initial state
		container = null as unknown as HTMLElement;
		canvas = null as unknown as { a: HTMLCanvasElement; b: HTMLCanvasElement };
		ctx = null as unknown as { a: CanvasRenderingContext2D; b: CanvasRenderingContext2D };
		circleProps = null as unknown as Float32Array;
	}
	return destroy;
}

function initCircles() {
	circleProps = new Float32Array(circlePropsLength);
	baseHue = 220;

	for (let i = 0; i < circlePropsLength; i += circlePropCount) {
		initCircle(i);
	}
}

function initCircle(i: number) {
	const noise: NoiseFunction3D = createNoise3D();

	const x = rand(canvas.a.width);
	const y = rand(canvas.a.height);
	const n = noise(x * xOff, y * yOff, baseHue * zOff);
	const t = rand(TAU);
	const speed = baseSpeed + rand(rangeSpeed);
	const vx = speed * cos(t);
	const vy = speed * sin(t);
	const life = 0;
	const ttl = baseTTL + rand(rangeTTL);
	const radius = baseRadius + rand(rangeRadius);
	const hue = baseHue + n * rangeHue;

	circleProps.set([x, y, vx, vy, life, ttl, radius, hue], i);
}

function updateCircles() {
	baseHue++;

	for (let i = 0; i < circlePropsLength; i += circlePropCount) {
		updateCircle(i);
	}
}

function updateCircle(i: number) {
	const i2 = 1 + i,
		i3 = 2 + i,
		i4 = 3 + i,
		i5 = 4 + i,
		i6 = 5 + i,
		i7 = 6 + i,
		i8 = 7 + i;

	const x = circleProps[i];
	const y = circleProps[i2];
	const vx = circleProps[i3];
	const vy = circleProps[i4];
	let life = circleProps[i5];
	const ttl = circleProps[i6];
	const radius = circleProps[i7];
	const hue = circleProps[i8];

	drawCircle(x, y, life, ttl, radius, hue);

	life++;

	circleProps[i] = x + vx;
	circleProps[i2] = y + vy;
	circleProps[i5] = life;

	if (checkBounds(x, y, radius) || life > ttl) initCircle(i);
}

function drawCircle(x: number, y: number, life: number, ttl: number, radius: number, hue: number) {
	ctx.a.save();
	ctx.a.fillStyle = `hsla(${hue},60%,30%,${fadeInOut(life, ttl)})`;
	ctx.a.beginPath();
	ctx.a.arc(x, y, radius, 0, TAU);
	ctx.a.fill();
	ctx.a.closePath();
	ctx.a.restore();
}

function checkBounds(x: number, y: number, radius: number): boolean {
	return x < -radius || x > canvas.a.width + radius || y < -radius || y > canvas.a.height + radius;
}

function createCanvas() {
	container = document.querySelector('.bg-effect') as HTMLElement;
	canvas = {
		a: document.createElement('canvas'),
		b: document.createElement('canvas')
	};
	canvas.b.style.position = 'fixed';
	canvas.b.style.top = '0';
	canvas.b.style.left = '0';
	canvas.b.style.width = '100%';
	canvas.b.style.height = '100%';
	container.appendChild(canvas.b);
	ctx = {
		a: canvas.a.getContext('2d') as CanvasRenderingContext2D,
		b: canvas.b.getContext('2d') as CanvasRenderingContext2D
	};
}

export function resize() {
	const { innerWidth, innerHeight } = window;

	canvas.a.width = innerWidth;
	canvas.a.height = innerHeight;

	ctx.a.drawImage(canvas.b, 0, 0);

	canvas.b.width = innerWidth;
	canvas.b.height = innerHeight;

	ctx.b.drawImage(canvas.a, 0, 0);
}

function render() {
	ctx.b.save();
	ctx.b.filter = 'blur(50px)';
	ctx.b.drawImage(canvas.a, 0, 0);
	ctx.b.restore();
}

function draw() {
	ctx.a.clearRect(0, 0, canvas.a.width, canvas.a.height);
	ctx.b.fillStyle = backgroundColor;
	ctx.b.fillRect(0, 0, canvas.b.width, canvas.b.height);
	updateCircles();
	render();
	animationRequest = window.requestAnimationFrame(draw);
}
