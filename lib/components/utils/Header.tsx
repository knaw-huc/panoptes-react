import {ReactNode} from 'react';
import classes from './Header.module.css';

export default function Header({branding, navigation}: { branding: ReactNode, navigation: Record<string, string> }) {
    return (
        <header className={classes.header}>
            <div className={classes.content}>
                <div className={classes.branding}>
                    <a href="/">
                        {branding}
                    </a>
                </div>

                <HeaderNavigation navigation={navigation}/>
            </div>
        </header>
    );
}

function HeaderNavigation({navigation}: { navigation: Record<string, string> }) {
    return (
        <nav className={classes.navigation} aria-label="Main site navigation">
            {Object.entries(navigation).map(([href, label]) =>
                <a key={href} href={href}>{label}</a>)}
        </nav>
    );
}
