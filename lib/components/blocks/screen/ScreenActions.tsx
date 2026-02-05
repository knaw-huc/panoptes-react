import { useState, useCallback } from 'react';
import { useScreenContext } from 'context/ScreenContext';
import usePanoptes from 'hooks/usePanoptes';
import { ActionDefinition } from '../../../schema';
import styles from './ScreenActions.module.css';

export default function ScreenActions() {
    const { screenDefinition, isDirty, isValid } = useScreenContext();

    const { actions } = screenDefinition;

    if (!actions || actions.length === 0) {
        return null;
    }

    return (
        <div className={styles.actions}>
            {actions.map((action) => (
                <ActionButton key={action.id} action={action} isDirty={isDirty} isValid={isValid} />
            ))}
        </div>
    );
}

interface ActionButtonProps {
    action: ActionDefinition;
    isDirty: boolean;
    isValid: boolean;
}

function ActionButton({ action, isDirty, isValid }: ActionButtonProps) {
    const { bindingContext, dispatch } = useScreenContext();
    const { translateFn } = usePanoptes();
    const translate = (key: string): string => translateFn ? translateFn(key) : key;

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isExecuting, setIsExecuting] = useState(false);

    // Determine if action should be enabled
    const isEnabled = useCallback(() => {
        switch (action.activate) {
            case 'always':
                return true;
            case 'onDirty':
                return isDirty;
            case 'onValid':
                return isValid;
            case 'onDirtyAndValid':
                return isDirty && isValid;
            default:
                return true;
        }
    }, [action.activate, isDirty, isValid]);

    // Determine if confirmation is needed
    const needsConfirmation = useCallback(() => {
        switch (action.confirmation.askConfirmation) {
            case 'always':
                return true;
            case 'never':
                return false;
            case 'onDirty':
                return isDirty;
            default:
                return false;
        }
    }, [action.confirmation.askConfirmation, isDirty]);

    const executeAction = useCallback(async () => {
        setIsExecuting(true);
        try {
            dispatch({ type: 'SUBMIT_START' });

            // TODO: Execute operation via useOperation hook
            console.log('Executing operation:', action.operation, 'with context:', bindingContext);

            dispatch({ type: 'SUBMIT_SUCCESS' });
        } catch (error) {
            dispatch({ type: 'SUBMIT_ERROR', error: String(error) });
        } finally {
            setIsExecuting(false);
            setShowConfirmation(false);
        }
    }, [action.operation, bindingContext, dispatch]);

    const handleClick = useCallback(() => {
        if (needsConfirmation()) {
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
                disabled={!isEnabled() || isExecuting}
                data-action-id={action.id}
            >
                {isExecuting ? '...' : translate(action.label)}
            </button>

            {/* Confirmation dialog */}
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
