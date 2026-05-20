import {HookedResultsView} from '@knaw-huc/faceted-search-react';
import {useRouter} from '@tanstack/react-router';
import useDataset from 'hooks/useDataset';
import usePanoptes from 'hooks/usePanoptes';
import {SearchResponseItem} from 'queries/search';
import ResultCard from 'components/blocks/result-card/ResultCard';

export default function Results() {
    const router = useRouter();
    const {detailPath} = usePanoptes();
    const [dataset] = useDataset('search');

    return (
        <HookedResultsView<SearchResponseItem> id={result => result.id}>
            {result =>
                <ResultCard {...result}
                            link={router.buildLocation({to: detailPath, params: {dataset, id: result.id}}).href}/>}
        </HookedResultsView>
    );
}
