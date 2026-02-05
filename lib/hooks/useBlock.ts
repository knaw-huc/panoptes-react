import {FC, lazy} from 'react';
import Block from 'components/blocks/Block';
import usePanoptes from 'hooks/usePanoptes';

const blocks = import.meta.glob('../components/blocks/*/index.tsx') as Record<string, () => Promise<{
    default: FC<{ block: Block }>
}>>;

export default function useBlock(block: Block): FC<{ block: Block }> {
    const {blocks: customBlocks} = usePanoptes();

    const importer = blocks[`../components/blocks/${block.type}/index.tsx`];
    if (importer) {
        return lazy(importer);
    }

    if (customBlocks.has(block.type)) {
        return customBlocks.get(block.type) as FC<{ block: Block }>;
    }

    throw new Error(`Unknown block: ${block.type}`);
}
