"use client";

import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

/** Resolve relative paths (e.g. /uploads/...) against the API base */
function resolveUrl(url: string): string {
	if (/^https?:\/\//i.test(url)) return url; // already absolute
	// API_BASE is e.g. "http://localhost:4000/api" — strip the /api suffix
	const origin = API_BASE.replace(/\/api\/?$/, "");
	return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
}

/** Check whether the URL points to an image file */
function isImageUrl(url: string): boolean {
	return /\.(png|jpe?g|gif|webp|svg|bmp)$/i.test(url);
}

interface FilePreviewProps {
	/** URL of the existing remote file */
	url: string;
	/** Label shown above the preview (defaults to "Attached File") */
	label?: string;
}

/**
 * Previews a remote file.
 * – Images are rendered as thumbnails with a fallback on error.
 * – Other files show a generic icon with a "View File" link.
 */
export default function FilePreview({
	url,
	label = "Attached File",
}: FilePreviewProps) {
	const [imgError, setImgError] = useState(false);
	const resolved = resolveUrl(url);
	const isImage = isImageUrl(url);

	return (
		<div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
			<p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
				{label}
			</p>

			{/* Image thumbnail */}
			{isImage && !imgError ? (
				<a href={resolved} target="_blank" rel="noopener noreferrer">
					<img
						src={resolved}
						alt="Expense bill"
						onError={() => setImgError(true)}
						className="max-h-40 rounded border border-gray-200 object-contain"
					/>
				</a>
			) : (
				/* Non-image or broken image fallback */
				<div className="flex items-center gap-2 text-sm text-gray-600">
					<span className="text-lg">{imgError ? "⚠️" : "📄"}</span>
					{imgError ? (
						<span className="text-gray-400">
							File could not be loaded — it may have been removed.
						</span>
					) : (
						<a
							href={resolved}
							target="_blank"
							rel="noopener noreferrer"
							className="font-medium text-green-700 underline hover:text-green-900"
						>
							View File ↗
						</a>
					)}
				</div>
			)}

			{/* Always show "View File" link below the image (unless broken) */}
			{isImage && !imgError && (
				<a
					href={resolved}
					target="_blank"
					rel="noopener noreferrer"
					className="mt-2 inline-block text-xs font-medium text-green-700 underline hover:text-green-900"
				>
					Open in new tab ↗
				</a>
			)}
		</div>
	);
}
