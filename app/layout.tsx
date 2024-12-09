import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import { Link } from '@remix-run/react';
export function Layout({ children }: { children?: React.ReactNode }) {
	return (
		<div className="flex min-h-screen flex-col">
			{/* Navbar */}
			<Navbar />

			{/* Main Content */}
			<div className="flex flex-1">
				{/* Page Content */}
				<main className="flex-1">
					<div className="container mx-auto px-6 py-4">{children}</div>
				</main>
			</div>

			{/* Footer */}
			<Footer />
		</div>
	);
}

export function ErrorLayout({
	title,
	description,
}: {
	title?: string;
	description?: string;
}) {
	return (
		<div className="flex h-screen flex-col items-center justify-center bg-gray-100">
			<h2 className="text-2xl font-bold">{title || 'Error'}</h2>
			<p className="mt-2 text-gray-600">
				{description || 'Something went wrong!'}
			</p>
			<Link to="/" className="mt-4 text-blue-500 hover:underline">
				Back to Home
			</Link>
		</div>
	);
}
