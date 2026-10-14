import {queryOptions, infiniteQueryOptions} from '@tanstack/react-query';

export interface SearchRequest {
    query: string;
    facets: Record<string, string[]>;
}

export interface SearchResponse<I extends object> {
    amount: number;
    items: I[];
}

export function getSearchQueryOptions<I extends object>(api: string, dataset: string, request: SearchRequest, offset: number = 0, limit: number) {
    return queryOptions({
        queryKey: ['search', api, dataset, request.query, request.facets, offset, limit],
        staleTime: 1000 * 60, // 1 minute
        queryFn: () => search<I>(api, dataset, request, offset, limit),
    });
}

export function getSearchInfiniteQueryOptions<I extends object>(api: string, dataset: string, request: SearchRequest, pageSize: number) {
    return infiniteQueryOptions({
        queryKey: ['search', api, dataset, request.query, request.facets],
        staleTime: 1000 * 60, // 1 minute
        initialPageParam: 0,
        getNextPageParam: (_lastPage, _allPages, lastPageParam) => lastPageParam + 1,
        queryFn: ({pageParam}) => search<I>(api, dataset, request, pageSize * pageParam, pageSize),
    });
}

async function search<I extends object>(api: string, dataset: string, request: SearchRequest, offset: number = 0, limit: number): Promise<SearchResponse<I>> {
    const result = await fetch(`${api}/api/datasets/${dataset}/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...request,
            offset,
            limit,
        }),
    });

    if (!result.ok) {
        throw new Error(`Failed to search in dataset ${dataset}!`);
    }

    return result.json();
}
