import classes from './Header.module.css';

export default function Header() {
    return (
        <header className={classes.header}>
            <div className={classes.content}>
                <div className={classes.branding}>
                    <a href="/">
                        Panoptes
                    </a>
                </div>

                <HeaderNavigation/>
            </div>
        </header>
    );
}

function HeaderNavigation() {
    return (
        <nav className={classes.navigation} aria-label="Main site navigation">
            <a href="/">Home</a>
        </nav>
    );
}
