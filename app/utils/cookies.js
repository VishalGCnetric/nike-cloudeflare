import { createCookieSessionStorage } from '@remix-run/node';

const { getSession, commitSession, destroySession } =
	createCookieSessionStorage({
		cookie: {
			name: '__session',
			httpOnly: true,
			maxAge: 60 * 60 * 24, // 1 day
			path: '/',
			sameSite: 'lax',
			secrets: ['your-secret-key'], // Replace with a secure key
			secure: false, // Set to true in production with HTTPS
		},
	});

export { getSession, commitSession, destroySession };
