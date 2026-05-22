import {HookedResultsView} from '@knaw-huc/faceted-search-react';
import {useRouter} from '@tanstack/react-router';
import useDataset from 'hooks/useDataset';
import usePanoptes from 'hooks/usePanoptes';
import type {SearchResponseItem} from 'queries/search';

export default function Results() {
    const router = useRouter();
    const [dataset] = useDataset('search');
    const {detailPath, resultCardRenderer} = usePanoptes();

    return (
        <HookedResultsView<SearchResponseItem> id={result => result.id}>
            {result => resultCardRenderer(result, router.buildLocation({
                to: detailPath,
                params: {dataset, id: result.id}
            }).href)}
        </HookedResultsView>
    );
}
