import {useParams} from '@tanstack/react-router';
import usePanoptes from 'hooks/usePanoptes';

export default function useDataset(): [string, string | undefined] {
    const {dataset} = usePanoptes();
    const params = useParams({strict: false});

    return [dataset ?? params.dataset, params.id];
}
