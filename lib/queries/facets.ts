import {useSuspenseQuery} from '@tanstack/react-query';
import {getPanoptesUrl} from 'utils/panoptesUrl';

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

export function useFacets(dataset: string) {
    return useSuspenseQuery({
        queryKey: ['facets', dataset],
        staleTime: 1000 * 60 * 30, // 30 minutes
        queryFn: () => loadFacets(dataset)
    });
}

async function loadFacets(dataset: string): Promise<Facet[]> {
    const response = await fetch(`${getPanoptesUrl()}/api/datasets/${dataset}/facets`);
    if (!response.ok) {
        throw new Error(`Unable to fetch facets for dataset ${dataset}!`);
    }

    return response.json();
}
