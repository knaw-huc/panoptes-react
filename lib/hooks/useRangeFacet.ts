import {useSearchState} from '@knaw-huc/faceted-search-react';
import {useSuspenseQuery} from '@tanstack/react-query';
import {getFacetQueryOptions, RangeFacetResult} from 'queries/facet';
import useDataset from 'hooks/useDataset';
import usePanoptes from 'hooks/usePanoptes';

export default function useRangeFacet(name: string): { terms: RangeFacetResult[] } {
    const {url} = usePanoptes();
    const state = useSearchState();
    const [dataset] = useDataset('search');
    const {data} = useSuspenseQuery(getFacetQueryOptions(url, dataset, {
        name,
        amount: 100,
        filter: '',
        sort: 'hits',
        facets: state.facetValues,
    }));

    return {terms: data as RangeFacetResult[]};
}
