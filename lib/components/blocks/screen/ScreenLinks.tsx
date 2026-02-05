import { useScreenContext } from 'context/ScreenContext';
import usePanoptes from 'hooks/usePanoptes';
import styles from './ScreenLinks.module.css';

export default function ScreenLinks() {
    const { screenDefinition } = useScreenContext();
    const { translateFn } = usePanoptes();
    const translate = (key: string): string => translateFn ? translateFn(key) : key;

    const { links } = screenDefinition;

    if (!links || links.length === 0) {
        return null;
    }

    return (
        <ul className={styles.links}>
            {links.map((link) => (
                <li key={link.id} className={styles.link}>
                    <button
                        className={styles.linkButton}
                        onClick={() => {
                            // TODO: Execute link operation or navigate to href
                            if (link.operation) {
                                console.log('Execute link operation:', link.operation);
                            } else if (link.href) {
                                console.log('Navigate to:', link.href);
                            }
                        }}
                        data-link-id={link.id}
                    >
                        {translate(link.label)}
                    </button>
                </li>
            ))}
        </ul>
    );
}
