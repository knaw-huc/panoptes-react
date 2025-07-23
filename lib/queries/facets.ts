import {queryOptions} from '@tanstack/react-query';

export interface Facet {
    property: string;
    name: string;
    type: 'text' | 'range';
}

export interface TextFacet extends Facet {
    type: 'text';
}

export interface RangeFacet extends Facet {
    type: 'range';
    min: number;
    max: number;
    step: number;
}

export function getFacetsQueryOptions(api: string, dataset: string) {
    return queryOptions({
        queryKey: ['facets', api, dataset],
        staleTime: 1000 * 60 * 30, // 30 minutes
        queryFn: () => loadFacets(api, dataset)
    });
}

async function loadFacets(api: string, dataset: string): Promise<Facet[]> {
    const response = await fetch(`${api}/api/datasets/${dataset}/facets`);
    if (!response.ok) {
        throw new Error(`Unable to fetch facets for dataset ${dataset}!`);
    }

    return response.json();
}
