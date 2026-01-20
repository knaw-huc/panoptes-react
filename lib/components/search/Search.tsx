import {FacetedSearch, HookedSelectedFacets, HookedPagination} from '@knaw-huc/faceted-search-react';
import useSearch from 'hooks/useSearch';
import useDataset from 'hooks/useDataset';
import Facets from './Facets';
import Results from './Results';
import classes from './Search.module.css';
import usePanoptes from "hooks/usePanoptes.ts";

export default function Search() {
    const [dataset] = useDataset('search');
    const {searchFn, facets, pageSize} = useSearch(dataset);
    const {translateFn} = usePanoptes();

    return (
        <FacetedSearch facets={facets} searchFn={searchFn} pageSize={pageSize} translate={translateFn}>
            <div className={classes.search}>
                <SearchFacets/>
                <SearchResults/>
            </div>
        </FacetedSearch>
    );
}

function SearchFacets() {
    return (
        <div className={classes.facets}>
            <Facets/>
        </div>
    );
}

function SearchResults() {
    return (
        <div className={classes.results}>
            <HookedSelectedFacets/>
            <Results/>
            <HookedPagination/>
        </div>
    );
}
