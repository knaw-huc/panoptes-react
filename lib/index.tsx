import {StrictMode} from 'react';
import {Container, createRoot} from 'react-dom/client';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {createRoute, createRootRoute, createRouter, RouterProvider} from '@tanstack/react-router';
import Panoptes, {PanoptesConfiguration} from 'context/Panoptes';
import usePanoptes from 'hooks/usePanoptes';
import Root from 'components/root/Root';
import Spinner from 'components/utils/Spinner';

export function setupRouter(container: Container, configuration: Partial<PanoptesConfiguration> = {}, queryClient?: QueryClient) {
    function PanoptesProvider() {
        const {searchPath, searchComponent, detailPath, detailComponent} = usePanoptes();
        queryClient ??= new QueryClient();

        const rootRoute = createRootRoute({
            component: () => <Root/>
        });

        const searchRoute = createRoute({
            path: searchPath,
            getParentRoute: () => rootRoute,
            component: searchComponent
        });

        const detailRoute = createRoute({
            path: detailPath,
            getParentRoute: () => rootRoute,
            component: detailComponent
        });

        const routeTree = rootRoute.addChildren([
            searchRoute.addChildren([detailRoute])
        ]);

        const router = createRouter({
            routeTree,
            defaultPreload: 'intent',
            defaultPreloadStaleTime: 0,
            defaultPendingComponent: Spinner,
            defaultNotFoundComponent: () => <div><h2>Not found!</h2></div>,
        });

        return (
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router}/>
            </QueryClientProvider>
        );
    }

    createRoot(container).render(
        <StrictMode>
            <Panoptes configuration={configuration}>
                <PanoptesProvider/>
            </Panoptes>
        </StrictMode>
    );
}
