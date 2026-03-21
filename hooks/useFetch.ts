"use client";

import { useEffect, useState } from "react";

/**
 * Generic hook for fetching data from placeholder API functions.
 */
export function useFetch<T>(fetcher: () => Promise<T>) {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		fetcher()
			.then((res) => {
				if (!cancelled) setData(res);
			})
			.catch((err: unknown) => {
				if (!cancelled)
					setError(err instanceof Error ? err.message : "Unknown error");
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});
		return () => {
			cancelled = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return { data, loading, error };
}
