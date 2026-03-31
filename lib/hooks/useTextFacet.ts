import {useEffect} from 'react';
import {
    FilterFacetItem,
    useHookedFilterFacet,
    useUpdateFacetValueLabels,
    useSearchState
} from '@knaw-huc/faceted-search-react';
import {useSuspenseQuery} from '@tanstack/react-query';
import {getFacetQueryOptions, TextFacetResult} from 'queries/facet';
import useDataset from 'hooks/useDataset';
import usePanoptes from 'hooks/usePanoptes';

const mapFacetResultsToValueLabels = (results: TextFacetResult[]): Record<string, string> => results.reduce<Record<string, string>>((acc, result) => {
    if (result.name) {
        acc[result.value] = result.name;
    }
    if (result.children) {
        Object.assign(acc, mapFacetResultsToValueLabels(result.children));
    }
    return acc;
}, {});

const mapFacetResultsToItems = (results: TextFacetResult[]): FilterFacetItem[] => results.map(result => ({
    itemKey: result.value,
    label: result.name || result.value,
    amount: result.count,
    children: result.children ? mapFacetResultsToItems(result.children) : [],
}));

export default function useTextFacet(name: string) {
    const {url} = usePanoptes();
    const state = useSearchState();
    const updateFacetValueLabels = useUpdateFacetValueLabels(name);
    const {textFilter, sort} = useHookedFilterFacet();
    const [dataset] = useDataset('search');
    const {data} = useSuspenseQuery(getFacetQueryOptions(url, dataset, {
        name,
        amount: 100,
        filter: textFilter || '',
        sort: sort || 'hits',
        query: state.query,
        facets: state.facetValues,
    }));
    const facetResults = data as TextFacetResult[];

    useEffect(() => {
        const valueLabels = mapFacetResultsToValueLabels(facetResults);
        updateFacetValueLabels(valueLabels);
    }, [facetResults, updateFacetValueLabels]);

    return {items: mapFacetResultsToItems(facetResults)};
}
