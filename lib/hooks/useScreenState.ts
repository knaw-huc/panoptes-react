import { useCallback } from 'react';
import { useScreenContext } from '../context';
import { getNestedValue, parseBinding } from '../schema';

export default function useScreenState() {
    const { data } = useScreenContext();

    const getValue = useCallback((expression: string): unknown => {
        const { path } = parseBinding(expression);
        return getNestedValue(data, path);
    }, [data]);

    return { getValue };
}
