import {queryOptions} from "@tanstack/react-query";

export type DatasetResponseItem = {
    name: string;
    data_configuration: Record<string, string>;
}

export type DatasetsResponse = DatasetResponseItem[];

export function getDatasetsQueryOptions(api: string) {
    return queryOptions({
        queryKey: ['tenant', api],
        staleTime: 1000 * 6,
        queryFn: () => datasets(api),
    });
}

async function datasets(api: string): Promise<DatasetsResponse> {
    const result = await fetch(`${api}/api/tenants/current/datasets`);

    if (!result.ok) {
        throw new Error(`Failed to obtain tenant datasets for current tenant!`);
    }

    return result.json();
}
