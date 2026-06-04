import {useSuspenseQuery, type UseSuspenseQueryResult} from "@tanstack/react-query";
import {queryOptions} from "@tanstack/react-query";
import usePanoptes from 'hooks/usePanoptes';
import useDataset from "hooks/useDataset.ts";

export interface ResolveResourceResponse {
    url: string;
}

export function getResolveResourceQueryOptions(api: string, dataset: string, resource: string) {
    return queryOptions({
        queryKey: ['resolve', api, dataset],
        staleTime: 1000 * 60 * 60, // 60 minutes
        queryFn: () => resolveResource(api, dataset, resource),
    });
}

async function resolveResource(api: string, dataset: string, resource: string): Promise<ResolveResourceResponse> {
    const result = await fetch(`${api}/api/datasets/${dataset}/resolve`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ resource })
    });

    if (!result.ok) {
        throw new Error(`Failed to obtain url for ${resource} in dataset ${dataset}!`);
    }

    return result.json();
}

export default function useResolveResource(value: string): UseSuspenseQueryResult<ResolveResourceResponse> {
    const {url} = usePanoptes();
    const [dataset] = useDataset('detail');

    return useSuspenseQuery(getResolveResourceQueryOptions(url, dataset, value));
}