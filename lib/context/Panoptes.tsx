import {createContext} from 'react';
import Search from 'components/search/Search';
import Detail from 'components/detail/Detail';
import ResultCard from 'components/search/ResultCard';

import type {ReactNode, FC} from 'react';
import type {AnyRoute, RouteComponent} from '@tanstack/react-router';
import type {TranslateFn} from '@knaw-huc/faceted-search-react';
import type Block from 'components/blocks/Block';
import type {SearchResponseItem} from 'queries/search';

export type PanoptesRoutesFactory = (rootRoute: AnyRoute) => AnyRoute[];

export interface NavItem {
    href: string;
    label: string;
    labelKey?: string;
}

export interface PanoptesConfiguration<S extends SearchResponseItem = SearchResponseItem, B extends Block = Block> {
    url: string;
    isEmbedded: boolean;
    searchPath: string;
    detailPath: string;
    branding: string;
    navItems: NavItem[];
    dataset?: string;
    theme?: 'ineo' | 'huygens' | 'meertens' | 'iisg';
    searchComponent: RouteComponent;
    detailComponent: RouteComponent;
    resultCardRenderer: (result: S, link: string) => ReactNode;
    translateFn?: TranslateFn;
    blocks: Map<string, FC<{ block: B }>>;
    routes?: PanoptesRoutesFactory;
}

export const PanoptesContext = createContext<PanoptesConfiguration<any, any> | null>(null);

export default function Panoptes<S extends SearchResponseItem = SearchResponseItem, B extends Block = Block>
({
     configuration = {},
     children
 }: {
    configuration: Partial<PanoptesConfiguration<S, B>>;
    children: ReactNode;
}) {
    const config: PanoptesConfiguration<S, B> = {
        url: configuration.url || '/',
        isEmbedded: configuration.isEmbedded || false,
        searchPath: (() => {
            if (configuration.searchPath && !configuration.searchPath.includes('$dataset') && !configuration.dataset) {
                throw new Error('searchPath must include the $dataset route segment or a dataset must be provided');
            }

            return configuration.searchPath || '/$dataset';
        })(),
        detailPath: (() => {
            if (configuration.detailPath) {
                if (!configuration.detailPath.includes('$dataset') && !configuration.dataset) {
                    throw new Error('detailPath must include the $dataset route segment or a dataset must be provided');
                }
                if (!configuration.detailPath.includes('$id')) {
                    throw new Error('detailPath must include the $id route segment');
                }
            }

            return configuration.detailPath || '/$dataset/$id';
        })(),
        dataset: configuration.dataset,
        branding: configuration.branding ? configuration.branding : 'Panoptes',
        navItems: configuration.navItems ? configuration.navItems : [{
            label: "Home",
            href: "/"
        }],
        theme: configuration.theme && ['ineo', 'huygens', 'meertens', 'iisg'].includes(configuration.theme) ? configuration.theme : undefined,
        searchComponent: configuration.searchComponent || Search,
        detailComponent: configuration.detailComponent || Detail,
        resultCardRenderer: configuration.resultCardRenderer ||
            ((result, link) => <ResultCard {...result} link={link}/>),
        blocks: configuration.blocks || new Map(),
        translateFn: configuration.translateFn,
        routes: configuration.routes
    };

    switch (config.theme) {
        case 'ineo':
            import('@knaw-huc/faceted-search-react/ineo.css');
            break;
        case 'huygens':
            import('@knaw-huc/faceted-search-react/huygens.css');
            break;
        case 'meertens':
            import('@knaw-huc/faceted-search-react/meertens.css');
            break;
        case 'iisg':
            import('@knaw-huc/faceted-search-react/iisg.css');
            break;
    }

    return (
        <PanoptesContext.Provider value={config}>
            {children}
        </PanoptesContext.Provider>
    );
}
