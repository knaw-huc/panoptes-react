import {
    FacetsSection,
    HookedSearchFacet,
    HookedNumericRangeFacet,
    HookedDateRangeFacet,
    HookedFilterFacet
} from '@knaw-huc/faceted-search-react';
import {useFacets, useTextFacetItems, useRangeFacet} from 'hooks/index';
import type {Facet, TextFacet, RangeFacet, HistogramFacet, TreeFacet} from 'queries/facets';

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
        case 'tree':
            return (
                <TreeFacetRendering facet={facet as TreeFacet}/>
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
    const {terms} = useRangeFacet(facet.property);
    return (
        <HookedNumericRangeFacet facetKey={facet.property}
                                 min={terms[0].start as number}
                                 max={terms[terms.length - 1].end as number}
                                 startOpen={facet.startOpen}
                                 step={1}/>
    );
}

function TextFacetRendering({facet}: { facet: TextFacet }) {
    return (
        <HookedFilterFacet facetKey={facet.property}
                           startOpen={facet.startOpen}
                           useItems={useTextFacetItems}/>
    );
}

function TreeFacetRendering({facet}: { facet: TreeFacet }) {
    return (
        <HookedFilterFacet facetKey={facet.property}
                           startOpen={facet.startOpen}
                           initialLevels={facet.expand_level}
                           useItems={useTextFacetItems}/>
    );
}

function HistogramFacetRendering({facet, type = 'numeric'}: { facet: HistogramFacet, type: string }) {
    const {terms} = useRangeFacet(facet.property);

    if (type == 'numeric') {
        return (
            <HookedNumericRangeFacet facetKey={facet.property}
                                     min={terms[0].start as number}
                                     max={terms[terms.length - 1].end as number}
                                     terms={terms}
                                     startOpen={facet.startOpen}
                                     step={1}/>
        );
    }
    if (type == 'date') {
        return (
            <HookedDateRangeFacet facetKey={facet.property}
                                     min={terms[0].start as string}
                                     max={terms[terms.length - 1].end as string}
                                     terms={terms}
                                     startOpen={facet.startOpen}
                                     />
        );
    }
}