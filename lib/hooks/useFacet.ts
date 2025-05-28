import {SearchState, Sort, FilterFacetItem} from '@knaw-huc/faceted-search-react';
import {useQueryClient} from '@tanstack/react-query';
import {fetchFacet} from 'queries/facet';

export default function useFacet(dataset: string, name: string) {
    const queryClient = useQueryClient();

    async function fetchItemsFn(state: SearchState, _selected: string[], textFilter?: string, sort?: Sort): Promise<FilterFacetItem[]> {
        const results = await fetchFacet(queryClient, dataset, {
            name,
            amount: 100,
            filter: textFilter || '',
            sort: sort || 'hits',
            facets: state.facetValues,
        });

        return results.map(result => ({
            itemKey: name,
            label: result.value,
            amount: result.count
        }));
    }

    return {fetchItemsFn};
}
