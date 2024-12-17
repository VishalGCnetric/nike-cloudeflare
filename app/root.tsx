import {
	createCookie,
	type LinksFunction,
	type LoaderFunctionArgs,
	type MetaFunction,
	type ActionFunctionArgs,
} from '@remix-run/cloudflare';
import * as React from 'react';
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
	json,
	useLoaderData,
	useRouteError,
} from '@remix-run/react';
import stylesUrl from '~/styles.css?url';
import { ErrorLayout, Layout } from './layout';
import { commitSession, getSession } from './utils/cookies';
export const links: LinksFunction = () => {
	return [{ rel: 'stylesheet', href: stylesUrl }];
};

export const meta: MetaFunction = () => {
	return [
		{ charset: 'utf-8' },
		{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
		{ title: 'Nike, Just Do It Nike IN' },
	];
};

// Create cookies to retrieve the token and user

// loader function
export async function loader({ request }: { request: any }) {
	const cookieHeader = request.headers.get('Cookie') || '';
	const session = await getSession(cookieHeader);
	const token = session.get('token'); // Replace 'userId' with the key you use for the token
	console.log(token, 'root');
	// if (!token) {
	//   return json(
	// 	{ error: "Unauthorized" },
	// 	{
	// 	  status: 401,
	// 	}
	//   );
	// }

	return json({
		token,
	});
}

// Action to clear the authToken cookie
export async function action({ request }: ActionFunctionArgs) {
	const session = await getSession(request.headers.get('Cookie'));

	// Set token to null
	session.set('token', null);

	return json(
		{ success: true },
		{
			headers: {
				'Set-Cookie': await commitSession(session),
			},
		},
	);
}

export default function App() {
	const { token } = useLoaderData<typeof loader>();

	return (
		<Document>
			<Layout>
				<Outlet context={{ token }} />
			</Layout>
		</Document>
	);
}

function Document({
	children,
	title,
}: {
	children: React.ReactNode;
	title?: string;
}) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				{title ? <title>{title}</title> : null}
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export function ErrorBoundary() {
	const error = useRouteError();

	// Log the error to the console
	console.error(error);

	if (isRouteErrorResponse(error)) {
		const title = `${error.status} ${error.statusText}`;

		let message;
		switch (error.status) {
			case 401:
				message =
					'Oops! Looks like you tried to visit a page that you do not have access to.';
				break;
			case 404:
				message =
					'Oops! Looks like you tried to visit a page that does not exist.';
				break;
			default:
				message = JSON.stringify(error.data, null, 2);
				break;
		}

		return (
			<Document title={title}>
				<ErrorLayout title={title} description={message} />
			</Document>
		);
	}

	return (
		<Document title="Error!">
			<ErrorLayout title="There was an error" description={`${error}`} />
		</Document>
	);
}
