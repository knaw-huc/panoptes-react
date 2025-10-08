import {QueryClient, queryOptions} from '@tanstack/react-query';

export interface SearchRequest {
    offset: number;
    limit: number;
    query: string;
    facets: Record<string, string[]>;
}

export interface SearchResponse {
    amount: number;
    items: SearchResponseItem[];
}

export interface SearchResponseItem {
    id: string;
    title: string;
    description: string;
    tags: string[];
}

export function getSearchQueryOptions(api: string, dataset: string, request: SearchRequest) {
    return queryOptions({
        queryKey: ['search', api, dataset, request.query, request.facets, request.offset, request.limit],
        staleTime: 1000 * 60, // 1 minute
        queryFn: () => search(api, dataset, request),
    });
}

export async function fetchSearch(api: string, queryClient: QueryClient, dataset: string, request: SearchRequest) {
    return queryClient.fetchQuery(getSearchQueryOptions(api, dataset, request));
}

async function search(api: string, dataset: string, request: SearchRequest): Promise<SearchResponse> {
    const result = await fetch(`${api}/api/datasets/${dataset}/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    });

    if (!result.ok) {
        throw new Error(`Failed to search in dataset ${dataset}!`);
    }

    return result.json();
}
