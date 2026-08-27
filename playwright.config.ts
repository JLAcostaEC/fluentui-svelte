import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: { command: 'npm run build && npm run preview', port: 8788, timeout: 120_000 },
	testMatch: '**/*.e2e.{ts,js}'
});
