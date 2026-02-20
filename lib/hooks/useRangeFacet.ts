import {useMemo} from 'react';
import {useSearchState} from '@knaw-huc/faceted-search-react';
import {useSuspenseQuery} from '@tanstack/react-query';
import {getFacetQueryOptions} from 'queries/facet';
import useDataset from 'hooks/useDataset';
import usePanoptes from 'hooks/usePanoptes';

export default function useRangeFacet(name: string) {
    const {url} = usePanoptes();
    const state = useSearchState();
    const [dataset] = useDataset('search');
    const {data: facetResults} = useSuspenseQuery(getFacetQueryOptions(url, dataset, {
        name,
        amount: 100,
        filter: '',
        sort: 'hits',
        facets: state.facetValues,
    }));
    const ranges = useMemo(() => facetResults.reduce<Record<string, number>>((acc, cur) => ({
        ...acc,
        [cur.value]: cur.count
    }), {}), [facetResults]);

    return {ranges};
}
