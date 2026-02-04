import {Suspense} from 'react';
import Spinner from 'components/utils/Spinner';
import useBlock from 'hooks/useBlock';
import Block from './Block';

export default function BlockLoader({block}: { block: Block }) {
    const BlockComponent = useBlock(block);

    return (
        <Suspense fallback={<Spinner/>}>
            <BlockComponent block={block}/>
        </Suspense>
    );
}
