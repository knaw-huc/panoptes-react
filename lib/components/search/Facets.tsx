import {
    FacetsSection,
    HookedSearchFacet,
    HookedNumericRangeFacet,
    HookedDateRangeFacet,
    HookedFilterFacet,
    HookedFilterFacetItems
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
                <HistogramFacetRendering facet={facet as HistogramFacet} type={'numeric'}/>
            );
        case 'date':
            return <HistogramFacetRendering facet={facet as HistogramFacet} type={'date'}/>
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

function HistogramFacetRendering({facet, type = 'numeric'}: { facet: HistogramFacet, type: string }) {
    const {ranges} = useRangeFacet(facet.property);
    const sortedKeys = Object.keys(ranges).sort();
    const items = Object.entries(ranges).map(([year, amount]) => ({
        year: parseInt(year),
        amount
    }));

    if (type == 'numeric') {
        return (
            <HookedNumericRangeFacet facetKey={facet.property}
                                     min={parseInt(sortedKeys[0])}
                                     max={parseInt(sortedKeys[sortedKeys.length - 1])}
                                     items={items}
                                     step={1}/>
        );
    }
    if (type == 'date') {
        return (
            <HookedDateRangeFacet facetKey={facet.property}
                                     min={sortedKeys[0]}
                                     max={sortedKeys[sortedKeys.length - 1]}
                                     items={items}
                                     />
        );
    }
}