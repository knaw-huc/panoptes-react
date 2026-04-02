import {ReactNode} from 'react';
import usePanoptes from 'hooks/usePanoptes';
import classes from './Header.module.css';

export default function Header({branding, navigation, children}: {
    branding: ReactNode,
    navigation: Record<string, string>,
    children?: ReactNode,
}) {
    return (
        <header className={classes.header}>
            <div className={classes.content}>
                <div className={classes.branding}>
                    <a href="/">
                        {branding}
                    </a>
                </div>

                {children}

                <HeaderNavigation navigation={navigation}/>
            </div>
        </header>
    );
}

function HeaderNavigation({navigation}: { navigation: Record<string, string> }) {
    const {translateFn} = usePanoptes();

    return (
        <nav className={classes.navigation}
             aria-label={translateFn ? translateFn('panoptes.mainSiteNavigation') : "Main site navigation"}>
            {Object.entries(navigation).map(([href, label]) =>
                <a key={href} href={href}>{label}</a>)}
        </nav>
    );
}
