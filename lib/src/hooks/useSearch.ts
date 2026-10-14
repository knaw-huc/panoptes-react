import {useSuspenseQuery} from '@tanstack/react-query';
import type {SearchResults, SearchState} from '@knaw-huc/faceted-search-react';
import {getSearchQueryOptions} from 'queries/search';
import useDataset from 'hooks/useDataset';
import usePanoptes from 'hooks/usePanoptes';

export default function useSearch<R extends object>(state: SearchState): SearchResults<R> {
    const [dataset] = useDataset();
    const {url, pageSize} = usePanoptes();

    const offset = pageSize * (state.page - 1);
    const {data: {items, amount}} = useSuspenseQuery(getSearchQueryOptions<R>(url, dataset, {
        query: state.query ?? '',
        facets: state.facetValues,
    }, offset, pageSize));

    return {items, total: amount};
}
