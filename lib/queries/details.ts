import {useSuspenseQuery, UseSuspenseQueryResult} from '@tanstack/react-query';
import {getPanoptesUrl} from 'utils/panoptesUrl';

export interface DetailsResponse<B> {
    item_id: string;
    item_data: B;
}

export function useDetails<B>(dataset: string, identifier: string): UseSuspenseQueryResult<DetailsResponse<B>> {
    return useSuspenseQuery({
        queryKey: ['details', dataset, identifier],
        queryFn: () => details(dataset, identifier),
    });
}

async function details<B>(dataset: string, identifier: string): Promise<DetailsResponse<B>> {
    const result = await fetch(`${getPanoptesUrl()}/datasets/${dataset}/details/${identifier}`);

    if (!result.ok) {
        throw new Error(`Failed to obtain details for ${identifier} in dataset ${dataset}!`);
    }

    return result.json();
}
