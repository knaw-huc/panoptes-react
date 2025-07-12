import {QueryClient} from '@tanstack/react-query';
import {getPanoptesUrl} from 'utils/panoptesUrl';

export interface SearchRequest {
    offset: number;
    limit: number;
    query: string;
    facets: { [key: string]: string[] };
}

export interface SearchResponse {
    amount: number;
    items: SearchResponseItem[];
}

export interface SearchResponseItem {
    item_id: string;
    title: string;
    description: string;
    tags: string[];
}

export async function fetchSearch(queryClient: QueryClient, dataset: string, request: SearchRequest) {
    return queryClient.fetchQuery({
        queryKey: ['search', dataset, request.query, request.facets, request.offset, request.limit],
        staleTime: 1000 * 60, // 1 minute
        queryFn: () => search(dataset, request),
    });
}

async function search(dataset: string, request: SearchRequest): Promise<SearchResponse> {
    const result = await fetch(`${getPanoptesUrl()}/api/datasets/${dataset}/search`, {
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
