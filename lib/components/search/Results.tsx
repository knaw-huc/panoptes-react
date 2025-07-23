import {ResultCardBasic, HookedResultsView} from '@knaw-huc/faceted-search-react';
import {useRouter} from '@tanstack/react-router';
import useDataset from 'hooks/useDataset';
import usePanoptes from 'hooks/usePanoptes';
import {SearchResponseItem} from 'queries/search';

export default function Results() {
    const router = useRouter();
    const {detailPath} = usePanoptes();
    const [dataset] = useDataset('search');

    function basicCardMapper(result: SearchResponseItem): {
        title: string;
        link: string;
        description: string;
        tags?: string[]
    } {
        return {
            title: result.title,
            link: router.buildLocation({to: detailPath, params: {dataset, id: result.id}}).href,
            description: result.description,
            tags: result.tags,
        };
    }

    return (
        <HookedResultsView idKey="id" mapper={basicCardMapper} ResultComponent={ResultCardBasic}/>
    );
}
