import {useMemo} from 'react';
import Block from 'components/blocks/Block';
import {CmdiRecord, mapCmdiRecord} from 'components/blocks/cmdi/cmdi';
import PropertyList from 'components/blocks/list/PropertyList';

export interface CmdiBlock extends Block {
    type: 'cmdi';
    value: CmdiRecord;
}

export default function RenderCmdi({block}: { block: CmdiBlock }) {
    const data = useMemo(() => mapCmdiRecord(block.value), [block.value]);

    return (
        <PropertyList data={data}/>
    );
}
