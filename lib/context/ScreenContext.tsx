import { createContext, useContext, useReducer, ReactNode, useMemo } from 'react';
import { ScreenDefinition } from '../schema';

export interface ScreenContextValue {
    screenDefinition: ScreenDefinition;
    data: Record<string, unknown>;
    activeTabId: string;
    setActiveTabId: (tabId: string) => void;
}

const ScreenContext = createContext<ScreenContextValue | null>(null);

export interface ScreenProviderProps {
    screenDefinition: ScreenDefinition;
    data: Record<string, unknown>;
    children: ReactNode;
}

export function ScreenProvider({ screenDefinition, data, children }: ScreenProviderProps) {
    const [activeTabId, setActiveTabId] = useReducer(
        (_: string, newTabId: string) => newTabId,
        screenDefinition.activeTabId || screenDefinition.tabs[0]?.id || ''
    );

    const contextValue = useMemo<ScreenContextValue>(() => ({
        screenDefinition,
        data,
        activeTabId,
        setActiveTabId,
    }), [screenDefinition, data, activeTabId]);

    return (
        <ScreenContext.Provider value={contextValue}>
            {children}
        </ScreenContext.Provider>
    );
}

export function useScreenContext(): ScreenContextValue {
    const context = useContext(ScreenContext);
    if (!context) {
        throw new Error('useScreenContext must be used within a ScreenProvider');
    }
    return context;
}

export default ScreenContext;
