import {Outlet} from '@tanstack/react-router';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {TanStackRouterDevtools} from '@tanstack/react-router-devtools';
import QueryStateBoundary from './QuerySateBoudary';
import Header from 'components/utils/Header';
import usePanoptes from 'hooks/usePanoptes';
import classes from './PanoptesRoot.module.css';

export default function PanoptesRoot() {
    const {isEmbedded} = usePanoptes();

    if (isEmbedded) {
        return <PanoptesOutlet/>;
    }

    return (
        <div className={classes.root}>
            <Header branding="Panoptes" navigation={{'/': 'Home'}}/>
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
