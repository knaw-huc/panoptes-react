import {
    FacetsSection,
    HookedSearchFacet,
    HookedRangeFacet,
    HookedFilterFacet,
    HookedFilterFacetItems,
    Histogram
} from '@knaw-huc/faceted-search-react';
import {Facet, TextFacet, RangeFacet, HistogramFacet} from 'queries/facets';
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
        case 'histogram':
            return (
                <HistogramFacetRendering facet={facet as HistogramFacet}/>
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

function HistogramFacetRendering({facet}: { facet: HistogramFacet }) {
    return (
        <HookedRangeFacet facetKey={facet.property} min={facet.min} max={facet.max} step={facet.step}>
            <HistogramRendering facet={facet}/>
        </HookedRangeFacet>
    );
}

function HistogramRendering({facet}: { facet: HistogramFacet }) {
    const {items} = useFacet(facet.property);
    const histogramItems = items.map(item => ({year: Number(item.itemKey), amount: item.amount}));

    return (
        <Histogram items={histogramItems}/>
    );
}
