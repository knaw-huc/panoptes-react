import { useMutation, useQuery, useQueryClient, UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { useMemo } from 'react';
import usePanoptes from './usePanoptes';
import { useScreenContext } from '../context';
import { resolveOperationParameters, buildSubmitPayload } from '../schema';
import { OperationDefinition } from '../schema';
import { ResolvedOperation, buildOperationUrl } from '../schema';

export interface UseOperationResult {
    execute: (payload?: Record<string, unknown>) => Promise<unknown>;
    isLoading: boolean;
    isError: boolean;
    error: unknown;
    data: unknown;
}

export interface OperationExecutor {
    baseUrl: string;
    getOperation: (operationId: string) => ResolvedOperation | undefined;
}

export function useOperationExecutor(): OperationExecutor | null {
    const { openApiParser } = usePanoptes() as { openApiParser?: { getOperation: (id: string) => ResolvedOperation | undefined; getBaseUrl: () => string } };

    if (!openApiParser) {
        return null;
    }

    return {
        baseUrl: openApiParser.getBaseUrl(),
        getOperation: (operationId: string) => openApiParser.getOperation(operationId),
    };
}

export function useOperationQuery(
    operationDef: OperationDefinition | undefined,
    executor: OperationExecutor | null,
    additionalParams?: Record<string, unknown>
): UseQueryResult<unknown> {
    const { bindingContext } = useScreenContext();

    const resolvedParams = useMemo(() => {
        if (!operationDef) return {};
        return {
            ...resolveOperationParameters(operationDef.parameters, bindingContext),
            ...additionalParams,
        };
    }, [operationDef, bindingContext, additionalParams]);

    const operation = executor?.getOperation(operationDef?.operationId || '');

    return useQuery({
        queryKey: ['operation', operationDef?.operationId, resolvedParams],
        queryFn: async () => {
            if (!operation || !executor) {
                throw new Error(`Operation not found: ${operationDef?.operationId}`);
            }

            const url = buildOperationUrl(executor.baseUrl, operation, resolvedParams);

            const response = await fetch(url, {
                method: operation.method,
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Operation failed: ${response.statusText}`);
            }

            return response.json();
        },
        enabled: !!operationDef && !!operation && !!executor,
    });
}

export function useOperationMutation(
    operationDef: OperationDefinition | undefined,
    executor: OperationExecutor | null
): UseMutationResult<unknown, Error, Record<string, unknown> | undefined> {
    const { bindingContext } = useScreenContext();
    const queryClient = useQueryClient();

    const resolvedParams = useMemo(() => {
        if (!operationDef) return {};
        return resolveOperationParameters(operationDef.parameters, bindingContext);
    }, [operationDef, bindingContext]);

    const operation = executor?.getOperation(operationDef?.operationId || '');

    return useMutation({
        mutationFn: async (payload?: Record<string, unknown>) => {
            if (!operation || !executor) {
                throw new Error(`Operation not found: ${operationDef?.operationId}`);
            }

            const url = buildOperationUrl(executor.baseUrl, operation, resolvedParams);

            const body = payload || buildSubmitPayload(bindingContext);

            const response = await fetch(url, {
                method: operation.method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: operation.hasRequestBody ? JSON.stringify(body) : undefined,
            });

            if (!response.ok) {
                throw new Error(`Operation failed: ${response.statusText}`);
            }

            // Some operations (DELETE) may not return JSON
            const contentType = response.headers.get('content-type');
            if (contentType?.includes('application/json')) {
                return response.json();
            }

            return null;
        },
        onSuccess: () => {
            // Invalidate related queries to refetch data
            queryClient.invalidateQueries({ queryKey: ['operation'] });
        },
    });
}

export default function useOperation(operationDef: OperationDefinition | undefined): UseOperationResult {
    const executor = useOperationExecutor();
    const mutation = useOperationMutation(operationDef, executor);

    return {
        execute: async (payload?: Record<string, unknown>) => {
            const result = await mutation.mutateAsync(payload);
            return result;
        },
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
        data: mutation.data,
    };
}
