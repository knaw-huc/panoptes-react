import {SearchState, Sort, FilterFacetItem} from '@knaw-huc/faceted-search-react';
import {useQueryClient} from '@tanstack/react-query';
import {fetchFacet} from 'queries/facet';
import useDataset from 'hooks/useDataset';
import usePanoptes from 'hooks/usePanoptes';

export default function useFacet(name: string) {
    const queryClient = useQueryClient();
    const {url} = usePanoptes();
    const [dataset] = useDataset('search');

    async function fetchItemsFn(state: SearchState, _selected: string[], textFilter?: string, sort?: Sort): Promise<FilterFacetItem[]> {
        const results = await fetchFacet(url, queryClient, dataset, {
            name,
            amount: 100,
            filter: textFilter || '',
            sort: sort || 'hits',
            facets: state.facetValues,
        });

        return results.map(result => ({
            itemKey: result.value,
            label: result.value,
            amount: result.count
        }));
    }

    return {fetchItemsFn};
}
