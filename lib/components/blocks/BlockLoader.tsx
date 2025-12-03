import { ComponentType, FC, lazy, Suspense } from 'react';
import Spinner from 'components/utils/Spinner';

export type BlockValue = string | Record<string, unknown> | Block[];
export type Schema = Record<string, any>;

export interface Block {
    type: string;
    value: BlockValue;
    schema: Schema | {};
}

export interface BlockComponentProps {
    block: Block;
}

export type BlockComponent = ComponentType<BlockComponentProps>;
type BlockImporter = () => Promise<{ default: BlockComponent }>;

const registry = new Map<string, BlockComponent>();
const lazyRegistry = new Map<string, BlockImporter>();

/**
 * Register a component directly (for pre-loaded components)
 */
export function registerBlock(type: string, component: BlockComponent): void {
    registry.set(type, component);
}

/**
 * Register a lazy-loaded component
 */
export function registerBlockLazy(type: string, importer: BlockImporter): void {
    lazyRegistry.set(type, importer);
}

/**
 * Bulk register multiple lazy components
 */
export function registerBlocksLazy(
    components: Record<string, BlockImporter>
): void {
    Object.entries(components).forEach(([type, importer]) => {
        registerBlockLazy(type, importer);
    });
}

/**
 * Get a component by type
 */
export function getBlock(type: string): BlockComponent {
    // Check if already loaded
    const loaded = registry.get(type);
    if (loaded) {
        return loaded;
    }

    // Check if lazy loader exists
    const importer = lazyRegistry.get(type);
    if (importer) {
        const LazyComponent = lazy(importer);
        // Cache the lazy component
        registry.set(type, LazyComponent);
        return LazyComponent;
    }

    throw new Error(`Unknown block type: ${type}`);
}

/**
 * Check if a component type is registered
 */
export function hasBlock(type: string): boolean {
    return registry.has(type) || lazyRegistry.has(type);
}

/**
 * Get all registered types
 */
export function getRegisteredBlockTypes(): string[] {
    return [
        ...new Set([
            ...registry.keys(),
            ...lazyRegistry.keys(),
        ]),
    ];
}

/**
 * Initialize the block registry
 */
export function initializeBlockRegistry(): void {
    const blocks = import.meta.glob('./*/index.tsx') as Record<
        string,
        BlockImporter
    >;

    Object.entries(blocks).forEach(([path, importer]) => {
        // './heading/index.tsx' -> 'heading'
        const type = path.split('/')?.[1];
        if (type) {
            registerBlockLazy(type, importer);
        }
    });
}

/**
 * Clear the registry
 */
export function clearBlockRegistry(): void {
    registry.clear();
    lazyRegistry.clear();
}

// BlockLoader component
const BlockLoader: FC<{ block: Block }> = ({ block }) => {
    const BlockComponent = getBlock(block.type);

    return (
        <Suspense fallback={<Spinner />}>
            <BlockComponent block={block} />
        </Suspense>
    );
};

export default BlockLoader;
