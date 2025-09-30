import {createContext, ReactNode} from 'react';
import {RouteComponent} from '@tanstack/react-router';
import Search from 'components/search/Search';
import Detail from 'components/detail/Detail';

export interface PanoptesConfiguration {
    url: string;
    isEmbedded: boolean;
    searchPath: string;
    detailPath: string;
    dataset?: string;
    searchComponent: RouteComponent;
    detailComponent: RouteComponent;
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
        searchComponent: configuration.searchComponent || Search,
        detailComponent: configuration.detailComponent || Detail,
    };

    return (
        <PanoptesContext.Provider value={config}>
            {children}
        </PanoptesContext.Provider>
    );
}
