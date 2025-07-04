import {Outlet} from '@tanstack/react-router';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {TanStackRouterDevtools} from '@tanstack/react-router-devtools';
import QueryStateBoundary from './QuerySateBoudary';
import classes from './Root.module.css';

export default function Root({isEmbedded}: { isEmbedded: boolean }) {
    if (isEmbedded) {
        return <PanoptesOutlet/>;
    }

    return (
        <div className={classes.root}>
            <PanoptesOutlet/>
        </div>
    );
}

function PanoptesOutlet() {
    return (
        <QueryStateBoundary>
            <Outlet/>

            <ReactQueryDevtools buttonPosition="bottom-left"/>
            <TanStackRouterDevtools position="bottom-right"/>
        </QueryStateBoundary>
    );
}
