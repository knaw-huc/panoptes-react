import {FacetedSearch, HookedSelectedFacets, HookedPagination, I18nProvider} from '@knaw-huc/faceted-search-react';
import useSearch from 'hooks/useSearch';
import useDataset from 'hooks/useDataset';
import Facets from './Facets';
import Results from './Results';
import classes from './Search.module.css';
import useTranslate from "hooks/useTranslate.ts";


export default function Search() {
    const [dataset] = useDataset('search');
    const {searchFn, facets, pageSize} = useSearch(dataset);
    const translate = useTranslate();

    return (
        <I18nProvider translate={translate}>
            <FacetedSearch facets={facets} searchFn={searchFn} pageSize={pageSize}>
                <div className={classes.search}>
                    <SearchFacets/>
                    <SearchResults/>
                </div>
            </FacetedSearch>
        </I18nProvider>
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
