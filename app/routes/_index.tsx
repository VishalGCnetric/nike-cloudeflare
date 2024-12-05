import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json, useLoaderData } from '@remix-run/react';
import { Markdown } from '~/components';
import { getFileContentWithCache } from '~/services/github.server';
import { parse } from '~/services/markdoc.server';

// export async function loader({ context }: LoaderFunctionArgs) {
// 	const content = await getFileContentWithCache(context, 'README.md');

// 	return json(
// 		{
// 			content: parse(content),
// 		},
// 		{
// 			headers: {
// 				'Cache-Control': 'public, max-age=3600',
// 			},
// 		},
// 	);
// }

export default function Index() {
	return (
		<div>
			<h1 className="text-7xl font-bold text-indigo-900">VishalG</h1>
		</div>
	);
}
