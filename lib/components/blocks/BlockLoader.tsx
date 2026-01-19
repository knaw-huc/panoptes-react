import {FC, lazy, ReactNode, Suspense} from 'react';
import Spinner from 'components/utils/Spinner';

export type BlockValue = string | object | Block[];

export interface Block {
    type: string;
    value: BlockValue;
}

export const blocks = import.meta.glob('./*/index.tsx') as Record<string, () => Promise<{ default: FC<{ block: Block }> }>>;

export function importBlock(block: Block): FC<{ block: Block }> {
    const importer = blocks[`./${block.type}/index.tsx`];
    if (!importer) {
        throw new Error(`Unknown block: ${block.type}`);
    }

    return lazy(importer);
}

type BlockLoaderProps = {
    block: Block;
    fallback?: ReactNode;
}

export default function BlockLoader({ block, fallback = <Spinner /> }: BlockLoaderProps) {
    const BlockComponent = importBlock(block);

    return (
        <Suspense fallback={fallback}>
            <BlockComponent block={block} />
        </Suspense>
    );
}
