import {FacetsSection, HookedSearchFacet, HookedRangeFacet, HookedFilterFacet} from '@knaw-huc/faceted-search-react';
import {Facet, TextFacet, RangeFacet, useFacets} from 'queries/facets';
import useFacet from 'hooks/useFacet';
import useDataset from 'hooks/useDataset';

export default function Facets() {
    const {dataset} = useDataset('/$dataset');
    const {data: facets} = useFacets(dataset);

    return (
        <FacetsSection>
            <HookedSearchFacet label="Search for"/>

            {facets.map((facet, index) =>
                <FacetRendering key={index} facet={facet}/>)}
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
        <HookedRangeFacet facetKey={facet.property} label={facet.name}
                          min={facet.min} max={facet.max} step={facet.step}/>
    );
}

function TextFacetRendering({facet}: { facet: TextFacet }) {
    const {dataset} = useDataset('/$dataset');
    const {fetchItemsFn} = useFacet(dataset, facet.property);

    return (
        <HookedFilterFacet facetKey={facet.property} label={facet.name} fetchItemsFn={fetchItemsFn}/>
    );
}
