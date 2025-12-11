import {get} from "radash";
import {useDatasets, useTranslations} from "hooks/index.ts";
import {DatasetResponseItem} from "queries/datasets.ts";
import {useMemo} from "react";
import classes from "./NavigationBar.module.css";

export type NavItem = {
    href: string;
    label: string;
};

/**
 * Creates a navigation bar for display at the top of the screen (for example...)
 *
 * In creating the option, this component uses the available data sets and fetches the home_url from the data_configuration
 * object present in each data set configuration row for the tenant. It also prepends a go home link as first nav item,
 * pointing to '/'.
 */

const HOME_URL_KEY = 'data_configuration.home_url';
const NAME_KEY = 'name';
const HOME_KEY = 'home';

const NavigationBar = () => {

    const {data: datasets} = useDatasets();
    const {data: translations} = useTranslations();
    const homeNavItem = { 'href': '/', label: get(translations, HOME_KEY, '') };

    const navItems = useMemo(() =>
        datasets.reduce((acc: NavItem[], val: DatasetResponseItem) => {
            return [ ...acc, {
                href: get(val, HOME_URL_KEY, ''),
                label: get(translations, get(val, NAME_KEY, ''), '')
            } ];
        }, [ homeNavItem ]), [ datasets, translations ]);

    return (<nav className={classes.navigation}
             aria-label={get(translations, 'mainSiteNavigation', "Main site navigation")}>
        {navItems.map((item: NavItem) => <a key={item.href} href={item.href}>{item.label}</a>)}
    </nav>);

};

export default NavigationBar;