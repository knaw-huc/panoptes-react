import {QueryClient, queryOptions} from '@tanstack/react-query';

export interface FacetRequest {
    name: string;
    amount: number;
    filter: string;
    sort: 'asc' | 'desc' | 'hits';
    facets: { [key: string]: string[] };
}

export interface FacetValue {
    value: string;
    count: number;
}

export function getFacetQueryOptions(api: string, dataset: string, request: FacetRequest) {
    return queryOptions({
        queryKey: ['facet', api, dataset, request.name, request.amount, request.filter, request.sort, request.facets],
        staleTime: 1000 * 60 * 5, // 5 minutes
        queryFn: () => facet(api, dataset, request),
    });
}

export function fetchFacet(api: string, queryClient: QueryClient, dataset: string, request: FacetRequest) {
    return queryClient.fetchQuery(getFacetQueryOptions(api, dataset, request));
}

async function facet(api: string, dataset: string, request: FacetRequest): Promise<FacetValue[]> {
    const response = await fetch(`${api}/api/datasets/${dataset}/facet`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    });

    if (!response.ok) {
        throw new Error(`Unable to fetch facet values for dataset ${dataset}!`);
    }

    return response.json();
}
