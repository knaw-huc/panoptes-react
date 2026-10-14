import {type FilterFacetItem, type FilterFacetState, useSearchState} from '@knaw-huc/faceted-search-react';
import {useSuspenseQuery} from '@tanstack/react-query';
import {getFacetQueryOptions, type TextFacetResult} from 'queries/facet';
import useDataset from 'hooks/useDataset';
import usePanoptes from 'hooks/usePanoptes';

const mapFacetResultsToItems = (results: TextFacetResult[]): FilterFacetItem[] => results.map(result => ({
    itemKey: result.value,
    label: result.name || result.value,
    amount: result.count,
    children: result.children ? mapFacetResultsToItems(result.children) : [],
}));

export default function useTextFacetItems(facetState: FilterFacetState) {
    const {url} = usePanoptes();
    const [dataset] = useDataset();
    const searchState = useSearchState();
    const {data} = useSuspenseQuery(getFacetQueryOptions(url, dataset, {
        name: facetState.facetKey,
        amount: 100,
        filter: facetState.textFilter,
        sort: facetState.sort,
        query: searchState.query,
        facets: searchState.facetValues,
    }));

    return mapFacetResultsToItems(data as TextFacetResult[]);
}
