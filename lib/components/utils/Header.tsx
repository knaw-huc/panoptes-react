import {ReactNode} from 'react';
import classes from './Header.module.css';
import NavigationBar from "./NavigationBar.tsx";

export default function Header({branding}: { branding: ReactNode }) {

    return (
        <header className={classes.header}>
            <div className={classes.content}>
                <div className={classes.branding}>
                    <a href="/">{branding}</a>
                </div>
                <NavigationBar />
            </div>
        </header>
    );

}
