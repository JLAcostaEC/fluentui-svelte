import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'pnpm build:site && pnpm preview --port 4173',
		port: 4173,
		timeout: 300_000
	},
	testMatch: '**/*.e2e.{ts,js}'
});
