import { defineConfig, devices } from '@playwright/test';

const PORT = process.env.PORT || '5173';

export default defineConfig({
	testDir: './tests/e2e',
	timeout: 15 * 1000,
	expect: {
		timeout: 5 * 1000,
	},
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',
	use: {
		baseURL: `http://localhost:${PORT}`,
		trace: 'on-first-retry',
		// Add the headless configuration here
		headless: true, // Enable headless mode
	},

	projects: [
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
				// Optionally set headless for this project as well
				headless: true, // Ensure it's in headless mode for this project
			},
		},
	],
});
