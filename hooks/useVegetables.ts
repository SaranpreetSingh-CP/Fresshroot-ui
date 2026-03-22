"use client";

import { useQuery } from "@tanstack/react-query";
import {
	getAvailableVegetables,
	type Vegetable,
} from "@/services/vegetable.service";

/** Fetch the list of currently available vegetables */
export function useVegetables() {
	return useQuery<Vegetable[]>({
		queryKey: ["vegetables", "available"],
		queryFn: getAvailableVegetables,
		staleTime: 1000 * 60 * 5, // 5 min
	});
}
