import {FC, lazy, Suspense} from 'react';
import Spinner from 'components/utils/Spinner';

export type BlockValue = string | object | Block[];

export interface Block {
    type: string;
    value: BlockValue;
}

const blocks = import.meta.glob('./*/index.tsx') as Record<string, () => Promise<{ default: FC<{ block: Block }> }>>;

function importBlock(block: Block): FC<{ block: Block }> {
    const importer = blocks[`./${block.type}/index.tsx`];
    if (!importer) {
        throw new Error(`Unknown block: ${block.type}`);
    }

    return lazy(importer);
}

export default function BlockLoader({block}: { block: Block }) {
    const BlockComponent = importBlock(block);

    return (
        <Suspense fallback={<Spinner/>}>
            <BlockComponent block={block}/>
        </Suspense>
    );
}
