import {useQueryClient} from '@tanstack/react-query';
import {SearchResults, SearchState, Facets, getReadableRange} from '@knaw-huc/faceted-search-react';
import {Facet, useFacets} from 'queries/facets';
import {fetchSearch, SearchResponseItem} from 'queries/search';

function getReadable(facet: Facet): ((value: string) => string) | undefined {
    switch (facet.type) {
        case 'range':
            return getReadableRange;
    }
}

export default function useSearch(dataset: string) {
    const pageSize = 10;
    const queryClient = useQueryClient();

    const {data: registeredFacets} = useFacets(dataset);
    const facets = registeredFacets.reduce<Facets>((acc, facet) => {
        acc[facet.property] = {
            label: facet.name,
            getReadable: getReadable(facet),
        };
        return acc;
    }, {});

    async function searchFn(state: SearchState): Promise<SearchResults<SearchResponseItem>> {
        const results = await fetchSearch(queryClient, dataset, {
            offset: pageSize * (state.page - 1),
            limit: pageSize,
            query: state.query || '',
            facets: state.facetValues,
        });
        return {items: results.items, total: results.amount};
    }

    return {searchFn, facets, pageSize};
}
