import {ReactNode, StrictMode} from 'react';
import {Root, Container, createRoot} from 'react-dom/client';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {Panoptes, PanoptesConfiguration} from 'context/index';
import '@knaw-huc/faceted-search-react/style.css';
import {SearchResponseItem} from "./queries/search.ts";
import Block from "./components/blocks/Block.ts";

export * from 'components/root';
export * from 'components/utils';
export * from 'components/search';
export * from 'components/blocks';
export * from 'context/index';
export * from 'hooks/index';

export function createPanoptesRoot<S extends SearchResponseItem = SearchResponseItem, B extends Block = Block>
(container: Container, configuration: Partial<PanoptesConfiguration<S, B>> = {}, queryClient?: QueryClient): Root {
    const root = createRoot(container);
    queryClient ??= new QueryClient();

    return {
        render: (children: ReactNode) =>
            root.render(<PanoptesRoot configuration={configuration} queryClient={queryClient} children={children}/>),
        unmount: root.unmount
    };
}

function PanoptesRoot<S extends SearchResponseItem = SearchResponseItem, B extends Block = Block>
({
     configuration,
     queryClient,
     children
 }: {
    configuration: Partial<PanoptesConfiguration<S, B>>,
    queryClient: QueryClient,
    children: ReactNode
}) {
    return (
        <StrictMode>
            <Panoptes configuration={configuration}>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </Panoptes>
        </StrictMode>
    );
}
