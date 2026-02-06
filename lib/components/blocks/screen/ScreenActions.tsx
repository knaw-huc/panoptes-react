import { useState, useCallback } from 'react';
import { useScreenContext } from 'context/ScreenContext';
import usePanoptes from 'hooks/usePanoptes';
import { ActionDefinition } from '../../../schema';
import styles from './ScreenActions.module.css';

export default function ScreenActions() {
    const { screenDefinition } = useScreenContext();

    const { actions } = screenDefinition;

    if (!actions || actions.length === 0) {
        return null;
    }

    return (
        <div className={styles.actions}>
            {actions.map((action) => (
                <ActionButton key={action.id} action={action} />
            ))}
        </div>
    );
}

interface ActionButtonProps {
    action: ActionDefinition;
}

function ActionButton({ action }: ActionButtonProps) {
    const { data } = useScreenContext();
    const { translateFn } = usePanoptes();
    const translate = (key: string): string => translateFn ? translateFn(key) : key;

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isExecuting, setIsExecuting] = useState(false);

    const executeAction = useCallback(async () => {
        setIsExecuting(true);
        try {
            // TODO: Execute operation via useOperation hook
            console.log('Executing operation:', action.operation, 'with data:', data);
        } finally {
            setIsExecuting(false);
            setShowConfirmation(false);
        }
    }, [action.operation, data]);

    const needsConfirmation = action.confirmation.askConfirmation === 'always';

    const handleClick = useCallback(() => {
        if (needsConfirmation) {
            setShowConfirmation(true);
        } else {
            executeAction();
        }
    }, [needsConfirmation, executeAction]);

    const handleConfirm = useCallback(() => {
        executeAction();
    }, [executeAction]);

    const handleCancel = useCallback(() => {
        setShowConfirmation(false);
    }, []);

    const labels = action.confirmation.labels;

    return (
        <>
            <button
                className={styles.button}
                onClick={handleClick}
                disabled={isExecuting}
                data-action-id={action.id}
            >
                {isExecuting ? '...' : translate(action.label)}
            </button>

            {showConfirmation && (
                <div className={styles.confirmationOverlay}>
                    <div className={styles.confirmationDialog} role="dialog" aria-modal="true">
                        {labels?.title && (
                            <h2 className={styles.confirmationTitle}>
                                {translate(labels.title)}
                            </h2>
                        )}
                        {labels?.message && (
                            <p className={styles.confirmationMessage}>
                                {translate(labels.message)}
                            </p>
                        )}
                        <div className={styles.confirmationActions}>
                            <button
                                className={styles.confirmationCancel}
                                onClick={handleCancel}
                            >
                                {labels?.cancel ? translate(labels.cancel) : 'Cancel'}
                            </button>
                            <button
                                className={styles.confirmationOk}
                                onClick={handleConfirm}
                            >
                                {labels?.ok ? translate(labels.ok) : 'OK'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
