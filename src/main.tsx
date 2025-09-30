import {createPanoptesRoot, PanoptesRouterProvider} from '../lib';

const panoptesUrl = '$VITE_PANOPTES_URL';
const panoptesIsEmbedded = '$VITE_PANOPTES_IS_EMBEDDED';
const panoptesSearchPath = '$VITE_PANOPTES_SEARCH_PATH';
const panoptesDetailPath = '$VITE_PANOPTES_DETAIL_PATH';
const panoptesDataset = '$VITE_PANOPTES_DATASET';

const getVar = (envVariable: string): string | undefined =>
    envVariable.startsWith('$VITE_')
        ? (envVariable.slice(1) in import.meta.env ? import.meta.env[envVariable.slice(1)] : undefined)
        : envVariable;

createPanoptesRoot(document.getElementById('root')!, {
    url: getVar(panoptesUrl),
    isEmbedded: getVar(panoptesIsEmbedded) === 'true',
    searchPath: getVar(panoptesSearchPath),
    detailPath: getVar(panoptesDetailPath),
    dataset: getVar(panoptesDataset),
}).render(<PanoptesRouterProvider/>);
