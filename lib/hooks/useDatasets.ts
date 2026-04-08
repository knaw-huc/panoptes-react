import {useSuspenseQuery, UseSuspenseQueryResult} from '@tanstack/react-query';
import {queryOptions} from '@tanstack/react-query';
import usePanoptes from 'hooks/usePanoptes';

export interface DatasetConfiguration {
    id_property: string;
    base_url: string;
    home_url: string;
}

export interface Dataset {
    name: string;
    data_type: string;
    data_configuration: DatasetConfiguration;
}

function getDatasetsQueryOptions(api: string) {
    return queryOptions({
        queryKey: ['datasets', api],
        staleTime: 1000 * 60 * 30, // 30 minutes
        queryFn: () => loadDatasets(api)
    });
}

async function loadDatasets(api: string): Promise<Dataset[]> {
    const response = await fetch(`${api}/api/datasets`);
    if (!response.ok) {
        throw new Error('Unable to fetch datasets!');
    }

    return response.json();
}

export default function useDatasets() : UseSuspenseQueryResult<Dataset[], Error> {
    const {url} = usePanoptes();
    return useSuspenseQuery(getDatasetsQueryOptions(url));
}
