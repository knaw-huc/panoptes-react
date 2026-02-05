import { useCallback } from 'react';
import { useScreenContext } from '../context';
import { getFormValue } from '../schema';
import { ElementDefinition } from '../schema';

export interface UseScreenStateResult {
    isDirty: boolean;
    isValid: boolean;
    getValue: (expression: string) => unknown;
    setValue: (expression: string, value: unknown) => void;
    setTouched: (expression: string) => void;
    setError: (expression: string, error: string) => void;
    clearError: (expression: string) => void;
    resetForm: () => void;
    getFieldState: (expression: string) => FieldState;
}

export interface FieldState {
    value: unknown;
    isDirty: boolean;
    isTouched: boolean;
    error: string | undefined;
}

export default function useScreenState(): UseScreenStateResult {
    const { bindingContext, dispatch, isDirty, isValid } = useScreenContext();

    const getValue = useCallback((expression: string): unknown => {
        return getFormValue(bindingContext, expression);
    }, [bindingContext]);

    const setValue = useCallback((expression: string, value: unknown): void => {
        dispatch({ type: 'SET_FIELD_VALUE', path: expression, value });
    }, [dispatch]);

    const setTouched = useCallback((expression: string): void => {
        dispatch({ type: 'SET_FIELD_TOUCHED', path: expression });
    }, [dispatch]);

    const setError = useCallback((expression: string, error: string): void => {
        dispatch({ type: 'SET_FIELD_ERROR', path: expression, error });
    }, [dispatch]);

    const clearError = useCallback((expression: string): void => {
        dispatch({ type: 'CLEAR_FIELD_ERROR', path: expression });
    }, [dispatch]);

    const resetForm = useCallback((): void => {
        dispatch({ type: 'RESET_FORM', initialValues: {} });
    }, [dispatch]);

    const getFieldState = useCallback((expression: string): FieldState => {
        return {
            value: getFormValue(bindingContext, expression),
            isDirty: bindingContext.formState.dirty.has(expression),
            isTouched: bindingContext.formState.touched.has(expression),
            error: bindingContext.formState.errors[expression],
        };
    }, [bindingContext]);

    return {
        isDirty,
        isValid,
        getValue,
        setValue,
        setTouched,
        setError,
        clearError,
        resetForm,
        getFieldState,
    };
}

export function useElementState(element: ElementDefinition) {
    const { setValue, setTouched, getFieldState } = useScreenState();
    const expression = element.value;

    const fieldState = getFieldState(expression);

    const handleChange = useCallback((newValue: unknown) => {
        if (!element.readOnly && element.bind !== false) {
            setValue(expression, newValue);
        }
    }, [expression, element.readOnly, element.bind, setValue]);

    const handleBlur = useCallback(() => {
        setTouched(expression);
    }, [expression, setTouched]);

    return {
        value: fieldState.value,
        isDirty: fieldState.isDirty,
        isTouched: fieldState.isTouched,
        error: fieldState.error,
        onChange: handleChange,
        onBlur: handleBlur,
        readOnly: element.readOnly ?? false,
        required: element.required ?? false,
        hidden: element.hidden ?? false,
        label: element.label,
        infoLabel: element.infoLabel,
    };
}
