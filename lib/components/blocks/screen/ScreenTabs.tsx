import { useScreenContext } from 'context/ScreenContext.tsx';
import usePanoptes from 'hooks/usePanoptes';
import styles from './ScreenTabs.module.css';

export default function ScreenTabs() {
    const { screenDefinition, activeTabId, setActiveTabId } = useScreenContext();
    const { translateFn } = usePanoptes();
    const translate = (key: string): string => translateFn ? translateFn(key) : key;

    const { tabs } = screenDefinition;

    if (tabs.length <= 1) {
        return null;
    }

    return (
        <ul className={styles.tabs} role="tablist">
            {tabs.map((tab) => {
                const isActive = tab.id === activeTabId;
                const hasSubItems = tab.operationList && tab.operationList.length > 0;

                return (
                    <li key={tab.id}
                        className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
                        role="presentation">
                        <button
                            role="tab"
                            aria-selected={isActive}
                            aria-controls={`panel-${tab.id}`}
                            onClick={() => setActiveTabId(tab.id)}
                            className={styles.tabButton}>
                            {translate(tab.label)}
                        </button>

                        {/* Sub-navigation for operationList */}
                        {hasSubItems && isActive && (
                            <ul className={styles.subnav}>
                                {tab.operationList!.map((item) => (
                                    <li key={item.id} className={styles.subitem}>
                                        <button
                                            className={styles.subitemButton}
                                            onClick={() => {
                                                // TODO: Load data via operation
                                                console.log('Load operation:', item.operation);
                                            }}>
                                            {translate(item.label)}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                );
            })}
        </ul>
    );
}
