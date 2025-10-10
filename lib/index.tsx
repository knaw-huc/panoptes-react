import {ReactNode, StrictMode} from 'react';
import {Root, Container, createRoot} from 'react-dom/client';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Panoptes, {PanoptesConfiguration} from 'context/Panoptes';
import '@knaw-huc/faceted-search-react/style.css';

export * from 'components/root';
export * from 'components/utils';
export * from 'hooks/index';

export function createPanoptesRoot(container: Container, configuration: Partial<PanoptesConfiguration> = {},
                                   queryClient?: QueryClient): Root {
    const root = createRoot(container);
    queryClient ??= new QueryClient();

    return {
        render: (children: ReactNode) =>
            root.render(<PanoptesRoot configuration={configuration} queryClient={queryClient} children={children}/>),
        unmount: root.unmount
    };
}

function PanoptesRoot({configuration, queryClient, children}: {
    configuration: Partial<PanoptesConfiguration>,
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
