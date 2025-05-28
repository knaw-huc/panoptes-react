import {SearchResults, SearchState} from '@knaw-huc/faceted-search-react';
import {useQueryClient} from '@tanstack/react-query';
import {fetchSearch, SearchResponseItem} from 'queries/search';

export default function useSearch(dataset: string) {
    const pageSize = 10;
    const queryClient = useQueryClient();

    async function searchFn(state: SearchState): Promise<SearchResults<SearchResponseItem>> {
        const results = await fetchSearch(queryClient, dataset, {
            offset: pageSize * (state.page - 1),
            limit: pageSize,
            query: state.facetValues.q ? state.facetValues.q[0] : '',
            facets: state.facetValues,
        });
        return {items: results.items, total: results.amount};
    }

    return {searchFn, pageSize};
}
