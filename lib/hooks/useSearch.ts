import {useSuspenseQuery} from '@tanstack/react-query';
import {getSearchQueryOptions} from 'queries/search';
import useDataset from 'hooks/useDataset';
import usePanoptes from 'hooks/usePanoptes';

import type {SearchResults, SearchState} from '@knaw-huc/faceted-search-react';
import type {SearchResponseItem} from 'queries/search';

export default function useSearch(state: SearchState): SearchResults<SearchResponseItem> {
    const [dataset] = useDataset();
    const {url, pageSize} = usePanoptes();
    const {data: {items, amount}} = useSuspenseQuery(getSearchQueryOptions(url, dataset, {
        offset: pageSize * (state.page - 1),
        limit: pageSize,
        query: state.query || '',
        facets: state.facetValues,
    }));

    return {items, total: amount};
}
