import {createContext, ReactNode, FC} from 'react';
import {RouteComponent} from '@tanstack/react-router';
import {TranslateFn} from "@knaw-huc/faceted-search-react";
import Search from 'components/search/Search';
import Detail from 'components/detail/Detail';
import DatasetsOverview from 'components/datasets/DatasetsOverview';
import Block from 'components/blocks/Block';

export interface PanoptesConfiguration {
    url: string;
    isEmbedded: boolean;
    searchPath: string;
    detailPath: string;
    dataset?: string;
    theme?: 'ineo' | 'huygens' | 'meertens' | 'iisg';
    indexComponent: RouteComponent;
    searchComponent: RouteComponent;
    detailComponent: RouteComponent;
    translateFn?: TranslateFn;
    blocks: Map<string, FC<{ block: Block }>>;
}

export const PanoptesContext = createContext<PanoptesConfiguration | null>(null);

export default function Panoptes({configuration = {}, children}: {
    configuration: Partial<PanoptesConfiguration>;
    children: ReactNode;
}) {
    const config: PanoptesConfiguration = {
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
        theme: configuration.theme && ['ineo', 'huygens', 'meertens', 'iisg'].includes(configuration.theme) ? configuration.theme : undefined,
        indexComponent: configuration.indexComponent || DatasetsOverview,
        searchComponent: configuration.searchComponent || Search,
        detailComponent: configuration.detailComponent || Detail,
        blocks: configuration.blocks || new Map(),
        translateFn: configuration.translateFn
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
