import {useSuspenseQuery, type UseSuspenseQueryResult} from '@tanstack/react-query';
import {queryOptions} from '@tanstack/react-query';
import usePanoptes from 'hooks/usePanoptes';

export interface DatasetConfiguration {
    id_property: string;
    base_url: string;
    home_url: string;
}

export interface Dataset<T extends DatasetConfiguration = DatasetConfiguration> {
    name: string;
    data_type: string;
    data_configuration: T;
}

function getDatasetsQueryOptions<T extends DatasetConfiguration>(api: string) {
    return queryOptions({
        queryKey: ['datasets', api],
        staleTime: 1000 * 60 * 30, // 30 minutes
        queryFn: (): Promise<Dataset<T>[]> => loadDatasets<T>(api)
    });
}

async function loadDatasets<T extends DatasetConfiguration>(api: string): Promise<Dataset<T>[]> {
    const response = await fetch(`${api}/api/datasets`);
    if (!response.ok) {
        throw new Error('Unable to fetch datasets!');
    }

    return response.json();
}

export default function useDatasets<T extends DatasetConfiguration = DatasetConfiguration>()
    : UseSuspenseQueryResult<Dataset<T>[], Error> {
    const {url} = usePanoptes();
    return useSuspenseQuery(getDatasetsQueryOptions<T>(url));
}