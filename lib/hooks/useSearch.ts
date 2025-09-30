import {useQueryClient} from '@tanstack/react-query';
import {SearchResults, SearchState, Facets, getReadableRange} from '@knaw-huc/faceted-search-react';
import useFacets from 'hooks/useFacets';
import usePanoptes from 'hooks/usePanoptes';
import {Facet} from 'queries/facets';
import {fetchSearch, SearchResponseItem} from 'queries/search';

function getReadable(facet: Facet): ((value: string) => string | Promise<string>) | undefined {
    switch (facet.type) {
        case 'range':
            return getReadableRange;
    }
}

export default function useSearch(dataset: string) {
    const pageSize = 10;
    const queryClient = useQueryClient();
    const {url} = usePanoptes();
    const {data: registeredFacets} = useFacets();

    const facets = registeredFacets.reduce<Facets>((acc, facet) => {
        acc[facet.property] = {
            label: facet.name,
            getReadable: getReadable(facet),
        };
        return acc;
    }, {});

    async function searchFn(state: SearchState): Promise<SearchResults<SearchResponseItem>> {
        const results = await fetchSearch(url, queryClient, dataset, {
            offset: pageSize * (state.page - 1),
            limit: pageSize,
            query: state.query || '',
            facets: state.facetValues,
        });
        return {items: results.items, total: results.amount};
    }

    return {searchFn, facets, pageSize};
}
