"use client";

import { useQuery } from "@tanstack/react-query";
import { getMe, type AuthUser } from "@/services/auth.service";

/** Fetch the currently authenticated user */
export function useAuth() {
	return useQuery<AuthUser>({
		queryKey: ["auth", "me"],
		queryFn: getMe,
		staleTime: 1000 * 60 * 10, // 10 min
		retry: 1,
	});
}
