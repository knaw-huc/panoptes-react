import {createRootRoute, createRoute, createRouter, RouterProvider} from '@tanstack/react-router';
import usePanoptes from 'hooks/usePanoptes';
import PanoptesRoot from 'components/root/PanoptesRoot';
import Spinner from 'components/utils/Spinner';

export default function PanoptesRouterProvider() {
    const {searchPath, searchComponent, detailPath, detailComponent} = usePanoptes();

    const rootRoute = createRootRoute({
        component: () => <PanoptesRoot/>
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
        <RouterProvider router={router}/>
    );
}
