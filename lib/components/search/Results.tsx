import type {Key} from 'react';
import {useRouter} from '@tanstack/react-router';
import {HookedResultsView} from '@knaw-huc/faceted-search-react';
import useSearch from 'hooks/useSearch';
import useDataset from 'hooks/useDataset';
import usePanoptes from 'hooks/usePanoptes';

export default function Results<R extends object = object>({id}: { id?: (item: R) => Key }) {
    const router = useRouter();
    const [dataset] = useDataset();
    const {detailPath, resultCardRenderer} = usePanoptes();

    // @ts-expect-error TODO: Assume `id` exists if not passed to component
    const resolveId = id ?? ((item: R) => item.id as Key);

    return (
        <HookedResultsView<R> useResults={useSearch} id={resolveId}>
            {result => resultCardRenderer(result, router.buildLocation({
                to: detailPath,
                params: {dataset, id: resolveId(result)}
            }).href)}
        </HookedResultsView>
    );
}
