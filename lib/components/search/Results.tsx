import {ResultCardBasic, HookedResultsView} from '@knaw-huc/faceted-search-react';
import useDataset from '../../hooks/useDataset.ts';
import {SearchResponseItem} from '../../queries/search.ts';

export default function Results() {
    const {dataset} = useDataset('/$dataset');

    function basicCardMapper(result: SearchResponseItem): {
        title: string;
        link: string;
        description: string;
        tags?: string[]
    } {
        return {
            title: result.title,
            link: `/${dataset}/${result.id}`,
            description: result.description,
            tags: result.tags,
        };
    }

    return (
        <HookedResultsView idKey="id" mapper={basicCardMapper} ResultComponent={ResultCardBasic}/>
    );
}
