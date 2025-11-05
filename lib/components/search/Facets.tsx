import {
    FacetsSection,
    HookedSearchFacet,
    HookedRangeFacet,
    HookedFilterFacet,
    HookedFilterFacetItems
} from '@knaw-huc/faceted-search-react';
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
        case 'tree':
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
    return (
        <HookedFilterFacet facetKey={facet.property}>
            <TextFacetItemsRendering name={facet.property}/>
        </HookedFilterFacet>
    );
}

function TextFacetItemsRendering({name}: { name: string }) {
    const {items} = useFacet(name);

    return (
        <HookedFilterFacetItems items={items}/>
    );
}
