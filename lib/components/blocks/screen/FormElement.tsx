import { ElementDefinition } from '../../../schema';
import usePanoptes from 'hooks/usePanoptes';
import useElementState from "hooks/useElementState.ts";
import styles from './FormElement.module.css';

interface FormElementProps {
    element: ElementDefinition;
}

export default function FormElement({ element }: FormElementProps) {
    const { translateFn } = usePanoptes();
    const translate = (key: string): string => translateFn ? translateFn(key) : key;

    const {
        value,
        hidden,
        label,
        infoLabel,
    } = useElementState(element);

    if (hidden) {
        return null;
    }

    const elementType = element.type || inferElementType(value);

    return (
        <div className={styles.element} data-binding={element.value}>
            {label && (
                <label className={styles.label}>
                    {translate(label)}
                </label>
            )}

            {renderValue(elementType, value, element)}

            {infoLabel && (
                <span className={styles.info}>
                    {translate(infoLabel)}
                </span>
            )}
        </div>
    );
}

function inferElementType(value: unknown): string {
    if (Array.isArray(value)) {
        return 'array';
    }
    if (typeof value === 'boolean') {
        return 'checkbox';
    }
    if (typeof value === 'number') {
        return 'number';
    }
    if (typeof value === 'string') {
        if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
            return 'date';
        }
        if (value.includes('\n')) {
            return 'textarea';
        }
    }
    return 'text';
}

function renderValue(
    type: string,
    value: unknown,
    element: ElementDefinition
) {
    const commonProps = {
        readOnly: true,
        disabled: true,
        'aria-label': element.label,
    };

    switch (type) {
        case 'checkbox':
            return (
                <input
                    type="checkbox"
                    checked={Boolean(value)}
                    {...commonProps}
                />
            );

        case 'number':
            return (
                <input
                    type="number"
                    value={value as number ?? ''}
                    {...commonProps}
                />
            );

        case 'date':
            return (
                <input
                    type="date"
                    value={String(value ?? '')}
                    {...commonProps}
                />
            );

        case 'textarea':
            return (
                <textarea
                    value={String(value ?? '')}
                    {...commonProps}
                />
            );

        case 'array':
            return (
                <ArrayDisplay
                    value={value as unknown[]}
                    element={element}
                />
            );

        case 'select': {
            const options = (element.config?.options as Array<{ value: string; label: string }>) || [];
            const selected = options.find(opt => opt.value === String(value ?? ''));
            return (
                <input
                    type="text"
                    value={selected?.label ?? String(value ?? '')}
                    {...commonProps}
                />
            );
        }

        case 'text':
        default:
            return (
                <input
                    type="text"
                    value={String(value ?? '')}
                    {...commonProps}
                />
            );
    }
}

interface ItemTemplate {
    [key: string]: {
        label: string;
        type: string;
    };
}

interface ArrayDisplayProps {
    value: unknown[];
    element: ElementDefinition;
}

function ArrayDisplay({ value, element }: ArrayDisplayProps) {
    const items = Array.isArray(value) ? value : [];
    const itemTemplate = element.config?.itemTemplate as ItemTemplate | undefined;

    if (itemTemplate) {
        return (
            <div className={styles.arrayInput}>
                {items.map((item, index) => (
                    <div key={index} className={styles.arrayItem}>
                        <div className={styles.arrayItemFields}>
                            {Object.entries(itemTemplate).map(([field, config]) => (
                                <div key={field} className={styles.arrayItemField}>
                                    <label className={styles.arrayFieldLabel}>{config.label}</label>
                                    <input
                                        type={config.type === 'number' ? 'number' : 'text'}
                                        value={String((item as Record<string, unknown>)?.[field] ?? '')}
                                        readOnly
                                        disabled
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className={styles.arrayInput}>
            {items.map((item, index) => (
                <div key={index} className={styles.arrayItem}>
                    <input
                        type="text"
                        value={String(item ?? '')}
                        readOnly
                        disabled
                    />
                </div>
            ))}
        </div>
    );
}
