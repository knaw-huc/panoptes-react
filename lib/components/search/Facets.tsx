import {
    FacetsSection,
    HookedSearchFacet,
    HookedNumericRangeFacet,
    HookedFilterFacet,
    HookedFilterFacetItems,
    Histogram
} from '@knaw-huc/faceted-search-react';
import {Facet, TextFacet, RangeFacet, HistogramFacet} from 'queries/facets';
import {useFacets, useTextFacet, useRangeFacet} from 'hooks/index';

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
        case 'histogram':
            return (
                <HistogramFacetRendering facet={facet as HistogramFacet}/>
            );
    }
}

function RangeFacetRendering({facet}: { facet: RangeFacet }) {
    const {ranges} = useRangeFacet(facet.property);
    const sortedKeys = Object.keys(ranges).sort();

    return (
        <HookedNumericRangeFacet facetKey={facet.property}
                                 min={parseInt(sortedKeys[0])}
                                 max={parseInt(sortedKeys[sortedKeys.length - 1])}
                                 step={1}/>
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
    const {items} = useTextFacet(name);

    return (
        <HookedFilterFacetItems items={items}/>
    );
}

function HistogramFacetRendering({facet}: { facet: HistogramFacet }) {
    const {ranges} = useRangeFacet(facet.property);
    const sortedKeys = Object.keys(ranges).sort();

    return (
        <HookedNumericRangeFacet facetKey={facet.property}
                                 min={parseInt(sortedKeys[0])}
                                 max={parseInt(sortedKeys[sortedKeys.length - 1])}
                                 step={1}>
            <HistogramRendering facet={facet}/>
        </HookedNumericRangeFacet>
    );
}

function HistogramRendering({facet}: { facet: HistogramFacet }) {
    const {ranges} = useRangeFacet(facet.property);
    const items = Object.entries(ranges).map(([year, amount]) => ({
        year: parseInt(year),
        amount
    }));

    return (
        <Histogram items={items}/>
    );
}
