import {Outlet} from '@tanstack/react-router';
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
        </QueryStateBoundary>
    );
}
