import { test as baseTest, expect as baseExpect } from '@playwright/test';
import { type ViteDevServer, createServer } from 'vite';
import { type SetupServer, setupServer } from 'msw/node';
import { type PlatformProxy, getPlatformProxy } from 'wrangler';
import { chromium, Browser, Page, BrowserContext } from 'playwright';

// interface TestFixtures {}

interface WorkerFixtures {
	port: number;
	wrangler: PlatformProxy<Env>;
	server: ViteDevServer;
	msw: SetupServer;
	browser: Browser;
	context: BrowserContext;
	page: Page;
}

export async function clearKV(namespace: KVNamespace): Promise<void> {
	const result = await namespace.list();

	await Promise.all(result.keys.map(key => namespace.delete(key.name)));
}

export const expect = baseExpect.extend({});

export const test = baseTest.extend<any, WorkerFixtures>({
	// Assign a unique "port" for each worker process
	port: [
		async ({}, use, workerInfo) => {
			await use(8787 + workerInfo.workerIndex);
		},
		{ scope: 'worker' },
	],

	// Ensure visits work with relative path
	baseURL: ({ port }, use) => {
		use(`http://localhost:${port}`);
	},

	// Start a Vite dev server for each worker
	// This allows MSW to intercept requests properly
	server: [
		async ({ port }, use) => {
			const server = await createServer({
				configFile: './vite.config.ts',
			});

			await server.listen(port);

			await use(server);

			await server.close();
		},
		{ scope: 'worker', auto: true },
	],

	msw: [
		async ({}, use) => {
			const server = setupServer();

			server.listen();

			await use(server);

			server.close();
		},
		{ scope: 'worker', auto: true },
	],

	// To access wrangler bindings similar to Remix / Vite
	wrangler: [
		async ({}, use) => {
			const wrangler = await getPlatformProxy<Env>();

			// To access bindings in the tests.
			await use(wrangler);

			// Ensure all caches are cleaned up
			await clearKV(wrangler.env.cache);

			await wrangler.dispose();
		},
		{ scope: 'worker', auto: true },
	],

	// Include Playwright Browser setup
	browser: [
		async ({}, use) => {
			const browser = await chromium.launch({ headless: true });
			await use(browser);
			await browser.close();
		},
		{ scope: 'worker', auto: true },
	],

	// Create a new browser context for each test
	context: [
		async ({ browser }, use) => {
			const context = await browser.newContext();
			await use(context);
			await context.close();
		},
		{ scope: 'test' },
	],

	// Create a new page for each test
	page: [
		async ({ context }, use) => {
			const page = await context.newPage();
			await use(page);
			await page.close();
		},
		{ scope: 'test' },
	],
});

test.beforeEach(({ msw }) => {
	msw.resetHandlers();
});
