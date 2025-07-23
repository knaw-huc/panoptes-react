import {Outlet} from '@tanstack/react-router';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {TanStackRouterDevtools} from '@tanstack/react-router-devtools';
import usePanoptes from 'hooks/usePanoptes';
import Header from './Header';
import QueryStateBoundary from './QuerySateBoudary';
import classes from './Root.module.css';

export default function Root() {
    const {isEmbedded} = usePanoptes();

    if (isEmbedded) {
        return <PanoptesOutlet/>;
    }

    return (
        <div className={classes.root}>
            <Header/>
            <PanoptesOutlet/>
        </div>
    );
}

function PanoptesOutlet() {
    return (
        <QueryStateBoundary>
            <Outlet/>

            {import.meta.env.MODE !== 'production' && <>
                <ReactQueryDevtools buttonPosition="bottom-left"/>
                <TanStackRouterDevtools position="bottom-right"/>
            </>}
        </QueryStateBoundary>
    );
}
