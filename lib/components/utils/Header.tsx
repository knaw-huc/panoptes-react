import type {ReactNode} from 'react';
import usePanoptes from 'hooks/usePanoptes';
import classes from './Header.module.css';
import type {NavItem} from "context/Panoptes.tsx";
import {Link} from "@tanstack/react-router";

export default function Header({branding, navigation, children}: {
    branding: ReactNode,
    navigation: NavItem[],
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

function HeaderNavigation({navigation}: { navigation: NavItem[] }) {
    const {translateFn} = usePanoptes();

    return (
        <nav className={classes.navigation}
             aria-label={translateFn ? translateFn('panoptes.mainSiteNavigation') : "Main site navigation"}>
            {navigation.map(item => {
                const type = item.href.startsWith('/') ? 'local' : 'external';


                
                if (type == "local") {
                    return <Link to={item.href}>{item.label}</Link>
                }
                
                if (type == "external") {
                    return <a key={item.href} href={item.href}>{item.label}</a>
                }
            })}
        </nav>
    );
}
