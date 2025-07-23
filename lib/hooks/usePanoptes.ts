import {useContext} from 'react';
import {PanoptesContext} from 'context/Panoptes';

export default function usePanoptes() {
    const panoptesConfig = useContext(PanoptesContext);
    if (!panoptesConfig) {
        throw new Error('Missing PanoptesContext.Provider in the tree');
    }
    return panoptesConfig;
}
