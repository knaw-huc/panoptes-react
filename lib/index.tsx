import {StrictMode} from 'react';
import {Container, createRoot} from 'react-dom/client';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {createRoute, AnyRoute, createRootRoute, createRouter, RouterProvider} from '@tanstack/react-router';
import Root from 'components/root/Root';
import Search from 'components/search/Search';
import Detail from 'components/detail/Detail';
export {setPanoptesUrl} from 'utils/panoptesUrl';

export function getSearchRoute(parentRoute: AnyRoute, path: string = '/$dataset') {
    return createRoute({
        path,
        getParentRoute: () => parentRoute,
        component: Search
    });
}

export function getDetailRoute(parentRoute: AnyRoute, path: string = '/$dataset/$id') {
    return createRoute({
        path,
        getParentRoute: () => parentRoute,
        component: Detail
    });
}

export function setupRouter(container: Container, queryClient?: QueryClient, isEmbedded: boolean = false) {
    queryClient ??= new QueryClient();

    const rootRoute = createRootRoute({
        component: () => <Root isEmbedded={isEmbedded}/>
    });

    const routeTree = rootRoute.addChildren([
        getSearchRoute(rootRoute).addChildren([getDetailRoute(rootRoute)])
    ]);

    const router = createRouter({
        routeTree,
        defaultPreload: 'intent',
        defaultPreloadStaleTime: 0,
        // defaultPendingComponent: () => <Spinner type="main"/>,
        // defaultNotFoundComponent: () => <Container><h2>Not found!</h2></Container>,
    });

    createRoot(container).render(
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router}/>
            </QueryClientProvider>
        </StrictMode>
    );
}
