import {FacetedSearch, HookedSelectedFacets, HookedPagination} from '@knaw-huc/faceted-search-react';
import useSearch from 'hooks/useSearch';
import useDataset from 'hooks/useDataset';
import Facets from './Facets';
import Results from './Results';
import classes from './Search.module.css';
import {useTranslations} from "../../hooks";
import {get} from "radash";

export default function Search() {
    const [dataset] = useDataset('search');
    const {searchFn, facets, pageSize} = useSearch(dataset);

    return (
        <FacetedSearch facets={facets} searchFn={searchFn} pageSize={pageSize}>
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
    const { data:translations } = useTranslations();

    return (
        <div className={classes.results}>
            <h2 className={classes.title}>{get(translations, 'results', 'Results')}</h2>
            <HookedSelectedFacets/>
            <Results/>
            <HookedPagination/>
        </div>
    );
}
