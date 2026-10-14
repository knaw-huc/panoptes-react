import {useSuspenseInfiniteQuery} from '@tanstack/react-query';
import {type SearchState} from '@knaw-huc/faceted-search-react';
import {getSearchInfiniteQueryOptions, type SearchResponse} from 'queries/search';
import useDataset from 'hooks/useDataset';
import usePanoptes from 'hooks/usePanoptes';

export interface InfiniteSearchResults<R extends object> {
    items: R[][];
    total: number;
    fetchNextPage: () => void;
    isFetchingNextPage: boolean;
}

export default function useInfiniteSearch<R extends object>(state: SearchState): InfiniteSearchResults<R> {
    const [dataset] = useDataset();
    const {url, pageSize} = usePanoptes();

    const {
        data: {pages},
        fetchNextPage,
        isFetchingNextPage,
    } = useSuspenseInfiniteQuery(getSearchInfiniteQueryOptions<R>(url, dataset, {
        query: state.query ?? '',
        facets: state.facetValues,
    }, pageSize));

    return {
        items: (pages as SearchResponse<R>[]).map(p => p.items),
        total: (pages as SearchResponse<R>[])[0].amount,
        fetchNextPage,
        isFetchingNextPage
    };
}
