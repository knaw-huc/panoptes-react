import { useScreenContext } from 'context/ScreenContext';
import FormRow from './FormRow';
import styles from './ScreenForm.module.css';

export default function ScreenForm() {
    const { screenDefinition } = useScreenContext();
    const { form } = screenDefinition;

    if (!form || !form.rows) {
        return null;
    }

    return (
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            {form.rows.map((row, index) => (
                <FormRow key={row.groupId || `row-${index}`} row={row} />
            ))}
        </form>
    );
}
