import {useQueryClient} from '@tanstack/react-query';
import usePanoptes from 'hooks/usePanoptes';
import {fetchSearch} from 'queries/search';

import type {SearchResults, SearchState} from '@knaw-huc/faceted-search-react';
import type {SearchResponseItem} from 'queries/search';

export default function useSearch(dataset: string): (state: SearchState) => Promise<SearchResults<SearchResponseItem>> {
    const queryClient = useQueryClient();
    const {url, pageSize} = usePanoptes();

    return async function searchFn(state: SearchState): Promise<SearchResults<SearchResponseItem>> {
        const results = await fetchSearch(url, queryClient, dataset, {
            offset: pageSize * (state.page - 1),
            limit: pageSize,
            query: state.query || '',
            facets: state.facetValues,
        });
        return {items: results.items, total: results.amount};
    };
}
