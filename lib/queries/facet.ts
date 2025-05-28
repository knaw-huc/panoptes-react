import {QueryClient} from '@tanstack/react-query';
import {getPanoptesUrl} from 'utils/panoptesUrl';

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

export function fetchFacet(queryClient: QueryClient, dataset: string, request: FacetRequest) {
    return queryClient.fetchQuery({
        queryKey: ['facet', dataset, request.name, request.amount, request.filter, request.sort, request.facets],
        queryFn: () => facet(dataset, request),
    });
}

async function facet(dataset: string, request: FacetRequest): Promise<FacetValue[]> {
    const response = await fetch(`${getPanoptesUrl()}/datasets/${dataset}/facet`, {
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
