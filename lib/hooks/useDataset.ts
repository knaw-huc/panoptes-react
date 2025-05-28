import {useParams} from '@tanstack/react-router';

export default function useDataset(route: string) {
    const {dataset} = useParams({from: route});
    return {dataset};
}
