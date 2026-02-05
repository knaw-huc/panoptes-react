import { useScreenContext } from 'context/ScreenContext';
import usePanoptes from 'hooks/usePanoptes';
import ScreenTabs from './ScreenTabs';
import ScreenForm from './ScreenForm';
import ScreenActions from './ScreenActions';
import ScreenLinks from './ScreenLinks';
import styles from './ScreenRenderer.module.css';

export default function ScreenRenderer() {
    const { screenDefinition } = useScreenContext();
    const { translateFn } = usePanoptes();

    const translate = (key: string): string => {
        return translateFn ? translateFn(key) : key;
    };

    const hasMultipleTabs = screenDefinition.tabs && screenDefinition.tabs.length > 1;
    const hasLinks = screenDefinition.links && screenDefinition.links.length > 0;
    const hasActions = screenDefinition.actions && screenDefinition.actions.length > 0;

    return (
        <div className={styles.screen} data-screen-id={screenDefinition.id}>
            {/* Screen header with label */}
            <header className={styles.header}>
                <h1>{translate(screenDefinition.label)}</h1>
            </header>

            {/* Navigation links */}
            {hasLinks && (
                <nav className={styles.links}>
                    <ScreenLinks />
                </nav>
            )}

            {/* Tabs */}
            {hasMultipleTabs && (
                <nav className={styles.tabs}>
                    <ScreenTabs />
                </nav>
            )}

            {/* Main form content */}
            <main className={styles.content}>
                <ScreenForm />
            </main>

            {/* Action buttons */}
            {hasActions && (
                <footer className={styles.actions}>
                    <ScreenActions />
                </footer>
            )}
        </div>
    );
}
