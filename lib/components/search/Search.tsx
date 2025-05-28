import {
    FacetedSearch,
    HookedSelectedFacets,
    HookedResultsView,
    HookedPagination,
    ResultCardBasic
} from '@knaw-huc/faceted-search-react';
import Facets from './Facets';
import useSearch from 'hooks/useSearch';
import useDataset from 'hooks/useDataset';
import classes from './Search.module.css';

export default function Search() {
    const {dataset} = useDataset('/$dataset');
    const {searchFn, pageSize} = useSearch(dataset);

    return (
        <FacetedSearch searchFn={searchFn} pageSize={pageSize}>
            <div className={classes.search}>
                <div className={classes.facets}>
                    <Facets/>
                </div>

                <div className={classes.results}>
                    <h2 className={classes.title}>Results</h2>

                    <HookedSelectedFacets/>
                    <HookedResultsView idKey="title" ResultComponent={ResultCardBasic}/>
                    <HookedPagination/>
                </div>
            </div>
        </FacetedSearch>
    );
}
