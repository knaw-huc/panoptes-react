import {FacetsSection, HookedSearchFacet, HookedRangeFacet, HookedFilterFacet} from '@knaw-huc/faceted-search-react';
import {Facet, TextFacet, RangeFacet} from 'queries/facets';
import useFacet from 'hooks/useFacet';
import useFacets from 'hooks/useFacets';

export default function Facets() {
    const {data: facets} = useFacets();

    return (
        <FacetsSection>
            <HookedSearchFacet/>

            {facets.map(facet =>
                <FacetRendering key={facet.property} facet={facet}/>)}
        </FacetsSection>
    );
}

function FacetRendering({facet}: { facet: Facet }) {
    switch (facet.type) {
        case 'range':
            return (
                <RangeFacetRendering facet={facet as RangeFacet}/>
            );
        case 'text':
            return (
                <TextFacetRendering facet={facet as TextFacet}/>
            );
    }
}

function RangeFacetRendering({facet}: { facet: RangeFacet }) {
    return (
        <HookedRangeFacet facetKey={facet.property} min={facet.min} max={facet.max} step={facet.step}/>
    );
}

function TextFacetRendering({facet}: { facet: TextFacet }) {
    const {fetchItemsFn} = useFacet(facet.property);

    return (
        <HookedFilterFacet facetKey={facet.property} fetchItemsFn={fetchItemsFn}/>
    );
}
