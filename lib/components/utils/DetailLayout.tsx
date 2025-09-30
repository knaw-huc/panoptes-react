import {ReactNode} from 'react';
import classes from './DetailLayout.module.css';

export function Root({children}: {children: ReactNode}) {
    return (
        <div className={classes.detail}>
            {children}
        </div>
    );
}

export function Side({children}: {children: ReactNode}) {
    return (
        <div className={classes.side}>
            {children}
        </div>
    );
}

export function Main({children}: {children: ReactNode}) {
    return (
        <div className={classes.main}>
            {children}
        </div>
    );
}
