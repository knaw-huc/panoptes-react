import {setPanoptesUrl, setupRouter} from '../lib';

setPanoptesUrl('https://test-a.panoptes.dev.diginfra.org');
setupRouter(document.getElementById('root')!);
