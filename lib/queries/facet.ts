import {queryOptions} from '@tanstack/react-query';

export interface FacetRequest {
    name: string;
    amount: number;
    filter: string;
    sort: 'asc' | 'desc' | 'hits';
    facets: Record<string, string[]>;
}

export interface FacetResult {
    name?: string;
    value: string;
    count: number;
    children?: FacetResult[];
}

export function getFacetQueryOptions(api: string, dataset: string, request: FacetRequest) {
    return queryOptions({
        queryKey: ['facet', api, dataset, request.name, request.amount, request.filter, request.sort, request.facets],
        staleTime: 1000 * 60 * 5, // 5 minutes
        queryFn: () => facet(api, dataset, request),
    });
}

async function facet(api: string, dataset: string, request: FacetRequest): Promise<FacetResult[]> {
    const response = await fetch(`${api}/api/datasets/${dataset}/facet/${request.name}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    });

    if (!response.ok) {
        throw new Error(`Unable to fetch facet results for dataset ${dataset}!`);
    }

    return response.json();
}
