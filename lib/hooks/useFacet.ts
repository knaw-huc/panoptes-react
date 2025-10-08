import {FilterFacetItem, useHookedFilterFacet, useSearchState} from '@knaw-huc/faceted-search-react';
import {useSuspenseQuery} from '@tanstack/react-query';
import {getFacetQueryOptions, FacetResult} from 'queries/facet';
import useDataset from 'hooks/useDataset';
import usePanoptes from 'hooks/usePanoptes';

const mapFacetResultsToItems = (results: FacetResult[]): FilterFacetItem[] => results.map(result => ({
    itemKey: result.value,
    label: result.name || result.value,
    amount: result.count,
    children: result.children ? mapFacetResultsToItems(result.children) : [],
}));

export default function useFacet(name: string) {
    const {url} = usePanoptes();
    const state = useSearchState();
    const {textFilter, sort} = useHookedFilterFacet();
    const [dataset] = useDataset('search');
    const {data: facetResults} = useSuspenseQuery(getFacetQueryOptions(url, dataset, {
        name,
        amount: 100,
        filter: textFilter || '',
        sort: sort || 'hits',
        facets: state.facetValues,
    }));

    return {items: mapFacetResultsToItems(facetResults)};
}
