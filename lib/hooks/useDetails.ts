import {useSuspenseQuery, UseSuspenseQueryResult} from '@tanstack/react-query';
import {DetailsResponse, getDetailsQueryOptions} from 'queries/details';
import usePanoptes from 'hooks/usePanoptes';
import useDataset from 'hooks/useDataset';

export default function useDetails(): UseSuspenseQueryResult<DetailsResponse> {
    const {url} = usePanoptes();
    const [dataset, id] = useDataset('detail');

    return useSuspenseQuery(getDetailsQueryOptions(url, dataset, id!));
}
