import type Block from 'components/blocks/Block';
import PropertyList, {type PropertyListData} from 'components/blocks/list/PropertyList';

export interface ListBlock extends Block {
    type: 'list';
    value: PropertyListData;
}

export default function RenderList({block}: { block: ListBlock }) {
    return (
        <PropertyList data={block.value}/>
    );
}
