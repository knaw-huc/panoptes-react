import {queryOptions} from '@tanstack/react-query';
import {Block} from 'components/blocks';

export interface DetailsResponse {
    item_id: string;
    item_data: Block[];
}

export function getDetailsQueryOptions(api: string, dataset: string, identifier: string) {
    return queryOptions({
        queryKey: ['details', api, dataset, identifier],
        staleTime: 1000 * 60 * 5, // 5 minutes
        queryFn: () => details(api, dataset, identifier),
    });
}

async function details(api: string, dataset: string, identifier: string): Promise<DetailsResponse> {
    const result = await fetch(`${api}/api/datasets/${dataset}/details/${identifier}`);

    if (!result.ok) {
        throw new Error(`Failed to obtain details for ${identifier} in dataset ${dataset}!`);
    }

    return result.json();
}
