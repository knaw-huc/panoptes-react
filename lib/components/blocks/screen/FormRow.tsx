import { RowDefinition } from '../../../schema';
import usePanoptes from 'hooks/usePanoptes';
import FormColumn from './FormColumn';
import FormElement from './FormElement';
import styles from './FormRow.module.css';

interface FormRowProps {
    row: RowDefinition;
}

export default function FormRow({ row }: FormRowProps) {
    const { translateFn } = usePanoptes();
    const translate = (key: string): string => translateFn ? translateFn(key) : key;

    const displayType = row.displayType || 'row';
    const hasColumns = row.columns && row.columns.length > 0;
    const hasElements = row.elements && row.elements.length > 0;

    const getRowClassName = () => {
        const classes = [styles.row];
        switch (displayType) {
            case 'header':
                classes.push(styles.header);
                break;
            case 'group':
                classes.push(styles.group);
                break;
            case 'footer':
                classes.push(styles.footer);
                break;
        }
        return classes.join(' ');
    };

    return (
        <fieldset
            className={getRowClassName()}
            data-group-id={row.groupId}>
            {/* Group label/legend */}
            {row.label && (
                <legend className={styles.label}>
                    {translate(row.label)}
                </legend>
            )}

            {/* Render columns if present */}
            {hasColumns && (
                <div className={styles.columns}>
                    {row.columns!.map((column, index) => (
                        <FormColumn key={`column-${index}`} column={column} />
                    ))}
                </div>
            )}

            {/* Render elements directly if no columns */}
            {!hasColumns && hasElements && (
                <div className={styles.elements}>
                    {row.elements!.map((element, index) => (
                        <FormElement key={`element-${index}`} element={element} />
                    ))}
                </div>
            )}
        </fieldset>
    );
}
