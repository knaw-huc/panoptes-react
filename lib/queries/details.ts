import {useSuspenseQuery, UseSuspenseQueryResult} from '@tanstack/react-query';
import {getPanoptesUrl} from 'utils/panoptesUrl';
import CmdiRecord from 'interfaces/cmdi.ts';

export interface DetailsResponse {
    item_id: string;
    item_data: Block[];
}

export interface Block {
   type: string;
   value: string | object | Block[];
}

export interface CmdiBlock extends Block {
    type: 'cmdi';
    value: CmdiRecord[];
}

export function useDetails(dataset: string, identifier: string): UseSuspenseQueryResult<DetailsResponse> {
    return useSuspenseQuery({
        queryKey: ['details', dataset, identifier],
        staleTime: 1000 * 60 * 5, // 5 minutes
        queryFn: () => details(dataset, identifier),
    });
}

async function details(dataset: string, identifier: string): Promise<DetailsResponse> {
    const result = await fetch(`${getPanoptesUrl()}/api/datasets/${dataset}/details/${identifier}`);

    if (!result.ok) {
        throw new Error(`Failed to obtain details for ${identifier} in dataset ${dataset}!`);
    }

    return result.json();
}
