import {setPanoptesUrl, setupRouter} from '../lib';

const panoptesUrlEnv = '$VITE_PANOPTES_URL';
const panoptesUrl = panoptesUrlEnv.startsWith('$VITE_')
    ? ('VITE_PANOPTES_URL' in import.meta.env ? import.meta.env.VITE_PANOPTES_URL : '')
    : panoptesUrlEnv;

setPanoptesUrl(panoptesUrl);
setupRouter(document.getElementById('root')!);
