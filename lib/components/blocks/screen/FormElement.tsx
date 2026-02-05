import { ElementDefinition } from '../../../schema';
import { useElementState } from 'hooks/useScreenState.ts';
import usePanoptes from 'hooks/usePanoptes';
import styles from './FormElement.module.css';

interface FormElementProps {
    element: ElementDefinition;
}

export default function FormElement({ element }: FormElementProps) {
    const { translateFn } = usePanoptes();
    const translate = (key: string): string => translateFn ? translateFn(key) : key;

    const {
        value,
        isDirty,
        isTouched,
        error,
        onChange,
        onBlur,
        readOnly,
        required,
        hidden,
        label,
        infoLabel,
    } = useElementState(element);

    // Don't render hidden elements
    if (hidden) {
        return null;
    }

    // Infer element type from value if not specified
    const elementType = element.type || inferElementType(value);

    // Build class names
    const classNames = [
        styles.element,
        isDirty && styles.dirty,
        isTouched && styles.touched,
        error && styles.error,
        readOnly && styles.readonly,
    ].filter(Boolean).join(' ');

    return (
        <div className={classNames} data-binding={element.value}>
            {/* Label */}
            {label && (
                <label className={styles.label}>
                    {translate(label)}
                    {required && <span className={styles.requiredIndicator}>*</span>}
                </label>
            )}

            {/* Input element based on type */}
            {renderInput(elementType, value, onChange, onBlur, readOnly, element)}

            {/* Info label */}
            {infoLabel && (
                <span className={styles.info}>
                    {translate(infoLabel)}
                </span>
            )}

            {/* Error message */}
            {error && (
                <span className={styles.errorMessage}>
                    {error}
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
        // Check if it looks like a date
        if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
            return 'date';
        }
        // Check if it's multiline
        if (value.includes('\n')) {
            return 'textarea';
        }
    }
    return 'text';
}

function renderInput(
    type: string,
    value: unknown,
    onChange: (value: unknown) => void,
    onBlur: () => void,
    readOnly: boolean,
    element: ElementDefinition
) {
    const commonProps = {
        onBlur,
        readOnly,
        disabled: readOnly,
        'aria-label': element.label,
        'aria-required': element.required,
    };

    switch (type) {
        case 'checkbox':
            return (
                <input
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={(e) => onChange(e.target.checked)}
                    {...commonProps}
                />
            );

        case 'number':
            return (
                <input
                    type="number"
                    value={value as number ?? ''}
                    onChange={(e) => onChange(e.target.valueAsNumber || null)}
                    {...commonProps}
                />
            );

        case 'date':
            return (
                <input
                    type="date"
                    value={String(value ?? '')}
                    onChange={(e) => onChange(e.target.value)}
                    {...commonProps}
                />
            );

        case 'textarea':
            return (
                <textarea
                    value={String(value ?? '')}
                    onChange={(e) => onChange(e.target.value)}
                    {...commonProps}
                />
            );

        case 'array':
            return (
                <ArrayInput
                    value={value as unknown[]}
                    onChange={onChange}
                    onBlur={onBlur}
                    readOnly={readOnly}
                    element={element}
                />
            );

        case 'select':
            // For select, we need options from config
            const options = (element.config?.options as Array<{ value: string; label: string }>) || [];
            return (
                <select
                    value={String(value ?? '')}
                    onChange={(e) => onChange(e.target.value)}
                    {...commonProps}
                >
                    <option value="">-- Select --</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            );

        case 'text':
        default:
            return (
                <input
                    type="text"
                    value={String(value ?? '')}
                    onChange={(e) => onChange(e.target.value)}
                    {...commonProps}
                />
            );
    }
}

// ============================================
// Array Input Component
// ============================================

interface ItemTemplate {
    [key: string]: {
        label: string;
        type: string;
    };
}

interface ArrayInputProps {
    value: unknown[];
    onChange: (value: unknown) => void;
    onBlur: () => void;
    readOnly: boolean;
    element: ElementDefinition;
}

function ArrayInput({ value, onChange, onBlur, readOnly, element }: ArrayInputProps) {
    const items = Array.isArray(value) ? value : [];
    const itemTemplate = element.config?.itemTemplate as ItemTemplate | undefined;
    const hideAddButton = element.config?.hideAddButton as boolean ?? false;
    const hideRemoveButton = element.config?.hideRemoveButton as boolean ?? false;

    const handleItemChange = (index: number, newItemValue: unknown) => {
        const newItems = [...items];
        newItems[index] = newItemValue;
        onChange(newItems);
    };

    const handleFieldChange = (index: number, field: string, fieldValue: unknown) => {
        const newItems = [...items];
        newItems[index] = {
            ...(newItems[index] as Record<string, unknown>),
            [field]: fieldValue,
        };
        onChange(newItems);
    };

    const handleAddItem = () => {
        if (itemTemplate) {
            // Create empty object based on template
            const newItem: Record<string, unknown> = {};
            for (const key of Object.keys(itemTemplate)) {
                newItem[key] = null;
            }
            onChange([...items, newItem]);
        } else {
            onChange([...items, '']);
        }
    };

    const handleRemoveItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        onChange(newItems);
    };

    // Render array of objects with template
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
                                        onChange={(e) => handleFieldChange(index, field, e.target.value || null)}
                                        onBlur={onBlur}
                                        readOnly={readOnly}
                                        disabled={readOnly}
                                    />
                                </div>
                            ))}
                        </div>
                        {!readOnly && (
                            <button
                                type="button"
                                className={styles.arrayRemoveButton}
                                onClick={() => handleRemoveItem(index)}
                                aria-label="Remove item"
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}
                {!readOnly && (
                    <button
                        type="button"
                        className={styles.arrayAddButton}
                        onClick={handleAddItem}
                    >
                        + Add
                    </button>
                )}
            </div>
        );
    }

    // Render simple array of values
    return (
        <div className={styles.arrayInput}>
            {items.map((item, index) => (
                <div key={index} className={styles.arrayItem}>
                    <input
                        type="text"
                        value={String(item ?? '')}
                        onChange={(e) => handleItemChange(index, e.target.value)}
                        onBlur={onBlur}
                        readOnly={readOnly}
                        disabled={readOnly}
                    />
                    {!readOnly && (
                        <button
                            type="button"
                            className={styles.arrayRemoveButton}
                            onClick={() => handleRemoveItem(index)}
                            aria-label="Remove item"
                        >
                            ×
                        </button>
                    )}
                </div>
            ))}
            {!readOnly && (
                <button
                    type="button"
                    className={styles.arrayAddButton}
                    onClick={handleAddItem}
                >
                    + Add
                </button>
            )}
        </div>
    );
}
