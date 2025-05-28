import {setPanoptesUrl, setupRouter} from '../lib';

setPanoptesUrl('https://panoptes.dev.diginfra.org');
setupRouter(document.getElementById('root')!);
