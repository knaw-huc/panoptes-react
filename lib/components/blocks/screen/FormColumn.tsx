import { ColumnDefinition } from '../../../schema';
import FormElement from './FormElement';
import styles from './FormColumn.module.css';

interface FormColumnProps {
    column: ColumnDefinition;
}

export default function FormColumn({ column }: FormColumnProps) {
    if (!column.elements || column.elements.length === 0) {
        return null;
    }

    return (
        <div className={styles.column}>
            {column.elements.map((element, index) => (
                <FormElement key={`element-${index}`} element={element} />
            ))}
        </div>
    );
}
