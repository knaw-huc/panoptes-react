import {useSuspenseQuery} from '@tanstack/react-query';
import {getFacetsQueryOptions} from 'queries/facets';
import usePanoptes from 'hooks/usePanoptes';
import useDataset from 'hooks/useDataset';

export default function useFacets() {
    const {url} = usePanoptes();
    const [dataset] = useDataset('search');

    return useSuspenseQuery(getFacetsQueryOptions(url, dataset));
}
