"use client"

import useSWR from "swr"
import { apiGet } from "@/lib/api"

// Generic SWR hook for GET requests
export function useApi<T>(url: string | null) {
  return useSWR<T>(url, apiGet, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    errorRetryCount: 3,
  })
}

// Hook for user data
export function useUser() {
  return useApi<{ id: string; name: string; email: string }>("/user/profile")
}

// Hook for posts data
export function usePosts() {
  return useApi<Array<{ id: string; title: string; content: string }>>("/posts")
}

// Hook for specific post
export function usePost(id: string | null) {
  return useApi<{ id: string; title: string; content: string }>(id ? `/posts/${id}` : null)
}
