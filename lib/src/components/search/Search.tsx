import {FacetedSearch, HookedSelectedFacets, HookedPagination, getReadableRange} from '@knaw-huc/faceted-search-react';
import useFacets from 'hooks/useFacets';
import usePanoptes from 'hooks/usePanoptes';
import Facets from './Facets';
import Results from './Results';
import classes from './Search.module.css';

import type {Facets as IFacets} from '@knaw-huc/faceted-search-react';
import type {Facet} from 'queries/facets';

function getValueRenderer(facet: Facet): ((value: string, valueLabel?: string) => string) | undefined {
    switch (facet.type) {
        case 'range':
            return value => getReadableRange(value, false);
    }
}

export default function Search() {
    const {data: registeredFacets} = useFacets();
    const {translateFn, locale, pageSize} = usePanoptes();

    const facets = registeredFacets.reduce<IFacets>((acc, facet) => {
        acc[facet.property] = {
            label: facet.name,
            valueRenderer: getValueRenderer(facet),
        };
        return acc;
    }, {});

    return (
        <FacetedSearch facets={facets} pageSize={pageSize} translate={translateFn} locale={locale}>
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
