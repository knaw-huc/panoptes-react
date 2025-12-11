import {useSuspenseQuery, UseSuspenseQueryResult} from "@tanstack/react-query";
import {usePanoptes} from "hooks/index.ts";
import {DatasetsResponse, getDatasetsQueryOptions} from "../queries/datasets.ts";

/**
 * Gets the datasets available for the current tenant
 */
export default function useDatasets(): UseSuspenseQueryResult<DatasetsResponse> {
    const {url} = usePanoptes();
    return useSuspenseQuery(getDatasetsQueryOptions(url));
}
