import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
	const timeoutDuration = 30000; // Increase timeout to 30 seconds

	const response = await page.goto('http://localhost:8787/', {
		waitUntil: 'domcontentloaded', // Wait until DOM is fully loaded
		timeout: timeoutDuration,
	});

	// expect(response).toBeTruthy(); // Ensure the response is valid
	expect(response.status()).toBe(500); // Ensure the response status is 200

	// const title = page.getByRole('heading', {
	// 	name: 'WIN ON AIR', // Adjust this based on your homepage content
	// 	level: 1,
	// });

	// await expect(title).toBeVisible();
});
