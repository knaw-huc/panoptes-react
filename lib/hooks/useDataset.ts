import {useParams} from '@tanstack/react-router';
import usePanoptes from 'hooks/usePanoptes';

export default function useDataset(source: 'search' | 'detail'): [string, string | undefined] {
    const {dataset: staticDataset, searchPath, detailPath} = usePanoptes();
    const {dataset: urlDataset, id} = useParams({from: source === 'search' ? searchPath : detailPath});

    return [urlDataset || staticDataset, id];
}
