import { useQuery } from "@tanstack/react-query"
import { api } from "@/api/apiClient"
import type { Salesmen } from "@/types"

export const salesmenQueryOptions = (includeInactive = false) => ({
    queryKey: ['salesmen', { includeInactive }],
    queryFn: async (): Promise<Salesmen> => {
        const res = await api.GET("/salesmen", {
            params: { query: { include_inactive: includeInactive } }
        })
        if (res.error) throw new Error("Failed to fetch salesmen")
        return res.data["items"]
    }
})

export function useSalesmen(includeInactive = false) {
    return useQuery(salesmenQueryOptions(includeInactive))
}
