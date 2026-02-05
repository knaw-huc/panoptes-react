import { useMemo } from 'react';
import { useScreenContext } from '../context';
import {
    isBindingExpression,
    getFormValue,
    resolveOperationParameters,
} from '../schema';
import { OperationDefinition } from '../schema';

export interface UseDataBindingResult {
    resolve: (expression: string) => unknown;
    resolveIfBinding: (value: string | number | boolean) => unknown;
    resolveParameters: (parameters: Record<string, string | number | boolean>) => Record<string, unknown>;
}

export default function useDataBinding(): UseDataBindingResult {
    const { bindingContext } = useScreenContext();

    return useMemo(() => ({
        resolve: (expression: string): unknown => {
            return getFormValue(bindingContext, expression);
        },

        resolveIfBinding: (value: string | number | boolean): unknown => {
            if (typeof value === 'string' && isBindingExpression(value)) {
                return getFormValue(bindingContext, value);
            }
            return value;
        },

        resolveParameters: (parameters: Record<string, string | number | boolean>): Record<string, unknown> => {
            return resolveOperationParameters(parameters, bindingContext);
        },
    }), [bindingContext]);
}

// Hook to resolve operation parameters
export function useOperationParameters(operation: OperationDefinition | undefined): Record<string, unknown> {
    const { bindingContext } = useScreenContext();

    return useMemo(() => {
        if (!operation) {
            return {};
        }
        return resolveOperationParameters(operation.parameters, bindingContext);
    }, [operation, bindingContext]);
}
